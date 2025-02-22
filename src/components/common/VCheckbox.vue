<template>
    <input
        @input="(event) => $emit('update:checked', event.target.checked)"
        type="checkbox"
        :checked="checked"
        :id="fieldId"
        class="mr-2 hidden"
    />
    <label
        :for="fieldId"
        class="" 
    >
        <i
        class="fa mr-2"
        :class="{
            'fa-check-square text-blue-600': checked,
            'fa-square text-gray-500': !checked,
        }"
        ></i>
        {{ $t(label) }}
    </label>
</template>
  
<script setup>

const props = defineProps({
    label: String,
    fieldId: {
        type: String,
        required: true,
    },
    checked: {
    type: Boolean,
}});

</script>