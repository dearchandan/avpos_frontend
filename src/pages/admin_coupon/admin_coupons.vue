<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <!-- <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                        </div>
                    </div> -->
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Coupons") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <div class="row align-items-center">
              <div class="col-auto" v-if="permissions.write">
                <router-link
                  class="btn btn-sm btn-light-primary"
                  to="/admin/coupon/add"
                  >+ {{ $t("New Coupon") }}</router-link
                >
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="form-field page-heading-search-field mb-0">
                  <div class="field-icon">
                    <input
                      type="search"
                      class="form-control form-control-sm form-control-shadow"
                      :placeholder="search_placeholder"
                      v-model="form.search_query"
                    />
                    <div class="icon">
                      <Icon icon="fa6-solid:magnifying-glass" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <ListingSkeleton v-if="form.is_listing" />
      <div v-else class="table-responsive">
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
            <tr>
              <th scope="col" width="40%">{{ $t("Coupon Name") }}</th>
              <th scope="col" width="12%">{{ $t("Discount") }}</th>
              <th scope="col" width="10%">{{ $t("Quantity") }}</th>
              <th scope="col" width="10%">{{ $t("Active Dates") }}</th>
              <th
              scope="col"
              class="text-center"
              width="10%"
              v-if="permissions.write && permissions.delete"
              >
              {{ $t("Status") }}
            </th>
            <th scope="col" width="10%">{{ $t("Action") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="admin_coupons != ''"
              v-for="(admin_coupon, branch_index) in admin_coupons"
              :key="branch_index"
            >
              <td>
                <span class="fw-bold highlighted-list-item">{{  admin_coupon.name  }}</span>
                <span v-if="admin_coupon.name_ar != '' && admin_coupon.name_ar != 'null'">
                    <br>
                    <small class="text-muted">{{ admin_coupon.name_ar }}</small>
                </span>
              </td>
              
              <td>
                {{ admin_coupon.value }} {{ admin_coupon.type_text }}
              </td>
              
              <td>
                {{ admin_coupon.quantity }}
              </td>
              
              <td>
                {{ admin_coupon.start_datetime_label }} - {{ admin_coupon.end_datetime_label }}
              </td>
              <td>
                <CouponStage :stage="admin_coupon.stage" /> 
              </td>
              <td class="text-end" v-if="permissions.write || permissions.delete">
                  <ActionButtonGroup :permissions="permissions" @edit="editCoupon" @delete="deleteCoupon" :slack="admin_coupon.slack" />
              </td>
            </tr>
            <tr v-else>
              <td class="text-center py-3" colspan="11">
                {{ $t("No Data Found") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="data-footer">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <PaginateLimit
              @paginate_limit_update="paginate_limit_update"
              :pagination="pagination"
            />
          </div>
          <div class="col-auto">
            <Bootstrap5Pagination
              :data="pagination"
              @pagination-change-page="getCoupons"
            />
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import {
  ref,
  onMounted,
  reactive,
  watch,
  defineComponent,
  computed,
} from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { Bootstrap5Pagination } from "laravel-vue-pagination";
import { useAuthStore } from "@/stores/auth";
import PaginateLimit from "@/components/common/PaginateLimit.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query: ref(""),
};
const search_placeholder = t("Search by name, arabic name, price..");
const form = reactive({ ...initialState });

onMounted(() => {
  checkPermissions();
  getCoupons();
});

watch(
  () => form.search_query,
  _.debounce(() => {
    getCoupons();
  }, 500)
);

const admin_coupons = ref([]);
const pagination = ref([]);

async function getCoupons(page = 1) {
  form.is_listing = true;

  await axios
    .get("/api/admin/coupons", {
      params: {
        page: page,
        paginate_limit: paginate_limit.value,
        search_query: form.search_query,
      },
    })
    .then((response) => {
      admin_coupons.value = response.data.data;
      pagination.value = response.data.pagination;
      form.is_listing = false;
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
  await getCoupons();
}

function viewCoupon(ticket_id) {
  router.push("/admin_coupon/" + ticket_id);
}

function editCoupon(slack){
    router.push('/admin/coupon/edit/'+slack);
}

async function deleteCoupon(slack){

    var is_confirmed = false;

    await Swal.fire({
        title:t('Do you want to delete this item?'),
        showCancelButton: true,
        confirmButtonText: t('Yes, Delete'),
        confirmButtonColor: '#d33',
        cancelButtonText: t('Cancel'),
    }).then( (result) => {
        if(result.isConfirmed){
            is_confirmed = true;        
        }
    });

    if(is_confirmed){

        await axios.post('/api/admin/coupon/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getCoupons();

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

}

/* Checking permissions */
const permissions = ref({
  write: false,
  delete: false,
});

function checkPermissions() {
  permissions.value = {
    write: isAuthorized("A_WRITE_ADMIN_COUPON"),
    delete: isAuthorized("A_DELETE_ADMIN_COUPON"),
  };
}
</script>
