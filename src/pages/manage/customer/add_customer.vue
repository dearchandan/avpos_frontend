<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/customers"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Customers") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == '' || slack == undefined">
              {{ $t("Add Customer") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Customer") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <AddCustomer @closeAddCustomerModal="closeAddCustomerModal" :redirection="'/customers'"/>
    </div>

  </DefaultLayout>
</template>

<script setup>

import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;

</script>
