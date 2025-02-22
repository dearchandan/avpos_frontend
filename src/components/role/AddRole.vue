<template>
   <div class="modal hide" id="addRoleModal"  tabindex="-1" aria-labelledby="Add Role" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ $t('Add Role') }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                    </div>
                    <div class="modal-body">
                        <Form
                        :validation-schema="schema"
                        @submit="saveRole"
                        :initial-values="form"
                        id="add_role_form"
                        >
                        <div class="row">
                            <div class="col-md-12">
                              <VTextInput
                                  type="text"
                                  name="name"
                                  v-model="form.name"
                                  :label="labels.name"
                                  :required="true"
                              />
                                                                  
                              <VSelect
                                    name="role_type"
                                    :label="labels.role_type"
                                    v-model="form.role_type"
                                    :placeholder="labels.select_role_type"
                                    :options="role_types_filtered"
                                    required
                                />
                            
                            </div>
                            <div class="col-md-12">
                              <div class="form-field pt-3">
                                <div class="form-check form-switch ">
                                  <input class="form-check-input me-2" type="checkbox" role="switch" id="status" v-model="form.status">
                                  <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                                </div>
                              </div>
                            </div>
                            <input type="hidden" v-model="form.role_id" />
                          </div>

                          <div class="py-3" v-if="form.server_messages.messages != ''">
                            <ServerMessage  :server_messages="form.server_messages"  />
                        </div>

                        <div class="row pt-4">
                            <div class="col-12">
                                <button 
                                type="submit"
                                class="btn btn-primary w-100" 
                                :disabled="form.is_submitting"
                                >
                                    <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                    <span class="pt-0" v-if="form.is_submitting">
                                        {{ $t('Saving...') }}
                                    </span>
                                    <span class="pt-0" v-else>
                                        {{ $t('Save') }}
                                    </span> 
    
                                </button>
                            </div>
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
    import useGlobal from '@/composables/global.js';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const labels = ref({
        name: t('Role Name'),
        role_type: t('Role Type'),
        select_role_type: t('Select Role Type'),
    });
    const authStore = useAuthStore();
    const { role_types } = useGlobal();

    const layout = computed(() => {
        return authStore.user.merchant.layout;
    });

    const is_loading = ref(false);

    const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
      is_submitting: false,
      is_listing: false,

      // form data
      role_id: "",
      name: "",
      role_type: "",
      status: true,
    };

    const form = reactive({ ...initialState });
    const role_types_filtered = ref([]);

    const schema = yup.object({
        name: yup.string().required(t('name is required', { name: t('Role Name') })).min(3,t('name must be at least n characters', { name: t('Role Name'), number: 3 })),
        role_type: yup.number().typeError(t('name is required', { name: t('Role Type') })).required(t('name is required', { name: t('Role Type') })),
        status: yup.bool().label('status'),
    });

    const emit = defineEmits(['closeAddRoleModal'])

    const props = defineProps({
        show_add_role_modal: Boolean,
        edit_data: {
            type: [Array,Object],
        },
    });

    function closeModal(){
        document.getElementById("add_role_form").reset();
        resetData();
        emit('closeAddRoleModal');
        document.getElementById('close_btn').click();
    }

    const close_btn = ref(null);
    watch(() => 
        props.edit_data,(value) => {
            if(value){
                form.role_id = value.slack;
                form.name = value.name;
                form.status = value.status == 1?true:false;
                form.role_type = value.role_type;
            }
        }
    );

    onMounted(() => {
        if(layout.value == 2){
            role_types.forEach((data, index) => {
                if(data.value == 'Admin' || data.value == 'Staff'){
                    let template = {
                        'key': data.key,
                        'value': data.value,
                    };
                    role_types_filtered.value.push(template);
                }
            });
        }else{
            role_types_filtered.value = role_types;
        }
    });

    async function saveRole(){

        form.is_submitting = true;

        var form_data = new FormData();
        form_data.append('name',form.name);
        form_data.append('role_type',form.role_type);
        form_data.append('status',form.status);
        form_data.append('role_id',form.role_id);

        var submit_url = (form.role_id != '' && form.role_id != undefined)?'/api/role/update':'/api/role/save';

        await axios.post(submit_url, form_data).then( (response) => {
            
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);
                form.is_submitting = false;

                closeModal();

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