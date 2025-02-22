<template>
    <router-view></router-view>
</template>

<script setup>

  import { useSettingStore } from '@/stores/settingStore';
//   import { useNotificationStore } from '@/stores/notificationStore';
  import { useAuthStore } from '@/stores/auth';
  import {useRoute} from "vue-router";

  const settingStore = useSettingStore();
  const authStore = useAuthStore();
//   const notificationStore = useNotificationStore();
  const route = useRoute();

  onMounted( () => {
      settingStore.getSettings();
      /* Disabling notification until API optimized */
        //   if(authStore.user){
            //   notificationStore.index();
        //   }
    });
  
</script>

<style scoped>
    /* .fade-enter-active,
    .fade-leave-active {
    transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
    opacity: 0;
    } */
</style>