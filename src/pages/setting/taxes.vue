<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/settings"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Settings") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Taxes") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="row">
        <div class="col-12">
          <h5 class="section-title pb-3 text-muted">{{ $t("Taxes") }}</h5>
          <ListingSkeleton v-if="form.is_listing" />
          <div v-else class="table-responsive">
            <table class="table table-list-data table-hover">
              <thead class="bg-light">
                <tr>
                  <th scope="col">{{ $t("Name") }}</th>
                  <th scope="col">{{ $t("Percentages") }}</th>
                  <th
                    scope="col"
                    width="10%"
                    v-if="authStore.isMerchant || authStore.isUser"
                  >
                    {{ $t("Default Tax/Force Reset") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="taxes != ''"
                  v-for="(tax, tax_index) in taxes"
                  :key="tax_index"
                >
                  <td
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#viewTaxModal"
                    @click="openViewTaxModal(tax)"
                  >
                    <div>
                      <span class="fw-bold highlighted-list-item">{{
                        tax.name
                      }}</span>
                    </div>
                  </td>
                  <td
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#viewTaxModal"
                    @click="openViewTaxModal(tax)"
                  >
                    {{ tax.total_percentage }}%
                  </td>
                  <td v-if="authStore.isMerchant || authStore.isUser">
                    <div class="form-field ps-5">
                      <div class="form-check form-switch form-switch-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="Status_id"
                          @change="setDefault(tax.slack)"
                          :checked="
                            authStore.user.tax != '' &&
                            authStore.user.tax != null &&
                            tax.slack == authStore.user.tax.slack
                              ? true
                              : false
                          "
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-else>
                  <td class="text-center py-3" colspan="7">
                    {{ $t("No Data Found") }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>

    <AsyncViewTax
      :show_view_tax_modal="show_view_tax_modal"
      :tax="shown_tax"
      @closeViewTaxModal="closeViewTaxModal"
    />
  </DefaultLayout>
</template>

<script setup>
import { Form, Field } from "vee-validate";
import {
  ref,
  onMounted,
  onUnmounted,
  reactive,
  watch,
  computed,
  defineAsyncComponent,
} from "vue";

import { useAuthStore } from "@/stores/auth";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import SettingMenu from "@/components/common/SettingMenu.vue";
import { useI18n } from "vue-i18n";
import * as yup from "yup";

const { t } = useI18n();
const AsyncViewTax = defineAsyncComponent(() =>
  import("@/components/tax/ViewTax.vue")
);
const AsyncServerMessage = defineAsyncComponent(() =>
  import("@/components/common/ServerMessage.vue")
);
const authStore = useAuthStore();

const labels = ref({
  frm_tax_type: t("Tax Type"),
  frm_tax_amount: t("Tax Amount"),
  tax_type: t("Select Type"),
  fee_type: t("Product Fee Type"),
  fee_name: t("Product Fee Name"),
  fee_value: t("Product Fee Value"),
});

const fee_types = ref([
  {
    id: 1,
    name: "Percentage",
  },
  {
    id: 2,
    name: "Fix Amount",
  },
]);

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,
  is_submitting: false,

  // form data
  search_query: ref(""),
};

const form = reactive({ ...initialState });

const schema = yup.object({
  tax_type: yup.string(),
  // fee_value: yup.number().nullable().when("tax_type", {
  //   is: "2",
  //   then: (schema) => schema.required(),
  //   otherwise: (schema) => schema.nullable(),
  // }),
});

onMounted(() => {
  getTaxes();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getTaxes();
  }, 500)
);

const taxes = ref([]);
const pagination = ref([]);

async function getTaxes(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/v2/taxes", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
      },
    })
    .then((response) => {
      form.is_listing = false;
      taxes.value = response.data.data;
      pagination.value = response.data.pagination;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
}
const paginate_limit = ref();
async function paginate_limit_update(value) {
  paginate_limit.value = value;
  await getTaxes();
}

async function setDefault(slack) {
  
  await Swal.fire({
    title: t("Are you sure about this because this action will reset the taxes for all the products!"),
    showCancelButton: true,
    confirmButtonText: t("Yes"),
    confirmButtonColor: "#d33",
    cancelButtonText: t("Cancel"),
  }).then((result) => {
    if (result.isConfirmed) {
      
      var form_data = new FormData();
      form_data.append("slack", slack);

      axios
        .post("/api/tax/set_default", form_data)
        .then((response) => {
          if (response.data.status_code == 200) {
            authStore.setUserTax(response.data.data);
            authStore.setUserTaxId(response.data.data.id);

            toast.success(response.data.msg);
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
    }else{
      router.go();
    }
  });
  
}

const show_view_tax_modal = ref(false);

const shown_tax = ref([]);

function openViewTaxModal(tax) {
  show_view_tax_modal.value = true;
  shown_tax.value = tax;
}

function closeViewTaxModal() {
  show_view_tax_modal.value = false;
}

</script>
