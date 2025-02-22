<template>
    <div class="bg-white p-5 border-1 ">
        <h1>A simple modal</h1>
        <p>{{  title  }}</p>
    </div>
</template>
<script setup>
    
    import { defineProps } from 'vue';

    defineProps(['title']);

    // const title = modal_data.title;

</script>