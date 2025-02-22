<template>
    <div class="form-field">
        <Field :name="name" :label="label" v-slot="{ field, meta, errors }" v-model="props.modelValue">
            <label class="label" v-show="islabel">{{ label }} <span v-if="required" class="text-danger">*</span> </label>
            <select 
             v-bind="field"
             :name="name" 
             @input="updateValue($event.target.value)"
             :placeholder="placeholder" 
            
             :class="[
                    no_class ? 'form-select' : 'form-select form-select-solid',
                    !meta.valid && meta.touched ? 'border-danger' : '',
                    height_sm ? 'form-select-sm' : '',
                    size == 'large' ? 'form-select-lg' : '',
                ]"
             :value="modelValue"
             :disabled="disabled"
            >   
                <option value=""> {{ placeholder }}</option>
                <option :value="option.key" :selected="modelValue == option.value" v-for="(option,index) in options" :key="index">{{ option.value }}</option>
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
        label: {
            type: String,
            required: false,
        },
        placeholder: {
            type: String,
            default: "",
        },
        required: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "",
        },
        modelValue: {
            type: [String,Number],
            default: "",
        },
        islabel: {
          type: Boolean,
          default: true,
        },
        disabled: {
            type: Boolean,
            default: false
        },
         no_class :{
            type: Boolean,
            required: false,
        },
        height_sm :{
            type: [Boolean,String],
            required: false,
        },
    });

    const emit = defineEmits(['update:modelValue'])

    function updateValue(value) {
        emit('update:modelValue', value)
    }

</script>
<style scoped>
.height-lg{
    height: 48px;
    font-size: 15px;
    border-radius:10px;
    box-shadow:none !important;
}
</style>