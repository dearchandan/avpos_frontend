<template>
    <div :class="type!='hidden'?'form-field':'m-0'">

        <!-- <Field :name="name" />
        <ErrorMessage :name="name" /> -->

        <Field :name="name" label="label" v-slot="{ field, meta, errors }" v-model="value" >
            <label class="label" v-show="islabel">{{ label }} <span v-if="required" class="text-danger">*</span>
                <VTooltip v-if="tooltip != ''" :message="tooltip" /> 
            </label>
                <div class="input-group mb-0">
                    <div v-if="input_group_position == 'before' && input_group_text" class="input-group-append">
                        <span class="input-group-text h-100 form-control-solid">{{ input_group_text }}</span>
                    </div>
                    <input 
                    class="form-control form-control-solid"
                    :type="type"
                    v-bind="field"
                    :placeholder="placeholder"
                    :class="{
                        'border-danger' : !meta.valid && meta.touched,
                        'form-control-lg' : size == 'large',
                    }"
                    :max="max"
                    :min="min"
                    :step="step"
                    :readonly="readonly"
                    :disabled="disabled"
                    :title="title"
                    autocomplete
                    />
                    <div v-if="input_group_position == 'after' && input_group_text" class="input-group-append" >
                        <span class="input-group-text h-100 form-control-solid">{{ input_group_text }}</span>
                    </div>
                </div>
        </Field>
        <ErrorMessage :name="name" as="div" class="error mt-1"></ErrorMessage>


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
        title: {
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
        modelValue: [String,Number,Boolean],
        input_group_text: {
            type : String,
            default: ""
        },
        input_group_position: {
            type : String,
            default: "after"
        },
        max: {
            type : [String,Number],
            default: ""
        },
        min: {
            type : [String,Number],
            default: "0"
        },
        step: {
            type : String,
            default: ""
        },
        tooltip: {
            type : String,
            default: ""
        },
        islabel: {
          type: Boolean,
          default: true,
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
    const {modelValue} = toRefs(props);
    
    const value = computed({
        get(){
            return modelValue.value;
        },
        set(value){
            if(props.type == 'number' && value < 0){
                value = 0;
            }
            emit('update:modelValue', value);
        }
    });


</script>