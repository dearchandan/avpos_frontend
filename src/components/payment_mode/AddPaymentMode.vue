<template>
   <div class="modal modal-lg hide" id="addPaymentModeModal"  tabindex="-1" aria-labelledby="Add Payment Mode" aria-modal="true" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false" >
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" v-if="form.slack == '' || form.slack==undefined">{{ $t('Add Payment Mode') }}</h5>
                  <h5 class="modal-title" v-else>{{ $t('Update Payment Mode') }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
              </div>
              <div class="modal-body">
                  <Form
                  :validation-schema="schema"
                  @submit="savePaymentMode"
                  enctype="multipart/form-data"
                  :initial-values="form"
                  id="frmPaymentMode"
                  >
                    <div class="row">
                      <div class="col-6">
                        <VTextInput
                            type="text"
                            name="payment_mode_name"
                            v-model="form.payment_mode_name"
                            label="Payment Mode Name"
                            :required="true"
                        />
                      </div>
                      <div class="col-6">
                        <VTextInput
                            type="text"
                            name="payment_mode_name_ar"
                            v-model="form.payment_mode_name_ar"
                            label="Payment Mode Name (Arabic)"
                        />
                      </div>
                      <div class="col-md-6">
                        <div class="form-field">
                          <div class="form-check form-switch">
                            <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status">
                            <label class="form-check-label" for="status">{{ $t('Active') }}</label>
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
      is_listing: false,

      // form data
      slack: "",
      payment_mode_name: "",
      payment_mode_name_ar: "",
      status: true,
    };

    const form = reactive({ ...initialState });

    const authStore = useAuthStore();

    const schema = yup.object({
        payment_mode_name: yup.string().required(t('name is required', { name: t('Payment Mode Name') })).min(3,t('name must be at least n characters', { name: t('Payment Mode Name'), number: 3 })),
        status: yup.bool().label('status'),
    });

    const emit = defineEmits(['closeAddPaymentModeModal'])

    const props = defineProps({
        show_add_payment_mode_modal: Boolean,
        edit_data: {
            type: [Array,Object],
        },
    });

    const edit_data = toRef(props,'edit_data')
    function closeModal(){
        document.getElementById('frmPaymentMode').reset();
        resetData();
        document.getElementById('close_btn').click();
        emit('closeAddPaymentModeModal');

    }

    watch(() =>
        props.edit_data,(value) => {
            if(value){
                form.slack = value.slack;
                form.payment_mode_name = value.name;
                form.payment_mode_name_ar = value.name_ar;
                form.status = value.status == 1?true:false;
            }
        }
    );

    async function savePaymentMode(){
        form.is_saving = true;
        
        var form_data = new FormData();
        form_data.append('payment_mode_name',form.payment_mode_name);
        form_data.append('payment_mode_name_ar',JSON.stringify(form.payment_mode_name_ar));
        form_data.append('status',form.status);
        form_data.append('slack',form.slack);
        var submit_url = (form.slack!='' && form.slack!=undefined)?'/api/payment_mode/update':'/api/payment_mode/save';
        await axios.post(submit_url, form_data).then( (response) => {
        
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);
                form.server_messages.type = "";
                form.server_messages.messages = '';
                form.is_saving = false;
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

    function resetData(){
        Object.assign(form, initialState);
    }
    
</script>