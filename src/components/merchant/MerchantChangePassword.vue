<template>
  <div>
    <Form :validation-schema="schema" :initial-values="form" @submit="resetPassword" enctype="multipart/form-data">
      <div class="row card-strash">

        <div class="py-3" v-if="form.server_messages.messages != ''">
          <ServerMessage  :server_messages="form.server_messages"  />
        </div>

        <div class="col-md-12">
          <div class="row">

            <div class="col-md-12 mb-4">
              <div class="card">
                <div class="row">
                  <div class="col-md-3">
                    <VTextInput
                        type="password"
                        name="password"
                        v-model="form.password"
                        :label="labels.password"
                        :required="true"
                    />
                  </div>

                  <div class="col-md-3">
                    <VTextInput
                        type="password"
                        name="confirm_password"
                        v-model="form.confirm_password"
                        :label="labels.confirm_password"
                        required
                    />
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-primary" :disabled="form.is_submitting">
          <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
          <span class="pt-0" v-if="form.is_submitting"> {{ $t("Saving...") }} </span>
          <span class="pt-0" v-else> {{ $t('Save') }} </span>
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {ref, reactive, onMounted } from 'vue';
import { Form } from 'vee-validate'
import * as yup from 'yup';
import VTextInput from '@/components/common/VTextInput.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'


const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;

const props = defineProps(["merchant"]);
const merchant = toRef(props, "merchant");
console.log(merchant.value.slack);
const labels = ref({
  password : t("Password"),
  confirm_password : t("Confirm Password"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  password : "",
  confirm_password : "",
};

const form = reactive({ ...initialState });

const schema = yup.object({
  password: yup.string().required(t("name is required", { name: t("Password") })).min(8,t("name must be at least n characters", {
    name: t("password"),
    number: 8,
  })),
  confirm_password: yup.string().required(t("name is required", { name: t("Confirm Password") })).oneOf([yup.ref('password'), null], t("Confirm Password must be same")),
});

async function resetPassword(){

    form.is_submitting = true;

    var form_data = new FormData();
    form_data.append('password',form.password);
    form_data.append('slack',merchant.value.slack);

    var submit_url = '/api/merchant/update_password';

    await axios.post(submit_url, form_data).then( (response) => {

        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_submitting = false;
            resetData();
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
