<template>
    <div class="modal hide" id="addBranchBankModal"  tabindex="-1" aria-labelledby="Add Bank" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
             <div class="modal-dialog modal-xl modal-dialog-centered">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title">{{ $t("Add Bank") }}</h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                     </div>
                     <div class="modal-body">
                         <Form
                         :validation-schema="schema"
                         @submit="saveBank"
                         enctype="multipart/form-data"
                         :initial-values="form"
                         >
                         <div class="row">
                                             
                                             <div class="col-md-4">
                                                 <VTextInput
                                                     type="text" 
                                                     name="bank_name"
                                                     v-model="form.bank_name"
                                                     :label="labels.bank_name" 
                                                     :required="true"
                                                 />
                                             </div>
                                             <div class="col-md-4">
                                                 <VTextInput
                                                     type="text" 
                                                     name="account_holder_name"
                                                     v-model="form.account_holder_name"
                                                     :label="labels.account_holder_name"
                                                     :required="true" 
                                                 />
                                             </div>
                                             
                                             <div class="col-md-4">
                                                 <VTextInput
                                                     type="text" 
                                                     name="iban_number"
                                                     v-model="form.iban_number"
                                                     :label="labels.iban_number"
                                                     :required="true" 
                                                 />
                                             </div>
                                         </div>
 
                                         <div class="row">
                                            
                                            <div class="col-md-4">
                                                 <VTextInput
                                                     type="text" 
                                                     name="account_number"
                                                     v-model="form.account_number"
                                                     :label="labels.account_number"
                                                     :required="true"
                                                 />
                                             </div>
                                            
                                             <div class="col-md-4">
                                                 <VTextInput
                                                     type="text" 
                                                     name="ifsc_code"
                                                     v-model="form.ifsc_code"
                                                     :label="labels.ifsc_code"
                                                 />
                                             </div>
                                             
                                             <div class="col-4 pt-4">
                                                 <div class="form-field">
                                                     <div class="form-check form-switch ">
                                                         <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status">
                                                         <label class="form-check-label" for="status">{{ $t("Active") }}</label>
                                                     </div>
                                                 </div>
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
                                     {{ $t("Saving...") }}
                                 </span>
                                 <span class="pt-0" v-else>
                                     {{ $t("Save") }}
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
        bank_name: t('Bank Name'),
        account_holder_name: t("Account Holder Name"),
        iban_number: t("IBAN Number"),
        account_number: t("Account Number"),
        ifsc_code: t("IFSC/Swift Code"),
     });
     const initialState = {
       server_messages: {
         type: "",
         messages: "",
       },
       is_saving: false,
      
       // form data   
       bank_name: "",
       account_holder_name: "",
       iban_number: "",
       account_number: "",
       ifsc_code: "",
       status: false,
     };

     const form = reactive({ ...initialState });
 
     const authStore = useAuthStore();
 
     const schema = yup.object({
         bank_name: yup.string().required(t('name is required', { name: t('Bank Name') })).min(3,t('name must be at least n characters', { name: t('Bank Name'), number: 3 })),
         account_holder_name: yup.string().required(t('name is required', { name: t('Account Holder Name') })).min(3,t('name must be at least n characters', { name: t('Account Holder Name'), number: 3 })),
         iban_number: yup.string().required(t('name is required', { name: t('IBAN Number') })).min(3,t('name must be at least n characters', { name: t('IBAN Number'), number: 3 })),
         account_number: yup.string().required(t('name is required', { name: t('Account Number') })).min(3,t('name must be at least n characters', { name: t('Account Number'), number: 3 })),
         status: yup.bool().label('Status'),
     });
     
     
 
     const emit = defineEmits(['closeAddBranchBankModal'])
 
     const props = defineProps(['show_add_bank_modal','edit_data','branch_slack']);

     function closeModal(){
         resetData();
         emit('closeAddBranchBankModal');
     }
  
     async function saveBank(values,actions){
 
         var form_data = new FormData();
         form_data.append('branch_slack',props.branch_slack);
         form_data.append('bank_name',form.bank_name);
         form_data.append('account_holder_name',form.account_holder_name);
         form_data.append('iban_number',form.iban_number);
         form_data.append('account_number',form.account_number);
         form_data.append('ifsc_code',form.ifsc_code);
         form_data.append('status',form.status);
 
         await axios.post('/api/branch/bank/save', form_data).then( (response) => {
             
             form.is_saving = true;
 
             if(response.data.status_code == 200) {
 
                 toast.success(response.data.msg);
                 form.is_saving = false;
                 actions.resetForm()
                 resetData();

 
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
         $('#addBranchBankModal').modal('hide');
         emit('closeAddBranchBankModal');
     }
 
 </script>