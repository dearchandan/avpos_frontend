<template>
   <div class="modal hide" id="addAdminAccountModal"  tabindex="-1" aria-labelledby="Add Account" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false"> 
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" v-if="form.account_slack == '' || form.account_slack == undefined">{{ $t("Add Account") }}</h5>
                        <h5 class="modal-title" v-else>{{ $t("Update Account") }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <Form
                        :validation-schema="schema"
                        @submit="saveAccount"
                        enctype="multipart/form-data"
                        :initial-values="form"
                        id="add_account_form"
                        >
                        <div class="row">
                          <div class="col-md-4">
                            <VMultiSelect
                                name="account_type"
                                :label="labels.account_type_label"
                                :placeholder="labels.account_type_placeholder"
                                :text="'value'"
                                :value="'key'"
                                :options="account_types"
                                v-model="form.account_type"
                                mode="single"
                                required
                                :selected="form.account_type"
                            />
                          </div>
                          <div class="col-md-4">
                            <VTextInput
                                type="text"
                                name="account_name"
                                v-model="form.account_name"
                                :label="labels.account_name"
                                required
                            />
                          </div>
                          <div class="col-md-4">
                            <VTextInput
                                type="text"
                                name="account_name_ar"
                                v-model="form.account_name_ar"
                                :label="labels.account_name_ar"
                            />
                          </div>
                          <div class="col-md-6">
                            <div class="form-field">
                                <label>{{ $t("Description") }}</label>
                                <textarea
                                    class="form-control form-control-solid p-3"
                                    name="description"
                                    v-model="form.description"
                                    :label="labels.description"
                                    cols="3"
                                ></textarea>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-field">
                                <label>{{ $t("Description (Arabic)") }}</label>
                                <textarea
                                    class="form-control form-control-solid p-3"
                                    name="description_ar"
                                    v-model="form.description_ar"
                                    :label="labels.description_ar"
                                    cols="3"
                                ></textarea>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <VTextInput
                                type="number"
                                name="initial_balance"
                                v-model="form.initial_balance"
                                :label="labels.initial_balance"
                            />
                          </div>
                          <div class="col-md-2">
                            <div class="form-field pt-md-3">
                              <div class="form-check form-switch pt-4">
                                <input class="form-check-input me-2" type="checkbox" role="switch" id="is_default" checked v-model="form.is_default">
                                <label class="form-check-label" for="is_default">{{ $t("Default") }}</label>
                              </div>
                            </div>
                          </div>
                          <div v-if="form.is_default==true || form.total_expense>0 || form.total_sale>0"></div>
                          <div class="col-md-2" v-else>
                            <div class="form-field pt-md-3">
                              <div class="form-check form-switch pt-4">
                                <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status">
                                <label class="form-check-label" for="status">{{ $t("Active") }}</label>
                              </div>
                            </div>
                          </div>
                          <input type="hidden" v-model="form.account_slack" />
                        </div>
                        <div class="py-3" v-if="form.server_messages.messages != ''">
                            <ServerMessage  :server_messages="form.server_messages"  />
                        </div>
                        <div class="mt-2 text-end">
                            <button 
                            type="submit"
                            class="btn btn-primary" 
                            :disabled="form.is_submitting"
                            >
                                <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                <span class="pt-0" v-if="form.is_submitting">
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
    
    // import axios from 'axios';
    import {ref, reactive, watch, computed, onBeforeMount,toRef } from 'vue';
    import { Form, Field, ErrorMessage } from 'vee-validate'
    import { useI18n } from 'vue-i18n'
    import * as yup from 'yup';
    import VTextInput from '@/components/common/VTextInput.vue' 
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    
    import { useAuthStore } from '@/stores/auth';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    // import _ from 'lodash';
    const { t } = useI18n();
    const is_loading = ref(false);

    const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
      is_submitting: false,
      is_listing: false,
        
      // form data   
      account_slack: "",
      account_type: "",
      search_account_type: "",
      account_name: "",
      account_name_ar: "",
      description: "",
      description_ar: "",
      initial_balance: 0,
      is_default: false,
      status: true,
      total_expense:0,
      total_sale:0,
    };

    const form = reactive({ ...initialState });

    const authStore = useAuthStore();

    const schema = yup.object({
        account_type: yup.string().required(t('name is required', { name: t('Account Type') })),
        account_name: yup.string().required(t('name is required', { name: t('Account Name') })).min(3,t('name must be at least n characters', { name: t('Account Type'), number: 3 })),
        initial_balance: yup.number().typeError(t('must be a number',{ name: t('Initial Balance') })).min(0,t("must be greater than or equal to 0",{ name: t('Initial Balance') })),
        is_default: yup.bool().label('is_default'),
        status: yup.bool().label('status'),
    });
    
    const emit = defineEmits(['closeAddAccountModal'])
    
    const props = defineProps({
        show_add_account_modal: Boolean,
        edit_data: {
            type: [Array,Object],
        },
        account_types: {
            type: [Array,Object],
        }
    });

    const account_types = ref([]);
    account_types.value = props.account_types;

    const edit_data = toRef(props,'edit_data');
    const labels = ref({
        "description": t('Description'),
        "description_ar": t("Description (Arabic)"),
        "account_name": t('Account Name'),
        "account_name_ar": t('Account Name (Arabic)'),
        "initial_balance": t('Initial Balance'),
        "account_type_label": t('Account Type'),
        "account_type_placeholder": t('Select Account Type')
    })

    watch(() =>
        props.edit_data,(value) => {
            if(value){
                form.account_name = value.name;
                form.account_name_ar = value.name_ar != null?value.name_ar:"";
                form.description = value.description != null?value.description:"";
                form.description_ar = value.description_ar != null?value.description_ar:"";
                form.is_default = value.is_default == 1?true:false;
                form.status = value.status == 1?true:false;
                form.initial_balance = value.initial_balance;
                form.account_type = value.account_type != null?value.account_type:'';
                form.account_slack = value.slack;
                // form.total_expense = value.total_expense;
                // form.total_sale = value.total_sale;

            }
        }
    );
    function closeModal(){
        document.getElementById("add_account_form").reset();
        resetData();
        emit('closeAddAccountModal');
    }

    async function saveAccount(){

        var form_data = new FormData();
        form_data.append('account_type',form.account_type);
        form_data.append('account_name',form.account_name);
        form_data.append('account_name_ar',form.account_name_ar);
        form_data.append('description',form.description);
        form_data.append('description_ar',form.description_ar);
        form_data.append('initial_balance',form.initial_balance);
        form_data.append('is_default',form.is_default);
        form_data.append('status',form.is_default==true?true:form.status);
        form_data.append('account_slack',form.account_slack);

        var submit_url = (form.account_slack != '' && form.account_slack!= undefined)?'/api/admin_account/update':'/api/admin_account/save';

        await axios.post(submit_url, form_data).then( (response) => {
            
            form.is_submitting = true;

            if(response.data.status_code == 200) {

                form.server_messages.type = "success";
                form.server_messages.messages = response.data.msg;

                form.is_submitting = false;
                resetData();
                document.getElementById("add_account_form").reset();
                setTimeout(function(){
                    form.server_messages.type = "";
                    form.server_messages.messages = "";
                    $('#addAdminAccountModal').modal('hide');
                    emit('onSubmitReload')
                },1000);
                

            }else{
                try{
                    form.server_messages.type = "error";
                    form.server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    form.server_messages.type = "error";
                    form.server_messages.messages = response.data.msg;
                }
                form.is_submitting = false;
            }
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            form.is_submitting = false;
            console.log(error);
        });

    }

    function resetData(){
        Object.assign(form, initialState);
    }
    
</script>