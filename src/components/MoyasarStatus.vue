<template>

  <div class="sing-in-wrap front-display">
    <div class="row g-0">
      <div class="col-md-6 signinbanner mobile-bg-remove" style="background-image: url('../assets/images/signin-banner.jpg');">
        <div class="logo" data-aos="zoom-in">
          <img src="../assets/images/logo.png"/>
        </div>
        <div class="paymentimg"><img src="../assets/images/kitchen/payment-img.svg"/></div>
      </div>
      <div class="col-md-6 d-flex align-items-center justify-content-center">
        <div class="inner msg-inner-wrap">
          <img v-if="is_payment_success" src="../assets/images/kitchen/success.svg" class="mb-3" data-aos="fade"/>
          <img v-else src="../assets/images/kitchen/error.svg" class="mb-3" data-aos="fade"/>

          <h2 v-if="is_payment_success" data-aos="fade">{{ $t('Your Payment is Successful') }}</h2>
          <h2 v-else data-aos="fade">{{ $t('Oops, Payment is Fail') }}</h2>

          <p v-if="is_payment_success" data-aos="fade" data-aos-delay="100">{{ $t('Thank you for your payment.') }}</p>
          <p v-else data-aos="fade" data-aos-delay="100">{{ $t('Payment was unsuccessful. Try Again Please') }}</p>
          <div class="mt-md-4" v-if="is_payment_success==false">
            <button class="btn btn-danger btn-sm">{{ $t('Try Again') }}</button>
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
    import {useRoute} from "vue-router";
    import {onMounted} from "vue";

    const route = useRoute();

    const is_payment_success = ref(false);
    if(route.query.status=='paid' && route.query.message=='APPROVED'){
      is_payment_success.value = true;
    }

    onMounted(() => {
      updatePaymentStatus(route.query.invoice_id);
    });

    async function updatePaymentStatus(invoice_id) {
      if(is_payment_success.value==true){
        await axios.get('/api/online_payment/update_payment_status', { params : {
            data : route.query,
            invoice_id : invoice_id,
          } }).then( (response) => {
          if(response.data.status_code==200){

          }else{
            server_messages.type = "error";
            server_messages.messages = response.data.msg;
          }
        }).catch((error) => {
          server_messages.type = "error";
          server_messages.messages = error;
          console.log(error);
        });
      }

    }

</script>
