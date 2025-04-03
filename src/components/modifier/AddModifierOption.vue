<template>
    <div class="modal hide" id="addModifierOptionModal"  tabindex="-1" aria-labelledby="Add Option" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
             <div class="modal-dialog modal-dialog-centered">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title" v-if="form.option_slack != '' && form.option_slack!=undefined">{{ $t('Update Option') }}</h5>
                         <h5 class="modal-title" v-else>{{ $t('Add Option') }}</h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                     </div>
                     <div class="modal-body">
                         <Form
                         :validation-schema="schema"
                         @submit="saveOption"
                         enctype="multipart/form-data"
                         :initial-values="form"
                         id="addOptionForm"
                         >
                         <div class="row">
                                             
                                <div class="col-md-12">
                                    <VTextInput
                                        type="text" 
                                        name="option_name"
                                        v-model="form.option_name"
                                        :label="labels.option_name" 
                                        :required="true"
                                    />
                                </div>
                                <!-- <div class="col-md-12">
                                    <VTextInput
                                        type="text" 
                                        name="option_name_ar"
                                        v-model="form.option_name_ar"
                                        :label="labels.option_name_ar"
                                    />
                                </div> -->

                                <div class="col-12 mb-4">
                                    <VSelectInput
                                        name="pricing_method"
                                        :label="labels.pricing_method"
                                        required
                                        :options="pricing_methods"
                                        v-model="form.pricing_method"
                                        size="normal"
                                    />
                                </div>
                                
                                <div class="col-md-12" v-if="form.pricing_method == 1">
                                    <VTextInput
                                        type="number" 
                                        name="sale_price"
                                        v-model="form.sale_price"
                                        :label="labels.sale_price"
                                        :required="true" 
                                    />
                                </div>
                            </div>
 
                            <div class="py-3" v-if="form.server_messages.messages != ''">
                                <ServerMessage  :server_messages="form.server_messages"  />
                            </div>
                            <div class="mt-2 text-end">
                                <button 
                                type="submit"
                                class="btn btn-primary" 
                                :disabled="form.is_saving"
                                >
                                    <clip-loader v-if="form.is_saving" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                    <span class="pt-0" v-if="form.is_saving">
                                        {{ $t('Saving...') }}
                                    </span>
                                    <span class="pt-0" v-else>
                                        {{ $t('Save') }}
                                    </span> 
    
                                </button>
                            </div>
                         </Form>
                     </div>
                 </div>
             </div>
    </div>     
 </template>
 
 
 <script setup>
     
    import {ref, reactive, watch, computed } from 'vue';
     import { Form, Field, ErrorMessage } from 'vee-validate'
     import * as yup from 'yup';
     import VTextInput from '@/components/common/VTextInput.vue' 
     import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
     
     import { useAuthStore } from '@/stores/auth';
     import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
     import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const labels = ref({
      option_name: t("Option Name"),
      option_name_ar: t("Option Name (Arabic)"),
      pricing_method: t("Pricing Method"),
      sale_price: t("Sale Price")
    });
     const initialState = {
       server_messages: {
         type: "",
         messages: "",
       },
       is_saving: false,
       // form data
       option_slack: "",
       option_name: "",
       option_name_ar: "",
       pricing_method: 1,
       sale_price: "",
     };

     const form = reactive({ ...initialState });

     const authStore = useAuthStore();

     const schema = yup.object({
       option_name: yup.string().required(t('name is required', { name: t('Option Name') })).min(3,t('name must be at least n characters', { name: t('Option Name'), number: 3 })),
       pricing_method: yup.string().required(t('name is required', { name: t('Pricing Method') })),
       sale_price: yup.number().typeError(t('must be a number',{ name: t('Amount') })).min(0, t('Amount must be more than 0')).nullable()
           .when('pricing_method',{
             is: pricing_method=> pricing_method == 1,
             then: (schema) => schema.required(t('name is required', { name: t('Sale Price') })),
             otherwise:(schema) => schema.nullable()
           })
     });

      const pricing_methods = [
        {
          id : "1",
          name: t("Custom Pricing")
        },
        {
          id :  "2",
          name: t("Based On Total Cost of Items Added")
        }
      ];

     const emit = defineEmits(['closeAddModifierOptionModal'])

     const props = defineProps(['show_add_option_modal','edit_data','modifier_slack']);

     function closeModal(slack=''){
         resetData();
         $('#addModifierOptionModal').modal('hide');
         emit('closeAddModifierOptionModal',slack);
     }
     watch(() =>
        props.edit_data,(value) => {
            if(value){
                form.option_slack = value.slack;
                form.option_name = value.option_name;
                form.option_name_ar = value.option_name_ar;
                form.pricing_method = value.pricing_method;
                form.sale_price = value.sale_price;
            }
        }
     );

     async function saveOption(){

         var form_data = new FormData();
         form_data.append('modifier_slack',props.modifier_slack);
         form_data.append('option_name',form.option_name);
         form_data.append('option_name_ar', form.option_name_ar == undefined ? '' : form.option_name_ar);
         form_data.append('pricing_method',form.pricing_method);
         form_data.append('sale_price',form.sale_price);
         form_data.append('option_slack',form.option_slack);
         var submit_url = form.option_slack!='' && form.option_slack!=undefined?'/api/modifier/option/update':'/api/modifier/option/save';

         await axios.post(submit_url, form_data).then( (response) => {

             form.is_saving = true;

             if(response.data.status_code == 200) {

                 toast.success(response.data.msg);
                 form.is_saving = false;
                 document.getElementById('addOptionForm').reset();
                 if(response.data.data.modifier_option.pricing_method==2){
                   closeModal(response.data.data.modifier_option.slack);
                 }else{
                   closeModal();
                 }
             }else{
                 try{
                     form.server_messages.type = "error";
                     form.server_messages.messages = JSON.parse(response.data.msg);
                 }catch(err){
                     form.server_messages.type = "error";
                     form.server_messages.messages = response.data.msg;
                 }
                 form.is_saving = false;
             }

         }).catch((error) => {
             form.server_messages.type = "error";
             form.server_messages.messages = error;
             form.is_saving = false;
             console.log(error);
         });

     }

     function resetData(){
         Object.assign(form, initialState);
        //  $('#addModifierOptionModal').modal('hide');
     }
 
 </script>