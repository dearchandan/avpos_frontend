<template>

        <span v-if="stage == 'Running'" class="badge badge-success fw-bold">{{ stage }}</span>
        <span v-if="stage == 'Expired'" class="badge badge-light">{{ stage }}</span>
        <span v-if="stage == 'Awaiting'" class="badge badge-warning">{{ stage }}</span>

</template>

<script setup>

    const { stage } = defineProps(['stage']); 

</script>