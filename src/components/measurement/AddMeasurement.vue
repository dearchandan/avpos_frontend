<template>
   <div class="modal modal-lg hide" id="addMeasurementModal"  tabindex="-1" aria-labelledby="Add Measurement" aria-modal="true" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false" >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" v-if="form.slack == '' || form.slack==undefined">{{ $t('Add Measurement') }}</h5>
                        <h5 class="modal-title" v-else>{{ $t('Update Measurement') }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                    </div>
                    <div class="modal-body">
                        <Form
                        :validation-schema="schema"
                        @submit="saveMeasurement"
                        enctype="multipart/form-data"
                        :initial-values="form"
                        id="frmMeasurement"
                        >
                          <div class="row">
                            <div class="col-6">
                              <VTextInput
                                  type="text"
                                  name="measurement_name"
                                  v-model="form.measurement_name"
                                  label="Measurement Name"
                                  :required="true"
                              />
                            </div>
                            <!-- <div class="col-6">
                              <VTextInput
                                  type="text"
                                  name="measurement_name_ar"
                                  v-model="form.measurement_name_ar"
                                  label="Measurement Name (Arabic)"
                              />
                            </div> -->
                            <div class="col-md-6 pt-4">
                              <div class="form-field">
                                <div class="form-check form-switch">
                                  <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status">
                                  <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                                </div>
                              </div>
                            </div>

                          </div>
                          <div class="row pt-3">
                            <table class="table table-bordered">
                              <thead>
                              <tr>
                                <th width="25%">{{ $t('Measurement Unit') }}</th>
                                <!-- <th width="25%">{{ $t('Measurement Unit')  }} ({{$t("Arabic")}})</th> -->
                                <th width="">{{ $t('Abbreviation') }}</th>
                                <!-- <th width="">{{ $t('Abbreviation') }} ({{$t("Arabic")}})</th> -->
                                <th></th>
                                <th></th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr v-for="(unit,index) in measurement_units" :key="index">
                                <td>
                                  
                                  <input
                                        type="text" 
                                        name="unit_name"
                                        v-model="unit.unit_name"
                                        placeholder="Ex. Kilogram"
                                         class="form-control form-control-solid"
                                    /> 
                                </td>
                                <!-- <td>
                                  
                                  <input
                                        type="text" 
                                        name="unit_name_ar"
                                        v-model="unit.unit_name_ar"
                                        placeholder="Ex. كيلوغرام"
                                         class="form-control form-control-solid"
                                    /> 
                                </td> -->
                                <td>
                                  <input
                                        type="text" 
                                        name="abbreviation"
                                        v-model="unit.abbreviation"
                                        placeholder="Ex. kg"
                                         class="form-control form-control-solid"
                                    />
                                </td>
                                <!-- <td>
                                  <input
                                        type="text" 
                                        name="abbreviation_ar"
                                        v-model="unit.abbreviation_ar"
                                        placeholder="Ex. kg"
                                         class="form-control form-control-solid"
                                    />
                                </td> -->
                                <td>
                                  <button class="btn btn-icon btn-light btn-sm" @click="removeOption(unit)" :disabled="measurement_units.length>1 ? false : true"><Icon icon="material-symbols:cancel-outline-rounded" class="text-danger" /></button>
                                </td>
                                <td>
                                  <a href="#" class="btn btn-icon btn-light btn-sm" @click="addOption" v-if="index == measurement_units.length - 1"><Icon icon="fa6-solid:plus" class="text-primary" /></a>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>

                        <div class="py-3" v-if="form.server_messages.messages != ''">
                            <ServerMessage  :server_messages="form.server_messages"  />
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
    
    import {ref, reactive, watch, computed } from 'vue';
    import { Form, Field, ErrorMessage } from 'vee-validate'
    import * as yup from 'yup';
    import VTextInput from '@/components/common/VTextInput.vue' 
    
    import { useAuthStore } from '@/stores/auth';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
      is_saving: false,
      is_listing: false,

      // form data
      slack: "",
      measurement_name: "",
      measurement_name_ar: "",
      status: true,
    };

    const measurement_units = ref([{
        id: "",
        unit_name : "",
        unit_name_ar : "",
        abbreviation : "",
        abbreviation_ar : "",
      }]);

    const form = reactive({ ...initialState });

    const authStore = useAuthStore();

    const schema = yup.object({
        measurement_name: yup.string().required(t('name is required', { name: t('Measurement Name') })).min(3,t('name must be at least n characters', { name: t('Measurement Name'), number: 3 })),
        status: yup.bool().label('status'),
    });
    
    

    const emit = defineEmits(['closeAddMeasurementModal'])

    const props = defineProps({
        show_add_measurement_modal: Boolean,
        edit_data: {
            type: [Array,Object],
        },
    });
    const edit_data = toRef(props,'edit_data')
    function closeModal(){
        document.getElementById('frmMeasurement').reset();
        resetData();
        document.getElementById('close_btn').click();
        emit('closeAddMeasurementModal');

    }
  watch(() => 
        props.edit_data,(value) => {
            if(value){
                form.slack = value.slack;
                form.measurement_name = value.name;
                form.measurement_name_ar = value.name_ar;
                form.status = value.status == 1?true:false;
                if(value.units)
                {
                  measurement_units.value = [];
                  for(var i=0;i<value.units.length;i++){
                   let unit = {
                      id : value.units[i].id,
                      unit_name : value.units[i].unit_name,
                      unit_name_ar : value.units[i].unit_name_ar,
                      abbreviation : value.units[i].abbreviation,
                      abbreviation_ar : value.units[i].abbreviation_ar,
                    };

                    measurement_units.value.push(unit);
                  }
                }
            }
        }
    );
    async function saveMeasurement(){
        form.is_saving = true;
        
        var form_data = new FormData();
        form_data.append('measurement_name',form.measurement_name);
        form_data.append('measurement_name_ar',JSON.stringify(form.measurement_name_ar));
        form_data.append('status',form.status);
        form_data.append('measurement_units',JSON.stringify(measurement_units.value));
        form_data.append('slack',form.slack);
        var submit_url = (form.slack!='' && form.slack!=undefined)?'/api/measurement/update':'/api/measurement/save';
        await axios.post(submit_url, form_data).then( (response) => {
        
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);
                form.server_messages.type = "";
                form.server_messages.messages = '';
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
        measurement_units.value = [{
        id: "",
        unit_name : "",
        unit_name_ar : "",
        abbreviation : "",
        abbreviation_ar : "",
      }];
    }

    function addOption(){

      let unit = {
        id: "",
        unit_name : "",
        unit_name_ar : "",
        abbreviation : "",
        abbreviation_ar : "",
      };

      measurement_units.value.push(unit);

    }

    function removeOption(unit){
      measurement_units.value.splice(measurement_units.value.indexOf(unit),1);
    }
    
</script>