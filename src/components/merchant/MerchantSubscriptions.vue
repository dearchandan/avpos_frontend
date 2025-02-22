<template>
  <div>
    <div class="row pb-4 align-items-center justify-content-between">
        <div class="col-auto">
          <h5 class="pt-2">{{ $t("Subscriptions") }}</h5>
        </div>
        <div class="col-auto text-end">
          <a
            v-if="!is_subscriptions_loading && !subscriptions.length"
            class="btn btn-light-primary btn-sm me-3"
            href="#"
            @click="activateFreeTrial()"
          >
            <span >{{ $t("Activate Free Trial") }}</span>
          
          </a>

          <a
           v-if="!is_subscriptions_loading"
            class="btn btn-light-primary2 btn-sm"
            href="#"
            data-bs-toggle="modal"
            @click="openRenewSubscriptionModal()"
            data-bs-target="#RenewSubscriptionModal"
          >
            <span v-if="subscriptions.length">{{ $t("Renew Subscription") }}</span>
            <span v-else>{{ $t("Add Subscription") }}</span>
          
          </a>
          
        </div>
      </div>

      <div class="row">
        <ListingSkeleton v-if="is_subscriptions_loading" />
        <div v-else class="col-12 py-3">
          <div class="table-responsive">
            <table class="table table-condensed">
              <thead>
                <tr>
                  <th>{{ $t("Plan Name") }}</th>
                  <th>{{ $t("Subscription Period") }}</th>
                  <th>{{ $t("Days Left") }}</th>
                  <th>{{ $t("Amount") }}</th>
                  <th>{{ $t("Payment Mode") }}</th>
                  <th>{{ $t("Payment Status") }}</th>
                  <th>{{ $t("Running Status") }}</th>
                  <th>{{ $t("Purchased At") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="subscriptions != ''"
                  v-for="(subscription, index) in subscriptions"
                  :key="index"
                >
                  <td @click="viewUserSubscription(subscription.slack)" role="button">
                    <strong :class="{ 'text-success' : subscription.running_status == 'Running' }" v-if="subscription.subscription">{{
                      subscription.subscription.name
                    }}</strong>
                  </td>
                  <td @click="viewUserSubscription(subscription.slack)" role="button">{{ subscription.start_date_label }} - {{ subscription.end_date_label }}</td>
                  <td @click="viewUserSubscription(subscription.slack)" role="button">
                    <span v-if="subscription.status == 1">{{ subscription.days_left }}  {{ $t('Days') }}</span> 
                    <span v-else>-</span> 
                  </td>
                  <td @click="viewUserSubscription(subscription.slack)" role="button">
                    <span v-if="subscription.subscription.is_trial" class="fw-bold text-primary">Free Trial</span>
                    <span v-else>{{ subscription.payable_amount }} {{ currency_symbol }}</span>
                  </td>
                  <td @click="viewUserSubscription(subscription.slack)" role="button">{{ subscription.payment_mode!=null?subscription.payment_mode.name:'-'}}</td>
                  <td v-if="subscription.payment_status == 0">
                    <div class="form-feild">
                      <div class="form-check form-switch form-switch-2">
                        <div class="text-danger">Unpaid</div>
                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(subscription.slack)"><br/>

                      </div>
                    </div>
                  </td>
                  <td v-if="subscription.payment_status == 1" @click="viewUserSubscription(subscription.slack)" role="button">
                    <span class="badge badge-success">{{ $t('Paid') }}</span>
                  </td>
                  <td @click="viewUserSubscription(subscription.slack)" role="button">
                    <span
                      v-if="subscription.running_status == 'Awaiting'"
                      class="badge badge-warning"
                    >
                      {{ subscription.running_status }}
                    </span>
                    <span
                      v-if="subscription.running_status == 'Running'"
                      class="badge badge-success"
                    >
                      {{ subscription.running_status }}
                    </span>
                    <span
                      v-if="subscription.running_status == 'Expired'"
                      class="badge badge-danger"
                    >
                      {{ subscription.running_status }}</span
                    >
                  </td>
                  <td @click="viewUserSubscription(subscription.slack)" role="button">{{ subscription.created_at_label }}</td>
                </tr>
                <tr v-else>
                  <td colspan="9" class="text-center">
                    {{ $t("No Subscriptions Found") }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Renew Subscription Modal -->
      <AsyncRenewSubscriptionModal ref="renew_subscription_modal" :show_renew_subscription_modal="show_renew_subscription_modal" @closeRenewSubscriptionModal="closeRenewSubscriptionModal" :merchant="merchant" :edit_data="edit_data"/>

  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps(["merchant"]);
const merchant = toRef(props, "merchant");
const subscriptions = ref([]);

const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
});

defineExpose({
      getMerchantSubscriptions,
});

const AsyncRenewSubscriptionModal = defineAsyncComponent( () => import('@/components/merchant/RenewSubscriptionModal.vue') );

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,
};

const form = reactive({ ...initialState });

onMounted(() => {
  getMerchantSubscriptions();
});

const is_subscriptions_loading = ref(true);

async function getMerchantSubscriptions() {
  await axios.get("/api/v2/user/subscriptions", { params: { id: merchant.value.id } })
    .then((response) => {
      subscriptions.value = response.data.data.data;
      is_subscriptions_loading.value = false;
    })
    .catch((error) => {
      is_subscriptions_loading.value = false;
      form.server_messages.type = "error";
      form.server_messages.messages = error;
    });
}

/* Subscription Renew Modal */
const show_renew_subscription_modal = ref(false);
const renew_subscription_modal = ref('');

const edit_data = ref([]);
function openRenewSubscriptionModal(editdata = ""){
  edit_data.value = editdata;
  renew_subscription_modal.value.getRenewalDetails; 
  $('#renewSubscriptionModal').modal('show');
}
function closeRenewSubscriptionModal(){
  show_renew_subscription_modal.value = false;
  $('#renewSubscriptionModal').modal('hide');
  getMerchantSubscriptions();
}

/* Activate Free Trial */
function activateFreeTrial(){

    is_subscriptions_loading.value = true;

    Swal.fire({
      title: t("Do you want to activate free trial for this merchant?"),
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      confirmButtonColor: "#d33",
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
          let form_data = new FormData();
          form_data.append('user_id',merchant.value.id);
          axios.post("/api/v2/user/activate_free_trial",form_data).then((response) => {
            toast.success(response.data.msg);
            getMerchantSubscriptions();
            is_subscriptions_loading.value = false;
          })
          .catch((error) => {
            is_subscriptions_loading.value = false;
            form.server_messages.type = "error";
            form.server_messages.messages = error;
          });
      }
    });
  
}

async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);

  await axios.post('/api/v2/user/subscription/update_status', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      getMerchantSubscriptions();
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

function viewUserSubscription(slack){
  router.push('/merchant/subscription/'+slack);
}
</script>
