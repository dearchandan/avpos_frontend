<template>
    <div class="form-field">
        <Field :name="name" :label="label" v-slot="{ field, meta, errors }" >
            
            <label class="label d-flex align-items-center" v-if="label != '' && label != undefined"> {{label}} <span v-if="required" class="text-danger">*</span> 
                <a href="javascript:;" v-show="addModalShow" data-bs-toggle="modal" :data-bs-target="addModalId" class="label_add_btn"> + Add</a>
            </label>

            <multiselect 
                v-bind="field"
                :name="name"
                :options="options" 
                :label="text" 
                :valueProp="value" 
                :mode="mode" 
                :class="[
                    no_class ? 'form-control' : 'form-control form-control-solid',
                    !meta.valid && meta.touched ? 'border-danger' : '',
                    height_sm ? 'form-control-sm' : '',
                ]"
                v-on:change="updateValue($event)"
                multiple="false"
                v-model="val"
                :placeholder="placeholder"
                :searchable="true"
            />

        </Field>
        <ErrorMessage  :name="name" as="div" class="error"></ErrorMessage>   
    </div>
</template>

<script setup>

    import { Field, ErrorMessage } from 'vee-validate';
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n();

    const multiselect = defineComponent(
        Multiselect
    )
    const props = defineProps({
        options: {
            type: [Array,Object],
            required: true,
        },
        label: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: false,
        },
        value: {
            type: [String,Number],
            required: false,
        },
        mode: {
            type: String,
            default: "tags",
        },
        required: {
            type: Boolean,
            default: false,
        },
       selected :{
            type: [String,Number,Array],
            required: false,
        },
       placeholder :{
            type: String,
            required: false,
        },
       no_class :{
            type: Boolean,
            required: false,
        },
       height_sm :{
            type: Boolean,
            required: false,
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
    });
    const val = ref();
    watchEffect(() => {
        if(props.selected != undefined)
        val.value = props.selected;
    },props);
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