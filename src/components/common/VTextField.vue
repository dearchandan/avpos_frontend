<template>
    <div class="form-field mb-0 field-end-label">

        <!-- <Field :name="name" />
        <ErrorMessage :name="name" /> -->

        <Field :name="name" label="label" v-slot="{ field, meta, errors }" v-model="props.modelValue" >
            <!-- <label class="label" v-show="islabel">{{ label }} <span v-if="required" class="text-danger">*</span>
                <VTooltip v-if="tooltip != ''" :message="tooltip" /> 
            </label> -->
                    <input 
                        class="form-control form-control-solid"
                        :type="type"
                        v-bind="field"
                        v-on:input="updateValue($event.target.value)"
                        :placeholder="placeholder"
                        :class="[
                            { 'border-danger' : !meta.valid && meta.touched },
                            { 'form-control-lg' : size == 'large' },
                            { 'form-control-sm' : size == 'small' },
                        ]"
                        :max="max"
                        :min="min"
                        :readonly="readnoly"
                        :disabled="disabled"
                    />

                    <small v-if="input_group_position == 'after' && input_group_text">{{ input_group_text }}</small>
        </Field>
        <ErrorMessage :name="name" as="div" class="error"></ErrorMessage>


    </div>
</template>

<script setup>

    import { Field, ErrorMessage } from 'vee-validate';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const props = defineProps({
        type: {
            type: String,
            default: 'text',
        },
        name: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: false,
            default: '',
        },
        placeholder: {
            type: String,
            default: "",
        },
        size: {
            type: String,
            default: "",
        },
        required: {
            type: Boolean,
            default: false
        },
        modelValue: [String,Number],
        input_group_text: {
            type : String,
            default: ""
        },
        input_group_position: {
            type : String,
            default: "after"
        },
        max: {
            type : String,
            default: ""
        },
        min: {
            type : String,
            default: ""
        },
        tooltip: {
            type : String,
            default: ""
        },
        islabel: {
          type: Boolean,
          default: false,
        },
        readonly: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
    });
    //const placeholder = t(props.placeholder);
    const emit = defineEmits(['update:modelValue'])

    function updateValue(value) {
        if(props.type == 'number' && value < 0){
            value = 0; 
        }
        emit('update:modelValue', value)
    }


</script>