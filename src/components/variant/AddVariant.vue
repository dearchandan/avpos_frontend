<template>
    <div class="modal hide" id="addVariantModal"  tabindex="-1" aria-labelledby="Add Variant" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
             <div class="modal-dialog modal-dialog-centered modal-lg">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title" v-if="form.variant_id == '' || form.variant_id == undefined">{{ $t("Add Variant") }}</h5>
                         <h5 class="modal-title" v-else>{{ $t("Update Variant") }}</h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                     </div>
                     <div class="modal-body">
                         <Form
                         :validation-schema="schema"
                         @submit="saveVariant"
                         enctype="multipart/form-data"
                         :initial-values="form"
                         id="add_variant_form"
                         >
                         <div class="row">   
                            <div class="col-6">
                                <VTextInput
                                    type="text" 
                                    name="variant_name"
                                    v-model="form.variant_name"
                                    :label="variant_name_placeholder" 
                                    :required="true"
                                />
                            </div>
                            <div class="col-6">
                                <VTextInput
                                    type="text" 
                                    name="variant_name_ar"
                                    v-model="form.variant_name_ar"
                                    :label="variant_name_ar_placeholder" 
                                />
                            </div>
                            <input type="hidden" v-model="form.variant_id" />
                        </div>
                      
                         <div class="py-3" v-if="form.server_messages.messages != ''">
                             <ServerMessage :server_messages="form.server_messages"  />
                         </div>
                         <div class="mt-2 text-end">
                             <button 
                             type="submit"
                             class="btn btn-primary" 
                             :disabled="form.is_saving"
                             >
                                 <clip-loader v-if="form.is_saving" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                 <span class="pt-0" v-if="form.is_saving">
                                     {{ $t("Saving...") }}
                                 </span>
                                 <span class="pt-0" v-else>
                                     {{ $t("Save") }}
                                 </span> 
 
                             </button>
                         </div>
                         </Form>
                     </div>
                 </div>
             </div>
    </div>     
 </template>
 
 
 <script setup>
     
import {ref, reactive, watch, computed, onMounted, onUpdated, watchSyncEffect } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import VTextInput from '@/components/common/VTextInput.vue' 

import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const auth = useAuthStore();

const initialState = {
    server_messages: {
        type: "",
        messages: "",
    },
    is_saving: false,

    // form data   
    variant_id: "",
    variant_name: "",
    variant_name_ar: "",
};

const form = reactive({ ...initialState });

const schema = yup.object({
    variant_name: yup.string().required(t('name is required', { name: t('Variant Name') })).min(3,t('name must be at least n characters', { name: t('Variant Name'), number: 3 })),
});


const emit = defineEmits(['closeAddVariantModal'])

const props = defineProps({
    show_add_variant_modal: Boolean,
    edit_data: {
        type: [Array,Object,String],
    }
});
const variant_name_placeholder = t('Variant Name');
const variant_name_ar_placeholder = t('Variant Name (Arabic)');
watch(() => 
    props.edit_data,(value) => {
        if(value!=''){
            form.variant_name = value.name;
            form.variant_name_ar = value.name_ar != null?value.name_ar:"";
            form.variant_id = value.id;
        }
    }
);
function closeModal(){
    document.getElementById("add_variant_form").reset();
    resetData();
    document.getElementById('close_btn').click();
    emit('closeAddVariantModal');
}

async function saveVariant(){

    var form_data = new FormData();
    form_data.append('variant_name',form.variant_name);
    form_data.append('variant_name_ar',form.variant_name_ar);
    form_data.append('variant_id',form.variant_id);
    var submit_url = (form.variant_id != '')?'/api/variant/update':'/api/variant/save';

    await axios.post(submit_url, form_data).then( (response) => {
        
        form.is_saving = true;

        if(response.data.status_code == 200) {
            toast.success(response.data.msg);
            form.is_saving = false;
            resetData();
            closeModal();

        }else{
            try{
                form.server_messages.type = "error";
                form.server_messages.messages = JSON.parse(response.data.msg);
            }catch(err){
                form.server_messages.type = "error";
                form.server_messages.messages = response.data.msg;
            }
            form.is_saving = false;
        }
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        form.is_saving = false;
        console.log(error);
    });

}

function resetData(){
    Object.assign(form, initialState);
}


 </script>