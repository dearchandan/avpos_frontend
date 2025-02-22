<template>
    <div class="modal hide" id="addTableModal"  tabindex="-1" aria-labelledby="Add Table" aria-modal="true" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false">
             <div class="modal-dialog modal-md modal-dialog-centered">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title" v-if="form.table_slack != undefined && form.table_slack != ''">{{ $t('Update Table') }}</h5>
                         <h5 class="modal-title" v-else>{{ $t('Add Table') }}</h5>
                         <button type="button" class="btn-close" @click="closeModal" aria-label="Close"  id="close_btn"></button>
                        </div>
                        <div class="modal-body">
                        
                         <Form
                            :validation-schema="schema"
                            @submit="save"
                            enctype="multipart/form-data"
                            :initial-values="form"
                            id="add_table_form"
                            v-slot="{ setFieldValue,values }"
                            >
        
                            <div class="row">
                                <div class="col-md-12">
                                <div class="white-card">
                                            
                                            <div class="row">
                                                
                                                <div class="col-12">
                                 
                                                    <VSelectInput
                                                        :label="select_dine_in_area_placeholder" 
                                                        required
                                                        :options="dinein_areas"
                                                        name="dinein_area_slack" 
                                                        :placeholder="select_dine_in_area_placeholder"
                                                        v-model="form.dinein_area_slack"
                                                    />
                                                   
                                                </div>
                                                
                                                <div class="col-12">
                                                    <VTextInput
                                                        type="text" 
                                                        name="name"
                                                        :label="table_name_placeholder" 
                                                        :required="true"
                                                        v-model="form.name"
                                                    />
                                                </div>
                                                
                                                <div class="col-12">
                                                    <VTextInput
                                                        type="number" 
                                                        name="table_capacity"
                                                        :label="capacity" 
                                                        :required="true"
                                                        v-model="form.table_capacity"
                                                    />
                                                </div>

                                                <!-- <div class="col-12">
                                                    <VRadio 
                                                        name="type"
                                                        v-model="form.type"
                                                        label="Table Shape" 
                                                        :required="true"
                                                        :options="types"
                                                    />
                                                </div> -->


                                            </div>

                                        </div>
                                </div>
                            </div>

                            <AsyncServerMessage class="py-3" v-if="server_messages.messages != ''" :server_messages="server_messages"  />

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
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import useGlobal from '@/composables/global.js';
import { onBeforeMount, onMounted, onUpdated, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const { types } = useGlobal(); 

const multiselect = defineComponent(
    Multiselect
)
const props = defineProps(['show_add_table_modal','edit_table_data','dinein_areas']); 
const server_messages = reactive({
    type: "",
    messages: "",
    
});
    

    /*  form data */   
const form = ref({
    is_submitting: false,

    dinein_area_slack: "",
    name: "",
    table_capacity: "",
    type: "",
    table_slack: "",
});

const select_dine_in_area_placeholder = t('Select Dinein Area')
const table_name_placeholder = t('Table Name')
const capacity = t('Capacity')
// const form = reactive({ ...initialState });

const schema = yup.object({
    dinein_area_slack: yup.string().required(t('name is required', { name: t('Dinein Area') })),
    name: yup.string().required(t('name is required', { name: t('Table Name') })).min(3,t('name must be at least n characters', { name: t('Table Name'), number: 3 })),
    table_capacity: yup.number().typeError(t('must be a number',{ name: t('Capacity') })).required(t('name is required', { name: t('Capacity') })).min(0,t("must be greater than or equal to 0",{ name: t('Capacity') })),
    // type: yup.number().required().label('table shape'),
});

const emit = defineEmits(['closeAddTableModal','getDineinAreas','closeModal'])
const dinein_areas = ref([]);

const edit_table_data = toRef(props,'edit_table_data');
watchEffect(() => {
    if(edit_table_data.value != undefined){
        form.value.name = edit_table_data.value.name;
        form.value.table_capacity = edit_table_data.value.table_capacity;
        form.value.table_slack = edit_table_data.value.slack;
        form.value.dinein_area_slack = edit_table_data.value.dinein_area_id && edit_table_data.value.dinein_area?edit_table_data.value.dinein_area.slack:"";
    }
}
)

onMounted(() => {
     //getDineinAreas();
})
watchEffect(() => {
     if(props.dinein_areas != undefined){
        dinein_areas.value = props.dinein_areas;
    }
});



async function save(values){

    form.value.is_submitting = true;

    var form_data = new FormData();
    form_data.append('dinein_area_slack',values.dinein_area_slack);
    form_data.append('name',values.name);
    form_data.append('table_capacity',values.table_capacity);
    form_data.append('table_slack',form.value.table_slack);
    var submit_url = (form.value.table_slack != '' && form.value.table_slack != undefined)?'/api/table/update':'/api/table/save';

    await axios.post(submit_url, form_data).then( (response) => {
        
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.value.is_submitting = false;
            form.value.name = "";
            form.value.table_capacity = "";
            form.value.dinein_area_slack = "";
            form.value.table_slack = "";
            document.getElementById("add_table_form").reset();
            closeAddTableModal();
            
        }else{
            try{
                server_messages.type = "error";
                server_messages.messages = JSON.parse(response.data.msg);
            }catch(err){
                server_messages.type = "error";
                server_messages.messages = response.data.msg;
            }
            form.value.is_submitting = false;
        }
        
    }).catch((error) => {
        server_messages.type = "error";
        server_messages.messages = error;
        form.value.is_submitting = false;
        console.log(error);
    });

}

function closeAddTableModal(){
    emit('closeAddTableModal');
    document.getElementById("add_table_form").reset();
    resetData();
    $('#addTableModal').modal('hide');
}

function resetData(){
    edit_table_data.value = [];
    Object.assign(form, form);
}
function closeModal(){
    Object.assign(form, form);
    document.getElementById("add_table_form").reset();
    emit('closeModal');
    $('#addTableModal').modal('hide');
}
const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

</script>