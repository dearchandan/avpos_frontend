<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/merchants" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Merchants') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="slack == '' || slack == undefined">{{ $t('Add Merchant') }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t('Edit Merchant') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content" v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)"
>
           
            <Form :validation-schema="schema" :initial-values="form" @submit="saveMerchant" enctype="multipart/form-data">
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
                                                    type="text" 
                                                    name="name"
                                                    v-model="form.name"
                                                    :label="labels.name"
                                                    :required="true"
                                                />
                                            </div>
                                            
                                            <div class="col-md-3">
                                                <VTextInput
                                                    type="email" 
                                                    name="email"
                                                    v-model="form.email"
                                                    :label="labels.email"
                                                    required
                                                />
                                            </div>
                                            
                                            <div class="col-md-3">
                                                <VTextInput
                                                    type="number" 
                                                    name="phone"
                                                    v-model="form.phone"
                                                    :label="labels.phone"
                                                    required
                                                />
                                            </div>
                                            <div class="col-md-3">
                                                <VMultiSelect
                                                    name="business_type"
                                                    :label="labels.business_type"
                                                    :placeholder="labels.business_type"
                                                    :text="'value'"
                                                    :value="'key'"
                                                    :options="business_types"
                                                    v-model="form.business_type"
                                                    mode="single"
                                                    required
                                                    :selected="form.business_type"
                                                />

                                            </div>
                                            
                                            <div class="col-md-3">
                                                <VMultiSelect
                                                    name="country"
                                                    :label="labels.country"
                                                    :placeholder="labels.country"
                                                    :text="'name'"
                                                    :value="'slack'"
                                                    :options="countries"
                                                    v-model="form.country"
                                                    mode="single"
                                                    required
                                                    :selected="form.country"
                                                />
                                            </div>
                                            <div class="col-md-3">
                                                <VTextInput
                                                    type="text" 
                                                    name="address"
                                                    v-model="form.address"
                                                    :label="labels.address"
                                                />
                                            </div>
                                            
                                            <!-- <div class="col-md-3">
                                            <VTextInput
                                                type="text"
                                                name="vat_registration_number"
                                                v-model="form.vat_registration_number"
                                                :label="labels.vat_registration_number"
                                            />
                                            </div>

                                            <div class="col-md-3">
                                            <VTextInput
                                                type="text"
                                                name="gst_number"
                                                v-model="form.gst_number"
                                                :label="labels.gst_number"
                                            />
                                            </div>
                                            <div class="col-md-3">
                                            <VTextInput
                                                type="date"
                                                name="date_of_birth"
                                                v-model="form.date_of_birth"
                                                :label="labels.date_of_birth"
                                            />
                                            </div>
                                            <div class="col-md-3">
                                            <VTextInput
                                                type="date"
                                                name="date_of_anniversary"
                                                v-model="form.date_of_anniversary"
                                                :label="labels.date_of_anniversary"
                                            />
                                            </div>
                                            <div class="col-md-3">
                                            <VTextInput
                                                type="date"
                                                name="joining_date"
                                                v-model="form.joining_date"
                                                :label="labels.joining_date"
                                            />
                                            </div> -->
                                            <div class="col-md-3 pt-2">
                                                <div class="form-field pt-2">
                                                    <div class="form-check form-switch pt-4">
                                                    <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status">
                                                    <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div class="col-md-12 mb-4">
                                <div class="card" v-if="merchant.user_subscription">
                                    <h5 class="pb-3" >{{ $t('Subscription') }}
                                        <span v-if="merchant.user_subscription.status==0" class="badge badge-primary">{{ $t('Inactive') }}</span>
                                        <span v-if="merchant.user_subscription.status==1" class="badge badge-success">{{ $t('Active') }}</span>
                                        <span v-if="merchant.user_subscription.status==2" class="badge badge-warning">{{ $t('On Hold') }}</span>
                                        <span v-if="merchant.user_subscription.status==3" class="badge badge-gray">{{ $t('Upgraded') }}</span>
                                        <span v-if="merchant.user_subscription.status==4" class="badge badge-danger">{{ $t('Expired') }}</span>
                                    </h5>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text" 
                                                name="user_subscription.name"
                                                v-model="form.user_subscription.name"
                                                :label="labels.user_subscription_name"
                                                :readonly="true" :disabled="true" :title="$t('Read Only Field')"
                                            />
                                        </div>
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text" 
                                                name="user_subscription.start_date_label"
                                                v-model="form.user_subscription.start_date_label"
                                                :label="labels.user_subscription_start_date"
                                                :readonly="true" :disabled="true" :title="$t('Read Only Field')"
                                            />
                                        </div>
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text" 
                                                name="user_subscription.end_date_label"
                                                v-model="form.user_subscription.end_date_label"
                                                :label="labels.user_subscription_end_date"
                                                :readonly="true" :disabled="true" :title="$t('Read Only Field')"
                                            />
                                        </div>
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text" 
                                                name="user_subscription.active_subscriptions_at"
                                                v-model="form.user_subscription.active_subscriptions_at"
                                                :label="labels.user_subscription_active_subscriptions_at"
                                                :readonly="true" :disabled="true" :title="$t('Read Only Field')"
                                            />
                                        </div>
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text" 
                                                name="user_subscription.payable_amount"
                                                v-model="form.user_subscription.payable_amount"
                                                :label="labels.user_subscription_payable_amount"
                                                :readonly="true" :disabled="true" :title="$t('Read Only Field')"
                                            />
                                        </div>
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text" 
                                                name="user_subscription.status_text"
                                                v-model="form.user_subscription.status_text"
                                                :label="labels.user_subscription_status"
                                                :readonly="true" :disabled="true" :title="$t('Read Only Field')"
                                            />
                                        </div>
                                        
                                        <!-- <div class="col-md-3">
                                            <VTextInput
                                                type="text" 
                                                name="city"
                                                v-model="form.city"
                                                :label="labels.city"
                                            />
                                        </div>
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text" 
                                                name="pincode"
                                                v-model="form.pincode"
                                                :label="labels.pincode"
                                            />
                                        </div>
                                        <div class="col-md-3">
                                            <VTextInput
                                                type="text"
                                                name="state"
                                                v-model="form.state"
                                                :label="labels.state"
                                            />
                                        </div> -->

                                        

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
        <EditFormSkeleton v-else />

     </DefaultLayout>
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
import useGlobalFunctions from "@/composables/global_functions.js";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;
const { generatePassword } = useGlobalFunctions();

const labels = ref({
  name : t("Merchant Name"),
  email : t("Merchant Email"),
  phone :  t("Merchant Phone"),
  vat_registration_number :  t("VAT Registration Number"),
  gst_number: t("GST Number"),
  business_type :  t("Business Type"),
  date_of_birth :  t("Date Of Birth"),
  date_of_anniversary :  t("Date Of Anniversary"),
  joining_date :  t("Date Of Joining"),
  address :  t("Address"),
  second_address_line: t("Address Line 2"),
  city: t("City"),
  pincode: t("Pincode/Zipcode"),
  state: t("State"),
  user_subscription_name: t("Subscription Name"),
  user_subscription_start_date: t("Start Date"),
  user_subscription_end_date: t("End Date"),
  user_subscription_active_subscriptions_at: t("Subscription Ends In"),
  user_subscription_payable_amount: t("Subscription Amount"),
  user_subscription_status: t("Subscription Status"),
  country: t("Country"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  name : "",
  email : "",
  phone : "",
  merchant_type : "",
  vat_registration_number : "",
  gst_number : "",
  business_type : "",
  date_of_birth : "",
  date_of_anniversary : "",
  joining_date : "",
  status: true,
  address : "",
  first_address_line : "",
  second_address_line : "",
  city : "",
  pincode : "",
  state : "",
  country : "",
  merchant_slack : "",
  user_subscription : {name:'',status_text:''},
};

const form = reactive({ ...initialState });

const schema = yup.object({
    name: yup.string()
    .required(t('name is required', { name: t('Merchant Name') }))
    .min(3,t('name must be at least n characters', { name: t('Merchant Name'), number: 3 }))
    .default(''),
    country: yup.string()
    .required(t('Country is required', { name: t('Country') })),
    business_type: yup.string()
    .required(t('business type is required', { name: t('Business Type') })),
    email: yup
        .string()
        .required(t("name is required", { name: t("Email") }))
        .email(t("must be a valid email", { name: t("Email") })),
    phone: yup.string().matches(/^[0-9]{9,10}$/, t('Phone must be 9 or 10 digits')).typeError(t('must be a number',{ name: t('Phone') })).required(t('phone is required', { name: t('Phone') })).min(9).max(10),

});

onMounted(() => {
    getCountries();
    if(slack != '' && slack != undefined)
    getMerchant();
    fetchBusinessTypes();
});

const business_types = ref([]);
async function fetchBusinessTypes(){
    let data = await axios.get('api/business_types');
    business_types.value = data.data;
}

const countries = ref([]);
const merchant = ref([]);
async function getCountries(){
  await axios.get('/api/countries/serving').then( (response) => {

    if(response.data.status_code == 200) {
      countries.value = response.data.data;
    }else{
      try{
        form.server_messages.type = "error";
        form.server_messages.messages = JSON.parse(response.data.msg);
      }catch(err){
        form.server_messages.type = "error";
        form.server_messages.messages = response.data.msg;
      }
    }

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    console.log(error);
  });

}

const is_loaded = ref(false);

async function getMerchant(){

    await axios.post('/api/merchant', { slack : slack }).then( (response) => {
    
        merchant.value = response.data.data;
        if(response.data.data){
          form.merchant_slack = response.data.data.slack;
          form.name = response.data.data.name;
          form.email = response.data.data.email;
          form.city = response.data.data.city;
          form.state = response.data.data.state;
          form.gst_number = response.data.data.gst_number;
          form.vat_registration_number = response.data.data.vat_number;
          form.business_type = response.data.data.business_type;
          form.phone = response.data.data.phone;
          form.address = response.data.data.address;
          form.second_address_line = response.data.data.second_address_line;
          form.pincode = response.data.data.postal_code;
          form.country = response.data.data.country_slack;
          form.date_of_anniversary = response.data.data.date_of_anniversary;
          form.date_of_birth = response.data.data.date_of_birth;
          form.joining_date = response.data.data.joining_date;
          form.merchant_type = response.data.data.type;
          form.status = response.data.data.status == 1?true:false;
          form.user_subscription = response.data.data.user_subscription;
        }
        is_loaded.value = true;
        // console.log('form =', form.user_subscription.name );
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
    });

}
async function saveMerchant(){

    form.is_submitting = true;

    var form_data = new FormData();
    form_data.append('s_token',import.meta.env.VITE_WOSUL_INTEGRATION_TOKEN);
    form_data.append('merchant_name',form.name);
    form_data.append('business_type',form.business_type);
    form_data.append('merchant_email',form.email);
    form_data.append('phone',form.phone);
    form_data.append('status',form.status);
    form_data.append('country',form.country);
    form_data.append('password',generatePassword(8));
    form_data.append('merchant_slack',form.merchant_slack);
    form_data.append('is_register_mail_send',true);

    var submit_url = form.merchant_slack != '' && form.merchant_slack != undefined?'/api/merchant/update':'/api/web_register';

    await axios.post(submit_url, form_data).then( (response) => {
        
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_submitting = false;

            if(!form.merchant_slack || form.merchant_slack == undefined){
                /* from add screen */
                router.push('/merchant/'+response.data.data.user.slack);
            }else{
                /* from edit screen */
                router.push('/merchants');
            }
            

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