<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/coupons" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t("Coupons") }}</router-link>                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold" v-if="slack=='' || slack==undefined">{{ $t("Add Coupon") }}</h5>
                        <h5 class="fw-bold" v-else>{{ $t("Edit Coupon") }}</h5>
                    </div>
                 
                </div>
            </div>
        </template>

        <div class="content">
      
            <Form :validation-schema="schema" @submit="saveCoupon" enctype="multipart/form-data">
                <div class="row ">
                    
                    
                    <div class="col-md-12">

                        
                        <div class="row">
                            
                                <div class="col-md-12 mb-4">
                                    <div class="form-field float-end pb-0 mb-0">
                                        <div class="form-check form-switch form-switch-2">
                                            <label for="status">
                                                <span class="fw-bold text-uppercase text-primary" v-if="form.status">{{ $t("Active") }}</span> 
                                                <span v-else class="fw-bold text-uppercase text-muted">{{ $t("Inactive") }}</span>
                                                <input class="form-check-input" type="checkbox" role="switch" id="status" v-model="form.status" :checked="form.status == 1"> 
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-12">

                                    <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''" :server_messages="form.server_messages"  />
                    
                                 
                                    <div class="card">
                                            
                                            <div class="row">

                                                <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="coupon_name"
                                                        v-model="form.coupon_name"
                                                        :label="labels.coupon_name"
                                                        :required="true"
                                                        @keydown.space="(event) => event.preventDefault()"
                                                    />
                                                </div>

                                                <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="coupon_name_ar"
                                                        v-model="form.coupon_name_ar"
                                                        :label="labels.coupon_name_ar" 
                                                    />
                                                </div>
                                            
                                                <div class="col-md-3">

                                                    
                                                    <div class="form-field">
                                                        
                                                        <label for="" class="label pb-2">{{ $t("Coupon Type") }} <em>*</em></label> <br>

                                                        <label v-for="(option,index) in coupon_types" class="label me-3">
                                                            <Field class="form-check-input me-1" name="coupon_type" type="radio" :id="index" :value="option.value" v-model="form.coupon_type" /> 
                                                            {{ option.name }}
                                                        </label>
                                                        <ErrorMessage name="coupon_type" as="div" class="error"></ErrorMessage>
                                                    </div>

                                                </div>

                                                <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="coupon_value"
                                                        v-model="form.coupon_value"
                                                        :label="(form.coupon_type == 1) ? labels.coupon_percentage : labels.coupon_amount" 
                                                        :required="true"
                                                    />
                                                </div>

                                                <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="minimum_order_amount"
                                                        v-model="form.minimum_order_amount"
                                                        :label="labels.minimum_order_amount"
                                                        tooltip="Total order amount should be more than this to avail the coupon"
                                                    />
    
                                                </div>
                                                
                                                <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="maximum_discount_amount"
                                                        v-model="form.maximum_discount_amount"
                                                        :label="labels.maximum_discount_amount"
                                                    />
                                                </div>
                                                
                                                <div class="col-md-3">
                                                    <VTextInput
                                                    type="text" 
                                                    name="coupon_quantity"
                                                    v-model="form.coupon_quantity"
                                                    :label="labels.coupon_quantity"
                                                    tooltip="keeping it blank will be considered unlimited quantity"
                                                    />
                                                </div>

                                                <div class="col-3">
                                                    <div class="form-field">
                                                        <label for="" class="form-label">{{ $t("Date Range") }} <VTooltip message="Keeping dates unselected will make it applicable always" /> </label>
                                                        <VueDatePicker range  v-model="form.date_range" :format="'dd-MM-yyyy'" :enable-time-picker="false" input-class-name="form-control form-control-solid"  />

                                                    </div>
                                                </div>


                                                <div class="col-md-3">
                                                    <VTextInput
                                                    type="number" 
                                                    name="usage_limit_per_customer"
                                                    v-model="form.usage_limit_per_customer"
                                                    :label="labels.usage_limit_per_customer"
                                                    />
                                                </div>

                                                <div class="col-md-3">

                                                    <VSelect
                                                        name="customer_type"
                                                        :label="labels.customer_type"
                                                        v-model="form.customer_type"
                                                        :placeholder="labels.select_customer_type"
                                                        :options="customer_types"
                                                        required
                                                        @change="getCustomers"
                                                    />

                                                </div>
                                                
                                                <div class="col-md-6" v-if="form.customer_type == 3">

                                                    <label for="" class="label text-dark">{{ $t("Select Customers") }} <em class="text-danger">*</em></label>
                                                    <multiselect 
                                                        v-model="form.customers"
                                                        name="customers"
                                                        :options="form.customer_list" 
                                                        label="name" 
                                                        mode="tags"
                                                        valueProp="id" 
                                                        :searchable="true " 
                                                        class="form-control"
                                                        :placeholder="labels.select_customer"
                                                    />

                                                </div>
                                               

                                                <div class="col-3" v-if="slack=='' || slack==undefined">
                                                    <div class="form-field">
                                                        <label>{{ $t("Note") }}</label>
                                                        <Field
                                                            as="textarea"
                                                            class="form-control form-control-solid p-3" 
                                                            name="note"
                                                            v-model="form.note"
                                                            :label="labels.note" 
                                                            cols="3"
                                                        ></Field>
                                                        <ErrorMessage name="note" as="div" class="error"></ErrorMessage>
                                                    </div>
                                                </div>

                                                
                                                
                                                <div class="col-md-3">
                                                    <div class="form-field">
                                                        <div class="form-check form-switch form-switch-2 pt-4">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="is_taxable" v-model="form.is_taxable" :checked="form.is_taxable == 1"> {{ $t("Is Taxable") }}
                                                        </div>
                                                    </div>
                                                </div>
                                             

                                            </div>
                                            <!-- <div class="row">
                                                <div class="text-end">
                                                    <button 
                                                        type="submit"
                                                        class="btn btn-primary" 
                                                        :disabled="form.is_submitting"
                                                        >   
                                                            <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                                            <span class="pt-0" v-if="form.is_submitting">
                                                                Saving...
                                                            </span>
                                                            <span class="pt-0" v-else>
                                                                Save
                                                            </span> 

                                                    </button>
                                                </div>
                                            </div> -->

                                    </div>

                                </div>

                                <div class="col-12">
                                    
                                    <div class="text-end">
                                        <button 
                                            type="submit"
                                            class="btn btn-primary" 
                                            :disabled="form.is_submitting"
                                            >   
                                                <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                                <span class="pt-0" v-if="form.is_submitting">
                                                    {{ $t("Saving...") }}
                                                </span>
                                                <span class="pt-0" v-else>
                                                    {{ $t("Save") }}
                                                </span> 

                                        </button>
                                    </div>
                                </div>
                            
                        </div>
                    </div>
                </div>
               
            </Form>
        </div>
     </DefaultLayout>
</template>

<script setup>

import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import useGlobal from '@/composables/global.js';
import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
/* Route parameter */
const route = useRoute();
const slack = route.params.slack;

const multiselect = defineComponent(
    Multiselect
)

const { customer_types, coupon_types } = useGlobal();
const labels = ref({

  coupon_name : t("Coupon Name"),
  coupon_name_ar : t("Coupon Name (Arabic)"),
  coupon_percentage :  t("Coupon Percentage"),
  coupon_amount :  t("Coupon Amount"),
  minimum_order_amount :  t("Minimum Order Amount"),
  maximum_discount_amount :  t("Maximum Discount Amount"),
  coupon_quantity :  t("Coupon Quantity"),
  usage_limit_per_customer :  t("Usage Limit Per Customer"),
  note :  t("Note"),
  customer_type: t("Customer Type"),
  select_customer_type: t("Select Customer Type"),
  select_customer: t("Select Customers")
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  coupon_slack : "",
  coupon_name : "",
  coupon_name_ar : "",
  coupon_type : 1,
  coupon_value : "",
  minimum_order_amount : "",
  maximum_discount_amount : "",
  coupon_quantity : "",
  date_range : "",
  is_taxable : ref(false),
  status : ref(true),
  usage_limit_per_customer : 1,
  customer_type : 1,
  note : "",
  customers : [],
  customer_list : [],
  is_listing : false,
};

const form = reactive({ ...initialState });

const start_datetime = computed(() => {
    if(form.date_range != '' && form.date_range[0] != null){
        return moment(form.date_range[0]).format('YYYY-MM-DD HH:mm');
    }else{
        return '';
    }
});

const end_datetime = computed(() => {
    if(form.date_range != '' && form.date_range[1] != null){
        return moment(form.date_range[1]).format('YYYY-MM-DD HH:mm');
    }else{
        return '';
    }
});

const schema = yup.object({
    coupon_name: yup.string().required(t('name is required', { name: t('Coupon Name') })).matches(/^(\S+$)/g, t('should not contain blankspace',{name:t("Coupon Name")})).min(2,t('name must be at least n characters', { name: t('Coupon Name'), number: 2 })),
    coupon_type: yup.number().required(t('name is required', { name: t('Coupon Type') })),
    coupon_value: yup.number().required(t('name is required', { name: t('Value') })),
    customer_type: yup.number().required(t('name is required', { name: t('Customer Type') })),
});

onMounted(()=>{
    if(slack != '' && slack !=undefined)
    getCoupon();
})

async function getCustomers(){

    if(form.customer_type == 3){
        
        form.is_listing = true;
    
        await axios.get('/api/customers/all').then( (response) => {
        
            form.customer_list = response.data.data;
            form.is_listing = false;
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            form.is_listing = false;
            console.log(error);
        });

    }

}

async function saveCoupon(){

    form.is_submitting = true;

    var form_data = new FormData();
    form_data.append('coupon_slack',form.coupon_slack);
    form_data.append('coupon_name',form.coupon_name);
    form_data.append('coupon_name_ar',form.coupon_name_ar);
    form_data.append('coupon_type',form.coupon_type);
    form_data.append('coupon_value',form.coupon_value);
    form_data.append('minimum_order_amount',form.minimum_order_amount);
    form_data.append('maximum_discount_amount',form.maximum_discount_amount);
    form_data.append('coupon_quantity',form.coupon_quantity);
    form_data.append('start_datetime',start_datetime.value);
    form_data.append('end_datetime',end_datetime.value);
    form_data.append('is_taxable',form.is_taxable);
    form_data.append('status',form.status);
    form_data.append('usage_limit_per_customer',form.usage_limit_per_customer);
    form_data.append('customer_type',form.customer_type);
    form_data.append('note',form.note);
    form_data.append('customers',JSON.stringify(form.customers));
     var submit_url = form.coupon_slack != '' && form.coupon_slack != undefined?'/api/coupon/update':'/api/coupon/save';

    await axios.post(submit_url, form_data).then( (response) => {
        
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_submitting = false;
            
            // resetData();
            router.push('/coupons');

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

async function getCoupon(){

    await axios.get('/api/coupon', { params : {
            slack : slack,
        } }).then( (response) => {
        
        if(response.data.data.coupon)
        {
            form.coupon_slack = response.data.data.coupon.slack;
            form.coupon_name = response.data.data.coupon.name;
            form.coupon_name_ar = response.data.data.coupon.name_ar;
            form.coupon_type = parseInt(response.data.data.coupon.type);
            form.coupon_value = response.data.data.coupon.value;
            form.minimum_order_amount = response.data.data.coupon.minimum_order_amount;
            form.maximum_discount_amount = response.data.data.coupon.maximum_discount_amount;
            form.coupon_quantity = response.data.data.coupon.coupon_quantity;
            form.date_range = [new Date(String(response.data.data.coupon.start_datetime)),new Date(String(response.data.data.coupon.end_datetime))];
            form.is_taxable = response.data.data.coupon.is_taxable == 1?true:false;
            form.status = response.data.data.coupon.status == 1?true:false;
            form.usage_limit_per_customer = 1;
            form.customer_type = response.data.data.coupon.customer_type;
            if(response.data.data.coupon.customer_type == 3){
                getCustomers();
            }
            if(response.data.data.coupon.customers != undefined && response.data.data.coupon.customer_type == 3) 
            {
                form.customers = [];
                response.data.data.coupon.customers.forEach((key) => {
                    if(!form.customers.includes(key.customer_id)){
                        form.customers.push(key.customer_id)
                    }
                });
            }
        }
        //form.branches = response.data.data.branches
        // form.applies_to_all_branch = response.data.data.coupon.applies_to_all_branch;
        //form.selected_branch = '';

    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
    });

}

function resetData(){
    Object.assign(form, initialState);
}

const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

</script>