<template>
    <div class="modal hide" id="ShiftModal"  tabindex="-1" aria-labelledby="Add Bank" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
             <div class="modal-dialog modal-md modal-dialog-centered">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title">{{ $t("Add Shift") }}</h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                     </div>
                     <div class="modal-body">
                         <Form
                         :validation-schema="schema"
                         :initial-values="form"
                         @submit="saveShift"
                         enctype="multipart/form-data"
                         >
                         <div class="row">
                                             
                            <div class="col-6">
                                <Field type="time" class="form-control" name="opening_time" v-model="form.opening_time" />
                                <ErrorMessage name="opening_time" as="div" class="error"></ErrorMessage>
                            </div>
                            
                            <div class="col-6">
                                <Field type="time" class="form-control" name="closing_time" v-model="form.closing_time" />
                                <ErrorMessage name="closing_time" as="div" class="error"></ErrorMessage>
                            </div>
                            
                        </div>

                         <div class="py-3" v-if="form.server_messages.messages != ''">
                             <ServerMessage  :server_messages="form.server_messages"  class="mb-0" />
                         </div>
                         <div class="mt-1 text-end">
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
     const initialState = {
       server_messages: {
         type: "",
         messages: "",
       },
       is_saving: false,
      
       // form data   
       opening_time: [],
       closing_time: [],
     };
 
     const form = reactive({ ...initialState });
 
     const authStore = useAuthStore();
 
     const schema = yup.object({
        opening_time: yup.string().typeError(t('name is required', { name: t('Opening Time') })).required(t('name is required', { name: t('Opening Time') })),
        closing_time: yup.string().typeError(t('name is required', { name: t('Closing Time') })).required(t('name is required', { name: t('Closing Time') })),
     });
 
     const emit = defineEmits(['closeShiftModal'])
 
     const props = defineProps(['show_shift_modal','edit_data','branch_slack','weekday']);

     function closeModal(){
         resetData();
         emit('closeShiftModal');
     }
 
     async function saveShift(){
 
         var form_data = new FormData();
         form_data.append('branch_slack',props.branch_slack);
         form_data.append('weekday',props.weekday);
         form_data.append('opening_time',form.opening_time);
         form_data.append('closing_time',form.closing_time);
 
         await axios.post('/api/branch/shift/save', form_data).then( (response) => {
             
             form.is_saving = true;
 
             if(response.data.status_code == 200) {
 
                 toast.success(response.data.msg);
                 form.is_saving = false;
                 $('#ShiftModal').modal('hide');
                 emit('closeShiftModal');
                 authStore.refresh();
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
        //  $('#ShiftModal').modal('hide');
     }
 
 </script>