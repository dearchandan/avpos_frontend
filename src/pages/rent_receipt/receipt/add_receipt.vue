<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/rent_receipts"
              ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Rent Receipts") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == undefined || slack == ''">
              {{ $t("Add Rent Receipt") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Rent Receipt") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content" v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)">
      <Form
          :validation-schema="schema"
          @submit="saveRentReceipt"
          enctype="multipart/form-data"
          :initial-values="form"
      >
        <div class="row card-strash">
          <div class="py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage :server_messages="form.server_messages" />
          </div>

          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <div class="card">
                  <div class="row">
                    <div class="col-md-2">
                      <VTextInput
                          type="text"
                          name="voucher_number"
                          v-model="form.voucher_number"
                          :label="labels.receipt_number"
                          :disabled="true"
                          :required="true"
                      />
                    </div>

                    <div class="col-md-2">
                      <VTextInput
                          type="date"
                          name="voucher_date"
                          v-model="form.voucher_date"
                          :label="labels.receipt_date"
                          :required="true"
                      />
                    </div>

                    <div class="col-md-2">
                      <VTextInput
                          type="number"
                          name="balance_amount"
                          v-model="form.balance_amount"
                          :label="labels.balance_amount"
                          :disabled="true"
                          :required="true"
                      />
                    </div>
                    <div class="col-md-2">
                      <VTextInput
                          type="number"
                          name="withdrawal_amount"
                          v-model="form.withdrawal_amount"
                          :label="labels.withdrawal_amount"
                          :max="form.balance_amount"
                          :required="true"
                      />
                    </div>
                    <div class="col-md-2">
                      <VMultiSelect
                          :label="labels.rent_receipt_user"
                          name="closing_voucher_user_id"
                          :text="'name'"
                          :value="'id'"
                          :options="rent_receipt_users"
                          mode="single"
                          v-model="form.closing_voucher_user_id"
                          :placeholder="labels.select_rent_receipt_user"
                          :required="true"
                      />
                    </div>
                    <div class="col-md-2">
                      <VMultiSelect
                          :label="labels.payment_mode"
                          name="payment_mode"
                          :text="'name'"
                          :value="'id'"
                          :options="payment_mode"
                          mode="single"
                          v-model="form.payment_mode"
                          :placeholder="labels.select_payment_mode"
                          :required="true"
                      />
                    </div>
                    <div class="col-md-12">
                      <VTextInput
                          type="text"
                          name="note"
                          v-model="form.note"
                          :label="labels.note"
                      />
                    </div>
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
            ></clip-loader>
            <span class="pt-0" v-if="form.is_submitting">{{
                $t("Saving...")
              }}</span>
            <span class="pt-0" v-else>{{ $t("Save") }}</span>
          </button>
        </div>
      </Form>
    </div>
    <EditFormSkeleton v-else />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { ref, reactive, onMounted } from "vue";
import { Form } from "vee-validate";
import * as yup from "yup";
import VTextInput from "@/components/common/VTextInput.vue";

import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import VSelect from "@/components/common/VSelect.vue";

import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const slack = route.params.slack;
const labels = ref({
  receipt_number: t("Receipt Number"),
  receipt_date: t("Receipt Date"),
  balance_amount: t("Balance Amount"),
  withdrawal_amount: t("Withdrawal Amount"),
  note: t("Note"),
  rent_receipt_user: t("Rent Receipt User"),
  select_rent_receipt_user: t("Select User"),
  payment_mode: t("Payment Mode"),
  select_payment_mode: t("Select Payment Mode"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  voucher_number: "",
  voucher_date: "",
  balance_amount: "",
  withdrawal_amount: "",
  closing_voucher_user_id: "",
  payment_mode: "",
  note: "",
};

const form = reactive({ ...initialState });

let schema = yup.object({
  voucher_number: yup.string().required(t("name is required", { name: t("Receipt Number") })),
  voucher_date: yup.date().required(t("name is required", { name: t("Receipt Date") })),
  closing_voucher_user_id: yup.string().required(t("name is required", { name: t("Rent Receipt User") })),
  payment_mode: yup.string().required(t("name is required", { name: t("Payment Mode") })),
  withdrawal_amount: yup.number().required(t("name is required", { name: t("Withdrawal Amount") })).typeError(t('must be a number',{ name: t('Withdrawal Amount') })).min(1, t('Withdrawal Amount must be more than 1'))
      .test({
        test: function (value,context) {
          var max = $('[name="withdrawal_amount"]').attr("max");

          return value <= parseInt(max) ?true: context.createError({path:`${context.path}`,message:t("must be less than or equal to n", { name: t("Withdrawal Amount"), number:max })});
        },
      })
});

onMounted(() => {
  getAddData();
  if (slack != "" && slack != undefined){
    getRentReceipt();
  }
});

const payment_mode = ref([
  {
    'id': 'Cash',
    'name': 'Cash',
  },
  {
    'id': 'Online Transfer',
    'name': 'Online Transfer',
  },
]);

const rent_receipt_users = ref([]);
async function getAddData() {
  await axios
      .get("/api/voucher/add", { params : {type:2} })
      .then((response) => {
        if (response.data.status_code == 200) {
            if (slack==null) {
              form.voucher_number = response.data.data.voucher_number;
              form.voucher_date = response.data.data.date;
              form.balance_amount = response.data.data.balance_amount;
            }
          _.forEach(response.data.data.voucher_users, (item) => {
            if(item.status == 1){
              let template = {
                'id': item.id,
                'name': item.name,
              };
              rent_receipt_users.value.push(template);
            }
          })
        } else {
          try {
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
          } catch (err) {
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
          }
        }
      })
      .catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
      });
}

const is_loaded = ref(false);
async function getRentReceipt() {
  let response = await axios.get("/api/voucher", {
    params: {
      slack: slack,
      type: 2,
    },
  });
  if (response.data.data) {
    if(response.data.data.status>0){
      router.push("/rent_receipts");
    }
    form.rent_receipt_slack = response.data.data.slack;
    form.voucher_number = response.data.data.voucher_number;
    form.voucher_date = response.data.data.voucher_date;
    form.balance_amount = response.data.data.balance_amount;
    form.withdrawal_amount = response.data.data.withdrawal_amount;
    form.closing_voucher_user_id = response.data.data.closing_voucher_user_id;
    form.payment_mode = response.data.data.payment_mode;
    form.note = response.data.data.note;
  }
  is_loaded.value = true;
}

async function saveRentReceipt() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("voucher_number", form.voucher_number);
  form_data.append("voucher_date", form.voucher_date);
  form_data.append("balance_amount", form.balance_amount);
  form_data.append("withdrawal_amount", form.withdrawal_amount);
  form_data.append("closing_voucher_user_id", form.closing_voucher_user_id);
  form_data.append("payment_mode", form.payment_mode);
  form_data.append("note", form.note);
  form_data.append("slack", form.rent_receipt_slack);
  form_data.append("type", 2);
  var submit_url =
      form.rent_receipt_slack != "" && form.rent_receipt_slack != undefined
          ? "/api/voucher/update"
          : "/api/voucher/save";

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

          router.push("/rent_receipts");
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
