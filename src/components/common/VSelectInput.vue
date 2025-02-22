<template>

    <div class="form-field">

        <label class="label d-flex align-items-center" v-show="label != ''">
            
            {{ label }} 
        
            <span v-show="required" class="text-danger">*</span> 
        
            <VTooltip v-show="tooltip != ''" :message="tooltip" />
            <a href="javascript:;" v-show="addModalShow" data-bs-toggle="modal" :data-bs-target="addModalId" class="label_add_btn"> + Add</a>
        </label>

        <Field 
            :name="name" 
            :label="label" 
            v-slot="{ field, meta, errors }" 
            v-model="value"
            >
             <select v-bind="field"
                class="form-control form-control-solid" 
                :class="{
                    '' : size == 'normal',
                    'form-control-sm' : size == '',
                }"
               :disabled="disabled"
            >
                <option v-if="placeholder != ''" value=""> {{ placeholder }}</option>
        
                <option :value="option.id" :selected="selected == option.id" v-for="(option,index) in options" :key="index">{{ option.name }}</option>
             </select>
        </Field>
        
        <ErrorMessage :name="name" as="div" class="error"></ErrorMessage>   

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
            required: true,
        },
        placeholder: {
            type: String,
            default: "",
        },
        required: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: [String,Number],
            default: "",
        },
        tooltip: {
            type: String,
            default: "",
        },
       size: {
            type: String,
            default: "",
        },
        addModalShow :{
            type: Boolean,
            required: false,
        },
        addMethod :{
            type: String,
            required: false,
        },
        addModalId :{
            type: String,
            required: false,
        },
        disabled :{
            type: Boolean,
            required: false,
        },
        modelValue:{ type: [String,Number],default: "" },
    });
const emit = defineEmits(['update:modelValue'])
const {modelValue} = toRefs(props);
   
const value = computed({
  get(){
    return modelValue.value;
  },
  set(value){
    emit('update:modelValue', value);
  }
});
    // const emit = defineEmits(['update:modelValue'])

    // function updateValue(value) {
    //     //emit('update:modelValue', value)
    //     props.selected = value;
    // }

</script>