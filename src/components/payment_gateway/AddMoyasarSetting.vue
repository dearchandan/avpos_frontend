<template>

    <div>
        <div class="row">
            <Form
                @submit="savePaymentGatewaySetting"
                :validation-schema="schema"
                :initial-values="form"
            >
                <div class="col-12 py-3">
                    <div class="card">
                        <div class="row mb-3">
                            <div class="col-4">
                                <label class="label"> {{ $t('Merchant Key') }}<span class="text-danger">*</span></label>
                            </div>
                            <div class="col-8">
                              <VTextInput
                                  type="text"
                                  name="merchant_key"
                                  v-model="form.merchant_key"
                                  label=""
                                  :required="true"
                                  :islabel=false
                                  size="small"
                              />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-4">
                                <label class="label"> {{ $t('SMS Template') }}<span class="text-danger">*</span></label>
                            </div>
                            <div class="col-8">
                              <VTextArea
                                  name="sms_template"
                                  v-model="form.sms_template"
                                  label=""
                                  :required="true"
                                  :islabel=false
                              />
                              <span class="my-3">{{labels.sms_note}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row py-3" v-if="form.server_messages.messages != ''">
                        <ServerMessage  :server_messages="form.server_messages"  />
                    </div>
                </div>
                
                <div class="col-12 mt-2 text-end">
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
                            {{ $t('Save') }} </span> 

                    </button>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup >

import { reactive, computed } from 'vue'
import * as yup from 'yup';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { Form,Field,ErrorMessage,useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n'

const { setTouched,values } = useForm();

const { t } = useI18n();
const props = defineProps({
  active_payment_gateway : {
    type: [Object,Array]
  },
});

const auth = useAuthStore();
const currency_symbol = computed(() => {
    return auth.user.currency.symbol;
})

const labels = ref({
  merchant_key: t('Merchant Key'),
  password: t("Password"),
  sms_template: t("SMS Template"),
  sms_note: t("Note: Square bracket([ ]) words will replace with the data like 'Your invoice number:[INVOICE_NUMBER]' to 'Your invoice number:001' in SMS"),
});

const initialState = {
  server_messages: {
      type: "",
      messages: "",
  },
  is_submitting: false,
  merchant_key:"",
  sms_template:"",
  constant_name:"MOYASAR"
};

const form = reactive({ ...initialState });

const active_payment_gateway = toRef(props,'active_payment_gateway');
if(active_payment_gateway.value.name=='MOYASAR'){
  form.merchant_key = active_payment_gateway.value.key;
  form.sms_template = active_payment_gateway.value.sms_template;
}

const schema = yup.object().shape({
  constant_name: yup.string().required(t('name is required', { name: t('Payment Gateway Name') })),
  merchant_key: yup.string().required(t('name is required', { name: t('Merchant Key') })),
  sms_template: yup.string().required(t('name is required', { name: t('SMS Template') })),
});

var form_data = new FormData();
async function savePaymentGatewaySetting(){
  form.is_submitting = true;
  var form_data = new FormData();
  form_data.append('merchant_key',form.merchant_key);
  form_data.append('sms_template',form.sms_template);
  form_data.append('payment_gateway',form.constant_name);

  await axios.post('/api/payment_gateway_setting/save', form_data, {}).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      form.is_submitting = false;
      router.push('/payment_gateway');

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
  });

}

function resetData(){
    selected_branch.value = '';
}

</script>