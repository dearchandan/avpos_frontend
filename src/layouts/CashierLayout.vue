<template>
  <div class="main cashier-layout" :class="{ 'spmarket-cashier': layout == 2 }">
    <slot />

    <slot name="modal" />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

const layout = computed(() => {
  return authStore.user.merchant.layout;
});

</script>
