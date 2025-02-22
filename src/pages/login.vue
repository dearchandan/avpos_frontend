<template>
    <SimpleLayout>
        <SignIn />
    </SimpleLayout>
</template>

<script setup>

import { ref } from 'vue';
import SimpleLayout from '@/layouts/SimpleLayout.vue'
import SignIn from '@/components/SignIn.vue'

var language = localStorage.getItem('language');
localStorage.clear();
localStorage.setItem('language',language);

</script>