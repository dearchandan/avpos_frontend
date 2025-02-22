<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/multiple_prices" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Multiple Prices') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ $t('Add Multiple Price') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
          
            <Form :validation-schema="schema" @submit="saveMultiplePrice" enctype="multipart/form-data">
                <div class="row card-strash">
                    
                    <div class="py-3" v-if="form.server_messages.messages != ''">
                        <ServerMessage  :server_messages="form.server_messages"  />
                    </div>

                    <div class="col-md-12">
                    
                        <div class="row">
                            
                            <div class="col-md-12 mb-0">
                                <div class="card">

                                        <div class="row">
                                          <div class="col-md-4">
                                              <VTextInput
                                                  type="text"
                                                  name="name"
                                                  v-model="form.name"
                                                  :label="labels.name"
                                                  :required="true"
                                              />
                                          </div>

                                          <div class="col-md-4">
                                              <VTextInput
                                                  type="name_ar"
                                                  name="text"
                                                  v-model="form.name_ar"
                                                  :label="labels.name_ar"
                                              />
                                          </div>

                                          <div class="col-md-4 pt-2">
                                            <div class="form-field pt-1">
                                              <div class="form-check form-switch pt-4">
                                                <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status">
                                                <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                                              </div>
                                            </div>
                                          </div>

                                      </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-end">
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
     </DefaultLayout>
</template>

<script setup>

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {ref, reactive, onMounted } from 'vue';
import { Form } from 'vee-validate'
import * as yup from 'yup';
import VTextInput from '@/components/common/VTextInput.vue' 

import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import VSelect from '@/components/common/VSelect.vue'
import { useI18n } from 'vue-i18n'
import {useRoute} from "vue-router";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;
const labels = ref({
  name : t("Name"),
  name_ar : t("Name (Arabic)"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  name : "",
  name_ar : "",
  status: true,
  multiple_price_slack:""
};

const form = reactive({ ...initialState });

const schema = yup.object({
    name: yup.string().required(t('name is required', { name: t('Name') })).min(3,t('name must be at least n characters', { name: t('Name'), number: 3 })),
});

onMounted(() => {
  if (!_.isUndefined(slack)) getMultiplePrice();
});

const multiple_price = ref([]);
const is_loaded = ref(false);
async function getMultiplePrice() {
  await axios
      .get("/api/multiple_price", {
        params: {
          slack: slack,
        },
      })
      .then((response) => {
        multiple_price.value = response.data.data;
        form.multiple_price_slack = response.data.data.slack;
        form.name = response.data.data.name;
        form.name_ar = response.data.data.name_ar;
        form.status = response.data.data.status==1?true:false;
        is_loaded.value = true;
      })
      .catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
      });
}

async function saveMultiplePrice(){

    form.is_submitting = true;

    var form_data = new FormData();
    form_data.append('name',form.name);
    form_data.append('name_ar',form.name_ar);
    form_data.append('status',form.status);
    form_data.append('multiple_price_slack', form.multiple_price_slack);

    var submit_url =
      form.multiple_price_slack != "" && form.multiple_price_slack != undefined
          ? "/api/multiple_price/update"
          : "/api/multiple_price/save";

    await axios.post(submit_url, form_data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
      }).then( (response) => {
        
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_submitting = false;
            
            // resetData();
            router.push('/multiple_prices');

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