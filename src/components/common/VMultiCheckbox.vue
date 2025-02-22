<template>
  <div
    class=""
  >
    <VCheckbox
      v-for="option in options"
      :checked="value.includes(option.id)"
      @update:checked="check(option.id, $event)"
      :fieldId="option.name"
      :label="option.name"
      :key="option"
    />
  </div>
</template>

<script setup>

import VCheckbox from "@/components/common/VCheckbox.vue";

const emits = defineEmits(['update:value']);

const props = defineProps({
    value: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
      validator: (value) => {
        const hasNameKey = value.every((option) =>
          Object.keys(option).includes("name")
        );
        const hasIdKey = value.every((option) =>
          Object.keys(option).includes("id")
        );
        return hasNameKey && hasIdKey;
      },
    }
})

const check = (optionId, checked) => {
    let updatedValue = [...props.value];
    if (checked) {
        updatedValue.push(optionId);
    } else {
        updatedValue.splice(updatedValue.indexOf(optionId), 1);
    }
    emits("update:value", updatedValue);
    };


</script>
