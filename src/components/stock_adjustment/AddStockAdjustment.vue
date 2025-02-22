<template>
   <div class="modal hide" id="addStockAdjustmentModal"  tabindex="-1" aria-labelledby="Add Stock Adjustment" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">{{ $t('Add Stock Adjustment') }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
              </div>
              <div class="modal-body">
                  <Form :validation-schema="schema" @submit="saveStockAdjustment" >
                      <div class="row">
                          <!-- <div class="col-md-6">
                            <VSelect name="branch"
                                :label="t('Branch')"
                                v-model="form.branch"
                                :placeholder="t('Select Branch')"
                                :options="branches"
                                required
                            />
                          </div> -->
                          <div class="col-md-6">
                            <VTextInput
                                type="number"
                                name="reference_no"
                                v-model="form.reference_no"
                                :label="t('Reference Number')"
                                required
                            />
                          </div>
                          <div class="col-md-12">
                            <label>{{ $t('Description') }}</label>
                            <textarea class="form-control form-control-solid p-3" name="note" v-model="form.note" :label="t('Note')" cols="3" rows="3"></textarea>
                          </div>
                        </div>
                      <div class="py-3" v-if="form.server_messages.messages != ''">
                          <ServerMessage  :server_messages="form.server_messages"  />
                      </div>
                      <div class="mt-4 text-end">
                          <button type="submit" class="btn btn-primary" :disabled="form.is_submitting" >
                              <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                              <span class="pt-0" v-if="form.is_submitting">
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

    import { Form, Field, ErrorMessage } from 'vee-validate'
    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    
    import { useAuthStore } from '@/stores/auth';
    import { useI18n } from 'vue-i18n'

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
      branch_name: "",
      branch: "",
      reference_no: "",
      adjustment_date: "",
      note: "",
    };

    const form = reactive({ ...initialState });
    const authStore = useAuthStore();
    // form.branch = authStore.user.login_branch!=null?authStore.user.login_branch.slack:'';
    // form.branch_name = authStore.user.login_branch!=null?authStore.user.login_branch.name:'';

    const schema = yup.object({
        // branch: yup.string().required(t('name is required', { name: t('Branch') })),
        reference_no: yup.string().required(t('name is required', { name: t('Reference Number') })),
    });

    const emit = defineEmits(['closeAddStockAdjustmentModal','getStockAdjustments'])
    const props = defineProps(['show_add_stock_adjustment_modal','edit_data']);
    function closeModal(){
        resetData();
        emit('closeAddStockAdjustmentModal');
        document.getElementById('close_btn').click();
    }
    // const branches = ref([]);
    // branches.value = props.branches;
    watch(
        // () => props.show_add_stock_adjustment_modal, (value) => {
        //     if(value){
        //         loadBranches();
        //     }
        // },       
    );

    async function saveStockAdjustment(){

        form.is_submitting = true;

        var form_data = new FormData();
        // form_data.append('branch',form.branch);
        form_data.append('reference_no',form.reference_no);
        form_data.append('note',form.note!=null?form.note:'');

        await axios.post('/api/stock_adjustment/save', form_data).then( (response) => {
            
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);
                form.is_submitting = false;
                emit('getStockAdjustments');
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