<template>
    <div class="form-field">
        <Field :name="name" label="label" v-slot="{ field, meta, errors }" v-model="props.modelValue" >
            
            <label class="label">{{ label }} <span v-if="required" class="text-danger">*</span> </label>
                <div class="input-group mb-3">
                    <div v-if="input_group_position == 'before' && input_group_text" class="input-group-append">
                        <span class="input-group-text h-100 form-control-solid" id="basic-addon2">{{ input_group_text }}</span>
                    </div>
                    <div class="input-group">
                    <input 
                    class="form-control form-control-solid fs-5"
                    :type="type" 
                    v-bind="field"
                    v-on:input="updateValue($event.target.value)"
                    :placeholder="placeholder"
                    :readonly="readonly"
                    :class="{
                        'border-danger' : !meta.valid && meta.touched,
                        'form-control-lg' : size == 'large',
                    }"
                    />
                     <span class="btn btn-icon btn-light" v-if="is_show_password" @click="showPasswordText">
                        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                            <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                        </svg>
                    </span>
                      <button class="btn btn-light-primary min-width-0 px-3" type="button" @click="generateCode">{{ $t('Generate') }}</button>
                    </div>
                    <div v-if="input_group_position == 'after' && input_group_text" class="input-group-append" >
                        <span class="input-group-text h-100 form-control-solid" id="basic-addon2">{{ input_group_text }}</span>
                    </div>
                </div>
        </Field>
        <ErrorMessage :name="name" as="div" class="error"></ErrorMessage>
        

    </div>
</template>

<script setup>

    import { Field, ErrorMessage } from 'vee-validate';

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
        is_show_password: {
            type: Boolean,
            default: false
        },
        showPassword: {
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
        readonly: {
          type: Boolean,
          default: false
        },
    });

    const emit = defineEmits(['update:modelValue','generate_code','show_password_text'])

    function updateValue(value) {
        emit('update:modelValue', value)
    }

    function generateCode() {
        emit('generate_code')
    }

    function showPasswordText() {
        emit('show_password_text')
    }


</script>