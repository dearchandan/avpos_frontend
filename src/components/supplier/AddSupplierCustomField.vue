<template>
  <div class="modal hide" id="addSupplierCustomFieldModal"  tabindex="-1" aria-labelledby="Add Custom Field" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('Add Custom Field') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <Form
              :validation-schema="schema"
              @submit="saveCustomField"
              enctype="multipart/form-data"
              :initial-values="form"
              id="add_custom_field_form"
          >
            <div class="row">
              <div class="col-md-12">
                <VTextInput
                    type="text"
                    name="field_name"
                    v-model="form.field_name"
                    :label="labels.name"
                    :required="true"
                    :placeholder="labels.merchant_name"
                />
              </div>

              <div class="col-md-12">
                <VTextInput
                    type="text"
                    name="field_value"
                    v-model="form.field_value"
                    :label="labels.value"
                    :required="true"
                    :placeholder="labels.merchant_value"
                />
              </div>

              <div class="col-12">
                <div class="form-field">
                  <div class="form-check form-switch pt-3">
                    <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status" >
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
                                     {{ $t('Saving...') }}
                                 </span>
                <span class="pt-0" v-else>
                                     {{ $t('Save') }} </span>

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
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const labels = ref({
  name: t('Name'),
  value: t('Value'),
  merchant_name: t('Ex. Merchant Name'),
  merchant_value: t('Ex. Apple'),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_saving: false,

  // form data
  custom_field_slack: "",
  field_value: "",
  field_name: "",
  status: true,
};

const form = reactive({ ...initialState });

const authStore = useAuthStore();

const schema = yup.object({
  field_name: yup.string().required(t('name is required', { name: t('Name') })).min(3,t('name must be at least n characters', { name: t('Name'), number: 3 })),
  field_value: yup.string().required(t('name is required', { name: t('Value') })).min(3,t('name must be at least n characters', { name: t('Value'), number: 3 })),
  status: yup.bool().label('Status'),
});



const emit = defineEmits(['closeAddCustomFieldModal'])

const props = defineProps(['show_add_supplier_custom_field_modal','supplier_slack','edit_data']);

function closeModal(){
  resetData();
  emit('closeAddCustomFieldModal');
}

watch(() =>
        props.edit_data,(value) => {
      if(value){
        form.custom_field_slack = value.slack;
        form.field_name = value.field_name;
        form.field_value = value.field_value;
        form.status = value.status == 1?true:false;
      }
    }
);

async function saveCustomField(){

  var form_data = new FormData();
  form_data.append('supplier_slack',props.supplier_slack);
  form_data.append('field_name',form.field_name);
  form_data.append('field_value',form.field_value);
  form_data.append('status',form.status);
  form_data.append('custom_field_slack',form.custom_field_slack);

  var submit_url = (form.custom_field_slack != '')?'/api/supplier/custom_field/update':'/api/supplier/custom_field/save';

  await axios.post(submit_url, form_data).then( (response) => {

    form.is_saving = true;

    if(response.data.status_code == 200) {
      toast.success(response.data.msg);
      location.reload();
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