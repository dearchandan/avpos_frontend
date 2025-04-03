<template>
    <div class="modal hide" id="addModifierModal"  tabindex="-1" aria-labelledby="Add Modifier" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
             <div class="modal-dialog modal-dialog-centered modal-lg">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title" v-if="form.modifier_id == ''">{{ $t('Add Modifier') }}</h5>
                         <h5 class="modal-title" v-else>Update Modifier</h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                     </div>
                     <div class="modal-body">
                         <Form
                         :validation-schema="schema"
                         @submit="saveModifier"
                         enctype="multipart/form-data"
                         :initial-values="form"
                         id="add_modifier_form"
                         >
                         <div class="row">   
                            <div class="col-md-6">
                                <VTextInput
                                    type="text" 
                                    name="modifier_name"
                                    v-model="form.modifier_name"
                                    :label="labels.modifier_name" 
                                    :required="true"
                                />
                            </div>
                            <!-- <div class="col-md-6">
                                <VTextInput
                                    type="text" 
                                    name="modifier_name_ar"
                                    v-model="form.modifier_name_ar"
                                    :label="labels.modifier_name_ar" 
                                />
                            </div> -->
                            <div class="col pt-4">
                                <div class="form-field">
                                    <div class="form-check form-switch ">
                                        <input class="form-check-input me-2" type="checkbox" role="switch" id="status" v-model="form.allow_multiple_selections">
                                        <label class="form-check-label" for="status">{{ $t('Allow Multiple Selections') }}</label>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" v-model="form.modifier_id" />
                         
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
                                     {{ $t('Saving...') }}
                                 </span>
                                 <span class="pt-0" v-else>
                                     {{ $t('Save') }}
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
     
import {ref, reactive, watch, computed } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import VTextInput from '@/components/common/VTextInput.vue' 
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const labels = ref({
    modifier_name: t("Modifier Name"),
    modifier_name_ar: t("Modifier Name (Arabic)"),
});
const auth = useAuthStore();
const currency_symbol = computed(() => {
    return auth.user.currency.symbol;
})


const initialState = {
    server_messages: {
        type: "",
        messages: "",
    },
    is_saving: false,

    // form data   
    modifier_id: "",
    modifier_name: "",
    modifier_name_ar: "",
    allow_multiple_selections: false,
};

const form = reactive({ ...initialState });

const schema = yup.object({
    modifier_name: yup.string().required(t('name is required', { name: t('Modifier Name') })).min(3,t('name must be at least n characters', { name: t('Modifier Name'), number: 3 })).max(20,t("Must be less than 20 characters", {
          name: t("Modifier Name"),
          number: 20,
        })
    ),
    allow_multiple_selections: yup.bool().label('Status'),
});



const emit = defineEmits(['closeAddModifierModal'])

const props = defineProps({
    show_add_modifier_modal: Boolean,
    edit_data: {
        type: [Array,Object],
    }
});
const edit_data = toRef(props,'edit_data');

watch(() => 
    props.edit_data,(value) => {
        if(value){
            form.modifier_name = value.name;
            form.modifier_name_ar = value.name_ar != null?value.name_ar:"";
            form.allow_multiple_selections = value.allow_multiple_selections == 1?true:false;
            form.modifier_id = value.id;
        }
    }
);

function closeModal(){
    document.getElementById("add_modifier_form").reset();
    resetData();
    document.getElementById('close_btn').click();
    emit('closeAddModifierModal');
}

async function saveModifier(){

    var form_data = new FormData();
    form_data.append('modifier_id',form.modifier_id);
    form_data.append('modifier_name',form.modifier_name);
    form_data.append('modifier_name_ar',form.modifier_name_ar);
    form_data.append('allow_multiple_selections',form.allow_multiple_selections);

    var submit_url = (form.modifier_id != '')?'/api/modifier/update':'/api/modifier/save';


    await axios.post(submit_url, form_data).then( (response) => {
        
        form.is_saving = true;

        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_saving = false;
            
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