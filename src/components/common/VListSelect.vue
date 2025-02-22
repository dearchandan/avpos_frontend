<template>
  <div class="form-field mb-0">
    <Field :name="name" v-slot="{ field, meta, errors }" >
      <select
          class="form-control form-control-solid"
          v-bind="field"
          :name="name"
          v-on:change="updateValue($event.target.value)"
          :placeholder="placeholder"
          :class="{
                'border-danger' : !meta.valid && meta.touched,
                'form-control-lg' : size == 'large',
             }"
          :id="id"
          :value="modelValue"
      >
        <option value=""> {{ placeholder }}</option>
        <option :value="option.key" v-for="(option,index) in options" :selected="modelValue == option.key" :key="index">{{ option.value }}</option>
      </select>
    </Field>
    <ErrorMessage  :name="name" as="div" class="error"></ErrorMessage>
  </div>
</template>

<script setup>

import { Field, ErrorMessage } from 'vee-validate';
const props = defineProps({
  options: {
    type: [Array,Object],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  id: {
    type: String,
  },
  size: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Number,
    default: -1,
  }

});

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}

</script>