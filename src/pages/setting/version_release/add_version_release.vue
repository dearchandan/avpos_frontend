<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/releases"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Version Releases") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="id == '' || id == undefined">
              {{ $t("Add Version Release") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Version Release") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content" v-if="id == '' || id == undefined || (id != '' && is_loaded)">
      <Form
        :validation-schema="schema"
        :initial-values="form"
        @submit="saveReleaseVersion"
        enctype="multipart/form-data"
      >
        <div class="row card-strash">
          <div class="py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage :server_messages="form.server_messages" />
          </div>

          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                    <div class="col-md-3">
                      <VTextInput
                        type="text"
                        name="version"
                        v-model="form.version"
                        :label="labels.version"
                        :required="true"
                      />
                    </div>
                     <div class="col-md-3">
                        <VTextInput
                            type="datetime-local"
                            name="released_at"
                            v-model="form.released_at"
                            :label="labels.released_at"
                            :required="true"
                        />
                      </div>
                      <div class="col-md-6">
                        <VTextArea
                            name="highlights"
                            :label="labels.highlights"
                            v-model="form.highlights"
                            required
                        >
                        </VTextArea>
                      </div>
                 
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                      <Field name="description" label="label" v-slot="{ field, meta, errors }" v-model="form.description" >
                          <div class="form-field">
                          <label class="label">{{ labels.description }} <span class="text-danger">*</span>
                          </label>
                          <Editor
                              api-key="xm7yrkmhbefzhqie9ehn7yickrbrgkjs1bwfamuoxmm0m4dt"
                              :init="{
                                  plugins: 'lists table code help wordcount codesample advcode '
                              }"
                              v-model="form.description"
                              v-bind="field"
                              />
                          </div>
                      </Field>
                      <ErrorMessage name="description" as="div" class="error"></ErrorMessage>
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
            <clip-loader
              v-if="form.is_submitting"
              :color="'white'"
              :size="'20px'"
              class="pt-2 pe-2"
            >
            </clip-loader>
            <span class="pt-0" v-if="form.is_submitting">
              {{ $t("Saving...") }}
            </span>
            <span class="pt-0" v-else> {{ $t("Save") }} </span>
          </button>
        </div>
      </Form>
    </div>
    <EditFormSkeleton v-else />

  </DefaultLayout>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { ref, reactive, onMounted } from "vue";
import * as yup from "yup";
import VTextInput from "@/components/common/VTextInput.vue";
import Editor from '@tinymce/tinymce-vue';

import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import VSelect from "@/components/common/VSelect.vue";

import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const AsyncServerMessage = defineAsyncComponent(() => import('@/components/common/ServerMessage.vue'));

const { t } = useI18n();

const route = useRoute();
 const labels = ref({
     version: t("Version"),
     description: t("Description"),
     released_at: t("Released At"),
     highlights: t("Highlights"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  version: "",
  description: "",
  released_at: new Date().toISOString().slice(0, 19),
  highlights: "",
};

const form = reactive({ ...initialState });

let schema = yup.object({
  version: yup
    .string()
    .required(t("name is required", { name: t("Version") })),
  description: yup
    .string()
    .required(t("name is required", { name: t("Description") })),
  highlights: yup
    .string()
    .required(t("name is required", { name: t("Password") })),
  released_at: yup.string().required(t("name is required", { name: t("Release Date") })),
});

const release = ref([]);

const id = route.params.id;
onMounted(() => {
  if (_.isUndefined(id)) getVersionReleaseAddData();
  if (!_.isUndefined(id)) getVersionRelease();
});


const is_loaded = ref(false);
async function getVersionReleaseAddData(){
  let add_data = await axios.get('api/version_releases/add');
  form.version = add_data.data.data.version;
  is_loaded.value = true;
}

async function getVersionRelease(){

    await axios.get('/api/version_release/'+id).then( (response) => {
    
        release.value = response.data.data;
        if(response.data.data){
          form.id = response.data.data.id;
          form.version = response.data.data.version;
          form.description = response.data.data.description;
          form.highlights = response.data.data.highlights;
          form.released_at = response.data.data.released_at;
          
        }
        is_loaded.value = true;
        // console.log('form =', form.user_subscription.name );
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
    });

}



async function saveReleaseVersion() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("version", form.version);
  form_data.append("description", form.description);
  form_data.append("highlights", form.highlights);
  form_data.append("released_at", form.released_at);

  form_data.append("id", form.id);
  var submit_url =
    form.id != "" && form.id != undefined
      ? "/api/version_release/update"
      : "/api/version_release/save";

  await axios
    .post(submit_url, form_data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;

        router.push("/releases");
      } else {
        try{
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
        }catch(err){
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
        }
        form.is_submitting = false;
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_submitting = false;
      console.log(error);
    });
}

function resetData() {
  Object.assign(form, initialState);
}
</script>
