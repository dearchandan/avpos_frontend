<template>
  <!--View Account Modal -->
  <div class="modal hide modal-lg" id="viewAdminAccountModal"  tabindex="-1" aria-labelledby="View Account" aria-modal="true" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ account.name }} <br> <span class="text-muted" v-if="account.name_ar != null">{{ account.name_ar }}</span> </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="data-view-box mb-4">
                <!-- <div class="item">
                  <b>{{ $t("Account Code") }}</b>
                  {{ account.code }}
                </div> -->
                <div class="item">
                  <b>{{ $t("Account Type") }}</b>
                  <span v-if="account.account_type==1">{{ $t("INCOME") }}</span>
                  <span v-if="account.account_type==2">{{ $t("EXPENSE") }}</span>
                  <span v-if="account.account_type==3">{{ $t("ASSET") }}</span>
                  <span v-if="account.account_type==4">{{ $t("LIABILITY") }}</span>
                </div>
                <div class="item">
                  <b>{{ $t("Initial Balance") }}</b>
                  {{ account.initial_balance }}
                </div>
                <!-- <div class="item">
                  <b>{{ $t("Income/Expense") }}</b>
                  <span v-if="account.account_type == 1" class="text-success">{{ account.total_sale }} {{ currency_symbol }}</span>
                  <span v-if="account.account_type == 2" class="text-danger">{{ account.total_expense }} {{ currency_symbol }}</span>
                </div> -->
                <div class="item">
                  <b>{{ $t("Status") }}</b>
                  <span class="badge badge-success" v-if="account.status == 1">{{ $t("Active") }}</span>
                  <span class="badge badge-danger" v-else>{{ $t("Inactive") }}</span>
                </div>
                <div class="item">
                  <b>{{ $t("Is Default") }}</b>
                  <span class="badge badge-success" v-if="account.is_default == 1">{{ $t("Yes") }}</span>
                  <span class="badge badge-danger" v-else>{{ $t("No") }}</span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="data-view-box mb-4">
                <div class="item" v-if="account.created_by != null">
                  <b>{{ $t("Created By") }}</b>
                  {{ account.created_by.name }}
                </div>
                <div class="item" v-if="account.updated_by != null">
                  <b>{{ $t("Updated By") }}</b>
                  {{ account.updated_by.name }}
                </div>
                <div class="item">
                  <b>{{ $t("Created On") }}</b>
                  {{ account.created_at_label }}
                </div>
                <div class="item">
                  <b>{{ $t("Updated On") }}</b>
                  {{ account.updated_at_label }}
                </div>
              </div>
            </div>
          </div>
          <div class="data-view-box">
            <div class="">
              <b class="item">{{ $t("Description") }}</b>
              <p class="mt-2 fw-normal">
                {{ account.description  }}
                <span v-if="account.description_ar != null">
                    <br>{{ account.description_ar  }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end modal -->
</template>

<script setup>

import {ref} from 'vue';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const is_loading = ref(false);

const emit = defineEmits(['closeViewAccountModal'])

const props = defineProps(['show_view_account_modal','account']);

function closeModal(){
  emit('closeViewAccountModal');
}

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});

</script>