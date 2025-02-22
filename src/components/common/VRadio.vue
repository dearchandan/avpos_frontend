<template>
    <div class="form-field">
        <label for="" class="pb-1 pb-md-3" v-if="label != ''">{{ label }} <em v-if="required">*</em> <VTooltip v-if="tooltip != ''" :message="tooltip" />  </label> <br v-if="label != ''" />   
        <label v-for="(option,index) in options" class="label me-3">
            <input class="form-check-input me-1" :name="name" type="radio" :id="index" :value="option.value" v-on:change="updateValue($event.target.value)" :checked="props.modelValue == option.value" :disabled="disabled"/>
            {{ option.name }}
        </label>
        <!-- <ErrorMessage :name="name" as="div" class="error"></ErrorMessage> -->
    </div>
</template>

<script setup>

    import { Field, ErrorMessage } from 'vee-validate';

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        label: {    
            type: String,
            required: true,
        },
        required: {
            type: Boolean,
            default: false
        },
        options: {
            type: Array
        },
        modelValue: [String,Number,Boolean],
        tooltip: {
            type : String,
            default: ""
        },
        disabled: {
          type: Boolean,
          default: false
        },
    });

    const emit = defineEmits(['update:modelValue'])

    function updateValue(value) {
        emit('update:modelValue', value)
    }


</script>