<template>

    <Icon icon="fa6-solid:circle-info" v-tippy="message" class="ps-2 text-secondary" />

</template>

<script setup>

    defineProps({
        message: {
            type: String,
        }
    });
    
</script>