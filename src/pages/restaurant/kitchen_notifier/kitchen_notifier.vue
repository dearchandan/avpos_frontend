<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <RestaurantMenu />
    </template>
    <div class="content" v-if="is_loaded">
      <Form @submit="saveCustomerDisplay" enctype="multipart/form-data">
        <div class="row card-strash">
          <div class="py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage :server_messages="form.server_messages"/>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                    <div class="col-md-6">
                      <VCodeGenerateTextInput
                          type="text"
                          name="login_code"
                          v-model="form.activation_code"
                          :label="activation_code"
                          @generate_code="generateCode"
                          :readonly="true"
                      />
                    </div>
                    <div class="col-md-3 pt-md-2">
                      <div class="form-field pt-md-2">
                        <div class="form-check form-switch pt-md-4">
                          <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked
                                 v-model="form.status">
                          <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3" v-if="permissions.write">
                      <button
                          type="submit"
                          class="btn btn-primary mt-md-4"
                          :disabled="form.is_submitting"
                      >
                        <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
                        <span class="pt-0" v-if="form.is_submitting">{{ $t('Updating...') }}</span>
                        <span class="pt-0" v-else>{{ $t('Update') }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                    <div v-if="logs.value">
                      <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                    </div>
                    <div v-else class="table-responsive">

                      <table class="table table-list-data table-hover">
                        <thead class="bg-light">
                        <tr>
                          <th scope="col" width="15%">{{ $t('IP Address') }}</th>
                          <th scope="col" width="15%">{{ $t('Login At') }}</th>
                          <th scope="col" width="15%">{{ $t('Logout At') }}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="logs.length>0" v-for="(log,index) in logs" :key="index" >
                          <td>{{  log.ip_address  }}</td>
                          <td>{{  log.logged_in_at_label  }}</td>
                          <td>{{  log.logged_out_at_label !=null ? log.logged_out_at_label :'-'  }}</td>
                        </tr>

                        <tr v-else>
                          <td class="text-center py-3" colspan="5">{{ $t('No Data Found') }}</td>
                        </tr>

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </Form>
    </div>
    <KitchenNotifierSkeleton v-else />
  </DefaultLayout>
</template>

<script setup>

import {ref, reactive, onMounted} from 'vue';
import {Form} from 'vee-validate'
import * as yup from 'yup';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import useGlobalFunctions from '@/composables/global_functions.js';
import { useI18n } from 'vue-i18n'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

const { t } = useI18n();

const activation_code = t("Activation Code")
const { isAuthorized } = useGlobalFunctions();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  activation_code: "",
  status: true,
};

const form = reactive({...initialState});
const logs = ref([]);

onMounted(() => {
  checkPermissions();
  getKitchenNotifierAddData();
});

const is_loaded = ref(false);
async function getKitchenNotifierAddData(){
  let add_data = await axios.get('api/kitchen_notifier/add');
  form.activation_code = add_data.data.data.activation_code;
  form.status = add_data.data.data.status == 1 ? true : false;
  logs.value = add_data.data.data.logs;
  is_loaded.value = true;
}

async function generateCode(){
  let activation_code = await axios.post('api/kitchen_notifier/generate_activation_code');
  form.activation_code = activation_code.data.data.activation_code;
}


async function saveCustomerDisplay() {

  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append('activation_code', form.activation_code);
  form_data.append('status', form.status);

  await axios.post('/api/kitchen_notifier/save', form_data).then((response) => {

    if (response.data.status_code == 200) {

      toast.success(response.data.msg);
      form.is_submitting = false;

      // resetData();
      router.push('/kitchen_notifier');

    } else {
      try {
        form.server_messages.type = "error";
        form.server_messages.messages = JSON.parse(response.data.msg);
      } catch (err) {
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

function resetData() {
  Object.assign(form, initialState);
}


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_KITCHEN_NOTIFIER'),
        delete : isAuthorized('A_DELETE_KITCHEN_NOTIFIER'),
    };
}

</script>