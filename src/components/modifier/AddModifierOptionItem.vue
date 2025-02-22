<template>
    <div class="modal hide" id="addModifierOptionItemModal"  tabindex="-1" aria-labelledby="Add Option" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false" >
             <div class="modal-dialog modal-dialog-centered">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title">{{ $t('Add Modifier Product') }}</h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                     </div>
                     <div class="modal-body">
                         <Form
                         :validation-schema="schema"
                         @submit="saveModifierOptionItem"
                         enctype="multipart/form-data"
                         id="addModifierOptionItemForm"
                         >
                         <div class="row">
                            
                            <div class="col-12 mb-3">
                                <AsyncProductSearch
                                    @select-product="selectProduct"
                                    :placeholder="labels.search_placeholder"
                                    :button_placeholder="labels.search_product"
                                    :selected_products="selected_products"
                                />
                            </div>
                            <div class="col-md-12 mb-3" v-if="selected_product_details.name">
                                <label for="">{{ $t('Product') }}</label><br>
                                <span class="badge badge-primary text-primary">{{ selected_product_details.name }}</span>
                            </div>
                            <div class="col-md-12">
                                <VTextInput
                                    type="number" 
                                    name="quantity"
                                    v-model="form.quantity"
                                    :label="labels.quantity"
                                    :required="true" 
                                />
                            </div>

                            <div class="col-12">
                                <label for="">{{ $t('Select Measurement Unit') }}</label>
                                <select name="measurement_unit_id" v-model="form.measurement_unit_id" class="form-control form-control-solid">
                                    <option v-if="product_measurement_units == '' || product_measurement_units == null " value="">{{ $t('Units') }}</option>
                                    <option v-else v-for="(unit,unit_index) in product_measurement_units" :key="unit_index" :value="unit.id" >{{ unit.unit_name }}</option>
                                </select>
                            </div>

                        </div>
                           {{form.server_messages.messages}}
                         <div class="py-3" v-if="form.server_messages.messages != ''">
                             <ServerMessage  :server_messages="form.server_messages"  />
                         </div>
                         <div class="mt-2 text-end">
                             <button 
                             type="submit"
                             class="btn btn-primary" 
                             :disabled="form.is_saving || selected_product_details.slack==null"
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
        search_placeholder: t("Search and Add Product"),
        search_product: t("Search Product"),
        quantity: t("Quantity")
     });
     const AsyncProductSearch = defineAsyncComponent(() => import('@/components/common/ProductSearch.vue'));

     const initialState = {
       server_messages: {
         type: "",
         messages: "",
       },
       is_saving: false,
      
       // form data   
       product_slack: "",
       quantity: "",
       measurement_unit_id: "",
     };
 
     const form = reactive({ ...initialState });
 
     const schema = yup.object({
         quantity: yup.number().typeError(t('must be a number',{ name: t('Quantity') })).required(t('name is required', { name: t('Quantity') })).min(1,t('name must be at least n characters', { name: t('Quantity'), number: 1 })),
     });
 
     const emit = defineEmits(['closeAddModifierOptionItemModal'])
 
     const props = defineProps(['show_add_option_modal','edit_data','modifier_option_slack']);
     const modifier_option_slack = toRef(props,'modifier_option_slack');

     function closeModal(){
         resetData();
         selected_product_details.value = {};
         emit('closeAddModifierOptionItemModal');
         $('#addModifierOptionItemModal').modal('hide');
     }
     
     const selected_products = ref([]);
     
     async function saveModifierOptionItem(){
 
         var form_data = new FormData();
         form_data.append('product_slack',form.product_slack);
         form_data.append('modifier_option_slack',modifier_option_slack.value);
         form_data.append('quantity',form.quantity);
         form_data.append('measurement_unit_id',form.measurement_unit_id);
 
         await axios.post('/api/modifier/option/item/save', form_data).then( (response) => {
             
             form.is_saving = true;
 
             if(response.data.status_code == 200) {
 
                 toast.success(response.data.msg);
                 form.is_saving = false;
                 document.getElementById('addModifierOptionItemForm').reset();
                 closeModal();

 
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

     const product_measurement_units = ref([]);
     const selected_product_details = ref({});
     async function selectProduct(product){
        selected_product_details.value = product;
        form.product_slack = product.slack;

        let form_data = new FormData();
        form_data.append('product_slack',product.slack);

        await axios.post('/api/product/measurements',form_data).then( (response) => {

            product_measurement_units.value = response.data.data;

        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            console.log(error);
        });   

    }
 
     function resetData(){
         Object.assign(form, initialState);
     }

     
 
 </script>