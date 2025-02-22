<template>
    <div class="form-field">

        <!-- <Field :name="name" />
        <ErrorMessage :name="name" /> -->

        <Field :name="name" label="label" v-slot="{ field, meta, errors }" v-model="props.modelValue">
            <label class="label" v-show="islabel">{{ label }} <span v-if="required" class="text-danger">*</span>
                <VTooltip v-if="tooltip != ''" :message="tooltip" /> 
            </label>
                <div class="input-group mb-1">
                    <div v-if="input_group_position == 'before' && input_group_text" class="input-group-append">
                        <span class="input-group-text h-100 form-control-solid">{{ input_group_text }}</span>
                    </div>
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
                        :readonly="readonly"
                        :disabled="disabled"
                    />
                    <div v-if="input_group_position == 'after' && input_group_text" class="input-group-append" >
                        <span class="input-group-text h-100 form-control-solid">{{ input_group_text }}</span>
                    </div>
                </div>
        </Field>
        <ErrorMessage :name="name" as="div" class="error"></ErrorMessage>


    </div>
</template>

<script setup>

    import { Field, ErrorMessage ,useField} from 'vee-validate';
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
    // const { value, handleChange } = useField(() => props.name, undefined, {
    //     validateOnValueUpdate: false,
    //  });
    // //const placeholder = t(props.placeholder);
    //   const emit = defineEmits(['update:modelValue'])
    // const {modelValue} = toRefs(props);
    
    // const mdlval = computed({
    // get(){
    //     return modelValue.value;
    // },
    // set(mdlval){
    //     emit('update:modelValue', mdlval);
    // }
    // })   
    // const validationListeners = {
    // blur: evt => mdlval,
    // change: evt => mdlval,
    // input: evt => mdlval,
    // };    
    const emit = defineEmits(['update:modelValue'])

    function updateValue(value) {
        emit('update:modelValue', value)
    }

   
</script>