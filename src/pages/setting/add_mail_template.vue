<template>
    <DefaultLayout>
         <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/mail_templates" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Mail Templates') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="id!='' && id!= undefined">{{ $t('Update Mail Template') }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t('Add Mail Template') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
             <Form :validation-schema="schema" @submit="saveMailTemplate" :initial-values="form" enctype="multipart/form-data">
                <div class="row card-strash">
                <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''"
                                    :server_messages="form.server_messages"/>
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-12 mb-4">
                                <div class="card">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text"
                                                name="template_name"
                                                v-model="form.template_name"
                                                :label="labels.template_name"
                                                :required="true"
                                            />
                                        </div>
                                        <div class="col-md-9">
                                            <Field name="template_body" label="label" v-slot="{ field, meta, errors }" v-model="form.template_body" >
                                                <div class="form-field">
                                                <label class="label">{{ labels.template_body }} <span class="text-danger">*</span>
                                                </label>
                                                <Editor
                                                    api-key="xm7yrkmhbefzhqie9ehn7yickrbrgkjs1bwfamuoxmm0m4dt"
                                                    :init="{
                                                        plugins: 'lists image table code help wordcount codesample advcode '
                                                    }"
                                                    v-model="form.template_body"
                                                    v-bind="field"
                                                    />
                                                </div>
                                            </Field>
                                            <ErrorMessage name="template_body" as="div" class="error"></ErrorMessage>
                                            <div class="text-primary"><b>Note :</b> Please don't remove value within square brackets ([]).</div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <button type="submit" class="btn btn-primary" :disabled="form.is_submitting">
                        <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
                        <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
                        <span class="pt-0" v-else>{{ $t('Save') }}</span>
                    </button>
                </div>
             </Form>
        </div>
    </DefaultLayout>
</template>
<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'
import Editor from '@tinymce/tinymce-vue'
const AsyncServerMessage = defineAsyncComponent(() => import('@/components/common/ServerMessage.vue'));

const { t } = useI18n();
const route = useRoute();
const id = route.params.id;
const mail_template = ref([]);
const labels = ref({
  template_name: t('Template Name'),
  template_body: t('Template Body'),
})
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  id: "",
  template_name: "",
  template_body: ""
};

const form = reactive({...initialState});
const schema = yup.object().shape({
  template_name: yup.string().required(t('name is required', { name: t('Template Name') })),
  template_body: yup.string().required(t('name is required', { name: t('Template Body') })),
});
onMounted(() => {
  if(id!=null){
    getMailTemplate();
  }
});

async function getMailTemplate(){
  await axios.get('/api/mail_template', { params : {
      id : id,
    } }).then( (response) => {
        mail_template.value = response.data.data;

        form.id = mail_template.value.id;
        form.template_name = mail_template.value.template_name;
        form.template_body = mail_template.value.template_body;
    })
}

async function saveMailTemplate() {
  form.is_submitting = true;
  var form_data = new FormData();
  form_data.append('template_name', form.template_name);
  form_data.append('template_body', form.template_body);
  
  form_data.append('id', form.id);
  var submit_url = (form.id!='' && form.id!=undefined)?'/api/mail_template/update':'/api/mail_template/save';
  await axios.post(submit_url, form_data).then((response) => {
    if (response.data.status_code == 200) {
      toast.success(response.data.msg);
      form.is_submitting = false;
      router.push('/mail_templates');
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
  });

}
</script>