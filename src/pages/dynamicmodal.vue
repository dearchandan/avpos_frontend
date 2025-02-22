<template>
    <!-- Simple dynamic modal, take reference from here -->
    <button @click="showModal">Show Modal</button>
    <container title="Simple Dynamic Modal" />
</template>

<script setup>

import VModal from '@/components/common/VModal.vue';
import { container, openModal, closeModal} from "jenesius-vue-modal";

const show_modal = ref(false);

function showModal(){
    show_modal.value = !show_modal.value; 
    const modal_data = { title: "Hello" };
    openModal(VModal, modal_data )
}

</script>