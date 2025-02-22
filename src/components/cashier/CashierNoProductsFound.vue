<template>
  <div class="text-center pt-5 mt-5">
    <h4 class="pt-5 mt-5">
      <div class="p-3">{{ $t("No Products Found") }}</div>
    </h4>
    <p>
      <router-link to="/product/add">Click here to add...</router-link>
    </p>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useSettingStore } from "@/stores/settingStore";

const settingStore = useSettingStore();

const logo = computed(() => {
  return settingStore.logo;
});
</script>
