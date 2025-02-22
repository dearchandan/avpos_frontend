<template>
  <div class="row" v-if="general_stats">
    <div class="col-6 col-md-4 col-lg-4">
      <div class="darshboard-counter card">
        <h6>{{ $t("Transactions") }}</h6>
        <h3 class="text-primary">{{ general_stats.transaction_count }}</h3>
        <div class="icon">
          <Icon icon="mdi:source-branch" class="big-icon" />
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-lg-4">
      <div class="darshboard-counter card">
        <h6>{{ $t("Sales") }}</h6>
        <h3 class="text-primary">{{ general_stats.order_count }}</h3>
        <div class="icon">
          <Icon icon="mdi:source-branch" class="big-icon" />
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-lg-4">
      <div class="darshboard-counter card">
        <h6>{{ $t("Invoices") }}</h6>
        <h3 class="text-primary">{{ general_stats.invoice_count }}</h3>
        <div class="icon">
          <Icon icon="mdi:source-branch" class="big-icon" />
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-lg-4">
      <div class="darshboard-counter card">
        <h6>{{ $t("Total Users") }}</h6>
        <h3 class="text-primary">{{ general_stats.user_count }}</h3>
        <div class="icon">
          <Icon icon="mdi:source-branch" class="big-icon" />
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-lg-4">
      <div class="darshboard-counter card">
        <h6>{{ $t("Total Branches") }}</h6>
        <h3 class="text-primary">{{ general_stats.branch_count }}</h3>
        <div class="icon">
          <Icon icon="mdi:source-branch" class="big-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['general_stats']);
const general_stats = toRef(props,'general_stats');

</script>
