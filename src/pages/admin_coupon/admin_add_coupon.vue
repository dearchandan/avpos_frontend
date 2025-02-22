<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/admin/coupons" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t("Coupons") }}</router-link>                        </div>
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
                                                        name="name"
                                                        v-model="form.name"
                                                        :label="labels.name"
                                                        :required="true"
                                                        @keydown.space="(event) => event.preventDefault()"
                                                    />
                                                </div>

                                                <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="name_ar"
                                                        v-model="form.name_ar"
                                                        :label="labels.name_ar" 
                                                    />
                                                </div>
                                            
                                                <div class="col-md-3">

                                                    
                                                    <div class="form-field">
                                                        
                                                        <label for="" class="label pb-2">{{ $t("Coupon Type") }} <em>*</em></label> <br>

                                                        <label v-for="(option,index) in coupon_types" class="label me-3">
                                                            <Field class="form-check-input me-1" name="type" type="radio" :id="index" :value="option.value" v-model="form.type" /> 
                                                            {{ option.name }}
                                                        </label>
                                                        <ErrorMessage name="type" as="div" class="error"></ErrorMessage>
                                                    </div>

                                                </div>

                                                <div class="col-md-3">
                                                    <VTextInput
                                                        type="text" 
                                                        name="value"
                                                        v-model="form.value"
                                                        :label="(form.type == 1) ? labels.coupon_percentage : labels.coupon_amount" 
                                                        :required="true"
                                                    />
                                                </div>

                                                
                                                <div class="col-md-3">
                                                    <VTextInput
                                                    type="text" 
                                                    name="quantity"
                                                    v-model="form.quantity"
                                                    :label="labels.quantity"
                                                    tooltip="keeping it blank will be considered unlimited quantity"
                                                    />
                                                </div>

                                                <div class="col-3">
                                                    <div class="form-field">
                                                        <label for="" class="form-label">{{ $t("Date Range") }} <VTooltip message="Keeping dates unselected will make it applicable always" /> </label>
                                                        <VueDatePicker range  v-model="form.date_range" :format="'dd-MM-yyyy'" :enable-time-picker="false" input-class-name="form-control form-control-solid"  />

                                                    </div>
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

                                            
                                            </div>
                                           
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
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import useGlobal from '@/composables/global.js';
import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
/* Route parameter */
const route = useRoute();
const slack = route.params.slack;

const { coupon_types } = useGlobal();
const labels = ref({

  name : t("Coupon Name"),
  name_ar : t("Coupon Name (Arabic)"),
  coupon_percentage :  t("Coupon Percentage"),
  coupon_amount :  t("Coupon Amount"),
  quantity :  t("Coupon Quantity"),
  note :  t("Note"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  coupon_slack : "",
  name : "",
  name_ar : "",
  type : 1,
  value : "",
  quantity : "",
  date_range : "",
  status : ref(true),
  note : "",
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
    name: yup.string().required(t('name is required', { name: t('Coupon Name') })).matches(/^(\S+$)/g, t('should not contain blankspace',{name:t("Coupon Name")})).min(2,t('name must be at least n characters', { name: t('Coupon Name'), number: 2 })),
    type: yup.number().required(t('name is required', { name: t('Coupon Type') })),
    value: yup.number().required(t('name is required', { name: t('Value') })),
});

onMounted(()=>{
    if(slack != '' && slack !=undefined)
    getCoupon();
})

async function saveCoupon(){

    form.is_submitting = true;

    var form_data = new FormData();
    form_data.append('coupon_slack',form.coupon_slack);
    form_data.append('name',form.name);
    form_data.append('name_ar',form.name_ar);
    form_data.append('type',form.type);
    form_data.append('value',form.value);
    form_data.append('quantity',form.quantity);
    form_data.append('start_datetime',start_datetime.value);
    form_data.append('end_datetime',end_datetime.value);
    form_data.append('status',form.status);
    form_data.append('note',form.note);
     var submit_url = form.coupon_slack != '' && form.coupon_slack != undefined?'/api/admin/coupon/update':'/api/admin/coupon/save';

    await axios.post(submit_url, form_data).then( (response) => {
        
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_submitting = false;
            
            // resetData();
            router.push('/admin/coupons');

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

    await axios.get('/api/admin/coupon', { params : {
            slack : slack,
        } }).then( (response) => {
        
        if(response.data.data.coupon)
        {
            form.coupon_slack = response.data.data.coupon.slack;
            form.name = response.data.data.coupon.name;
            form.name_ar = response.data.data.coupon.name_ar;
            form.type = parseInt(response.data.data.coupon.type);
            form.value = response.data.data.coupon.value;
            form.quantity = response.data.data.coupon.quantity;
            form.date_range = [new Date(String(response.data.data.coupon.start_datetime)),new Date(String(response.data.data.coupon.end_datetime))];
            form.status = response.data.data.coupon.status == 1?true:false;
        }

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