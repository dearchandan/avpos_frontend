<template>
   <div class="modal hide" id="addStockTransferModal"  tabindex="-1" aria-labelledby="Add Stock Transfer" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">{{ $t('Add Stock Transfer') }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
              </div>
              <div class="modal-body">
                  <Form
                  :validation-schema="schema"
                  @submit="saveStockTransfer"
                  >
                  <div class="row">
                      <div class="col-md-6">
                        <label class="label">{{ $t('From Branch') }} <span class="text-danger">*</span></label>
                        <input type="text" class="form-control form-control-solid" name="from_branch_name" v-model="form.from_branch_name" disabled>
                        <input type="hidden" class="form-control form-control-solid" name="from_branch" v-model="form.from_branch">
                      </div>
                      <div class="col-md-6">
                        <VSelect
                            name="to_branch"
                            :label="t('To Branch')"
                            v-model="form.to_branch"
                            :placeholder="t('Select To Branch')"
                            :options="to_branches"
                            required

                        />
                      </div>
                      <div class="col-md-6">
                        <VTextInput
                            type="date"
                            name="transfer_date"
                            v-model="form.transfer_date"
                            :label="t('Transfer Date')"
                            required
                        />
                      </div>
                      <div class="col-md-12">
                        <label>{{ $t('Description') }}</label>
                        <textarea
                            class="form-control form-control-solid p-3"
                            name="note"
                            v-model="form.note"
                            :label="t('Note')"
                            cols="3"
                            rows="3"
                            maxlength ="250"
                        ></textarea>
                      </div>
                    </div>
                  <div class="py-3" v-if="form.server_messages.messages != ''">
                      <ServerMessage  :server_messages="form.server_messages"  />
                  </div>
                  <div class="mt-4 text-end">
                      <button
                      type="submit"
                      class="btn btn-primary"
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
      from_branch_name: "",
      from_branch: "",
      to_branch: "",
      transfer_date: "",
      note: "",
    };

    const form = reactive({ ...initialState });
    const authStore = useAuthStore();
    form.from_branch = authStore.user.login_branch!=null?authStore.user.login_branch.slack:'';
    form.from_branch_name = authStore.user.login_branch!=null?authStore.user.login_branch.name:'';

    const schema = yup.object({
        to_branch: yup.string().required(t('name is required', { name: t('To Branch') })),
        transfer_date: yup.string().required(t('name is required', { name: t('Transfer Date') })),
    });

    const emit = defineEmits(['closeAddStockTransferModal'])
    const props = defineProps(['show_add_stock_transfer_modal','edit_data']);
    function closeModal(){
        resetData();
        emit('closeAddStockTransferModal');
        document.getElementById('close_btn').click();
    }
    watch(() =>
            props.show_add_stock_transfer_modal, (value) => {
          if(value){
            form.from_branch = authStore.user.login_branch!=null?authStore.user.login_branch.slack:'';
            form.from_branch_name = authStore.user.login_branch!=null?authStore.user.login_branch.name:'';
            loadBranches();
          }
        },
    );


    //loadBranches();
    const to_branches = ref([]);

    async function loadBranches(){
      to_branches.value = [];
      let branch_data = await axios.get('api/branches/get_to_branches');
      branch_data = branch_data.data.data;
      _.forEach(branch_data, (item) => {
        let template = {
          'key': item.slack,
          'value': item.code+' - '+item.name,
        };
        to_branches.value.push(template);
      })
    }

    async function saveStockTransfer(){

        form.is_submitting = true;

        var form_data = new FormData();
        form_data.append('from_branch',form.from_branch);
        form_data.append('to_branch',form.to_branch);
        form_data.append('transfer_date',form.transfer_date);
        form_data.append('note',form.note!=null?form.note:'');

        await axios.post('/api/stock_transfer/save', form_data).then( (response) => {
            
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);
                form.is_submitting = false;
                document.getElementById('close_btn').click();
                router.push('/stock_transfer/' + response.data.data.stock_transfer.slack);
                // closeModal();

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