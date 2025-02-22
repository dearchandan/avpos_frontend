<template>
<div class="modal hide" id="addAreaModal"  tabindex="-1" aria-labelledby="Add Table" aria-modal="true" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false">
             <div class="modal-dialog modal-md modal-dialog-centered">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title" v-if="form.area_slack != '' && form.area_slack != undefined">{{ $t('Update Area') }}</h5>
                         <h5 class="modal-title" v-else>{{ $t('Add Area') }}</h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                        </div>
                        <div class="modal-body">
                            <Form
                                :validation-schema="schema"
                                @submit="save"
                                enctype="multipart/form-data"
                                :initial-values="form"
                                id="add_area_form"
                                >
                                
                                    <div class="row">
                                        <div class="col-md-12">
                                        <div class="white-card">
                                                    
                                                    <div class="row">
                                                                                        
                                                        <div class="col-12">
                                                            <VTextInput
                                                                type="text" 
                                                                name="name"
                                                                v-model="form.name"
                                                                :label="area_name_plcaeholder" 
                                                                :required="true"
                                                                class="mb-1"
                                                            />
                                                        </div>
                                                        
                                                        <div class="col-12">
                                                            {{ $t('Suggestions') }}: <br> <span class="badge badge-pill rounded badge-info me-1" v-for="(suggestion,index) in dinein_area_suggestions" :key="index">{{  suggestion }}</span>
                                                        </div>
                                                    
                                                        <div class="col-12 pt-3">
                                                            <div class="form-field">
                                                                <label for="" class="py-2">{{ $t('Status') }}</label>
                                                                <div class="form-check form-switch ">
                                                                    <input class="form-check-input me-2" type="checkbox" role="switch" id="status" v-model="form.status" >
                                                                    <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                                                                </div>
                                                            </div>
                                                        </div>


                                                    </div>

                                                </div>
                                        </div>
                                    </div>
                                    
                                    <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''" :server_messages="form.server_messages"  />

                                    <div class="mt-2 text-end">
                                        <button 
                                        type="submit"
                                        class="btn btn-primary" 
                                        :disabled="form.is_submitting"
                                        >
                                            <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                            <span class="pt-0" v-if="form.is_submitting">
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
     
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import useGlobal from '@/composables/global.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n(); 
const { dinein_area_suggestions } = useGlobal();

const initialState = {
    server_messages: {
        type: "",
        messages: "",
    },
    is_submitting: false,
    status: true,

    // form data   
    name: '',
    area_slack: '',
};
const area_name_plcaeholder = t('Area Name')
const form = reactive({ ...initialState });

const schema = yup.object({
    name: yup.string().required(t('name is required', { name: t('Area Name') })).min(3,t('name must be at least n characters', { name: t('Area Name'), number: 3 })),
});

const props = defineProps({
    show_add_area_modal: Boolean,
    edit_area_data: {
        type: [Array,Object],
    },
}); 
const edit_area_data = toRef(props,'edit_area_data');

watchEffect(() => {
    if(!_.isUndefined(edit_area_data.value)){
        form.name = edit_area_data.value.name;
        form.status = edit_area_data.value.status == 1 ? true:false;
        form.area_slack = edit_area_data.value.slack;
    }
}
)

async function save(){

    form.is_submitting = true;

    var form_data = new FormData();
    form_data.append('name',form.name);
    form_data.append('status',form.status);
    form_data.append('area_slack',form.area_slack);
    var submit_url = (form.area_slack != '' && form.area_slack != undefined)?'/api/dinein_area/update':'/api/dinein_area/save';

    await axios.post(submit_url, form_data).then( (response) => {
        
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_submitting = false;
            document.getElementById('add_area_form').reset();
            closeAddAreaModal();
            
        }else{
            try{
                form.server_messages.type = "error";
                form.server_messages.messages = JSON.parse(response.data.msg);
            }catch(err){
                form.server_messages.type = "error";
                form.server_messages.messages = response.data.msg;
            }
            form.is_submitting = false;
        }
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        form.is_submitting = false;
        console.log(error);
    });

}



const emit = defineEmits(['closeModal','closeAddAreaModal'])

function closeAddAreaModal(){
    edit_area_data.value = [];
    Object.assign(form, initialState);  
    $('#addAreaModal').modal('hide');
    emit('closeAddAreaModal');
}
function closeModal()
{
    Object.assign(form, initialState);  
    $('#addAreaModal').modal('hide');
    emit('closeModal');
}
const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

</script>