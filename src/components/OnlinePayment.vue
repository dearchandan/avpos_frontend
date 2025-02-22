<template>

  <div class="sing-in-wrap front-display">
    <div class="row g-0">
      <div class="col-md-6 signinbanner paymentsidebanner mobile-bg-remove" style="">
        <div class="logo" data-aos="zoom-in">
          <img src="../assets/images/logo.png"/>
        </div>
        <div class="paymentimg"><img src="../assets/images/kitchen/payment-img.svg"/></div>
      </div>
      <div class="col-md-6 d-flex align-items-center justify-content-center">
        <div class="inner">
          <h2 data-aos="fade-up">{{ $t('Payment Detail') }}</h2>

          <div class="singin-box">

            <div v-if="server_messages.messages != ''">
              <ServerMessage :server_messages="server_messages" class="mt-3" />
            </div>
            <div class="pd-table" v-if="online_payment!=null && invoice_data!=null && invalid_link">
              <table>
                <tr>
                  <th>{{ $t('Type')}}</th>
                  <td>{{online_payment.bill_to }}</td>
                </tr>
                <tr>
                  <th>{{ $t('Number')}}</th>
                  <td>{{invoice_data.invoice!=null?invoice_data.invoice.invoice_number:'' }}</td>
                </tr>
                <tr>
                  <th>{{ $t('Customer')}}</th>
                  <td>{{invoice_data.invoice!=null?invoice_data.invoice.customer_name:'' }}</td>
                </tr>
                <tr>
                  <th>{{ $t('Amount')}}</th>
                  <td>{{online_payment.amount }} SAR</td>
                </tr>
              </table>
            </div>

            <div>
              <button @click="payNow()" class="btn btn-primary btn-md w-100" :disabled="is_processing" v-if="invalid_link">
                <clip-loader v-if="is_processing" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                <span class="pt-0" v-if="is_processing">{{ $t('paying...') }}</span>
                <span class="pt-0" v-else>{{ $t('Pay') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
    
    import { Form, Field } from 'vee-validate'
    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import logo from '@/assets/images/logo.png'
    import women_img from '@/assets/images/loginpage/women.png';
    import '@/assets/css/kitchen_style.css'
    import {onMounted, ref} from "vue";
    import {useRoute} from "vue-router";


    const server_messages = reactive({
        type : "",
        messages : "",
    });

    const route = useRoute();
    const merchant_id = route.params.id;
    const slack = route.params.slack;
    const is_processing = ref(false);
    onMounted(() => {
      getPaymentDetail();
    });

    const online_payment = ref([]);
    const invoice_data = ref([]);
    const invalid_link = ref(true);
    async function getPaymentDetail() {
      await axios.get('/api/online_payment', { params : {
          slack : slack,
        } }).then( (response) => {
          if(response.data.status_code==200){
            online_payment.value = response.data.data.online_payment_data;
            invoice_data.value = jQuery.parseJSON( response.data.data.online_payment_data.data_json )
          }else{
            invalid_link.value = false;
            server_messages.type = "error";
            server_messages.messages = response.data.msg;
          }
      }).catch((error) => {
        server_messages.type = "error";
        server_messages.messages = error;
        console.log(error);
      });

    }

    async function payNow(){
      try{

        is_processing.value = true;

        var form_data = new FormData();
        form_data.append('merchant_id',merchant_id);
        form_data.append('slack',slack);
        await axios.post('/api/online_payment/save', form_data).then( (response) => {
          is_processing.value = false;
          if (response.data.status_code == 200) {
            location.href = response.data.data.redirect_url;
          } else {
            try {
              server_messages.type = "error";
              server_messages.messages = JSON.parse(response.msg);
            } catch (err) {
              server_messages.type = "error";
              server_messages.messages = response.msg;
            }
          }
        });

      }catch(error) {

        server_messages.type = "error";
        server_messages.messages = error;
        is_processing.value = false;
        console.log(error);

      }
    }

</script>
