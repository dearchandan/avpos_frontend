<template>
   <div class="modal modal-lg hide" id="addActivityLogModal"  tabindex="-1" aria-labelledby="Add ActivityLog" aria-modal="true" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false" >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" v-if="form.slack == '' || form.slack==undefined">{{ $t('Add Activity Log') }}</h5>
                        <h5 class="modal-title" v-else>{{ $t('Update Activity Log') }}</h5>
                        <button type="button" class="btn-close" id="close_btn" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <Form
                        :validation-schema="schema"
                        @submit="saveActivityLog"
                        enctype="multipart/form-data"
                        :initial-values="form"
                        id="frmActivityLog"
                        >
                          <div class="row">
                        
                              <div class="col-12">
                                  <VTextArea
                                      :label="t('Description')"
                                      name="description"
                                      v-model="form.description"
                                      :required="true"
                                  />
                              </div>
                              
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
      description: "",
    };

    const activity_log_units = ref([{
        id: "",
        unit_name : "",
        unit_name_ar : "",
        abbreviation : "",
        abbreviation_ar : "",
      }]);

    const form = reactive({ ...initialState });

    const authStore = useAuthStore();

    const schema = yup.object({
        description: yup.string().required(t('name is required', { name: t('Activity Log Description') })).min(10,t('name must be at least n characters', { name: t('Activity Log Description'), number: 10 })),
    });
    
    

    const emit = defineEmits(['closeAddActivityLogModal'])

    const props = defineProps({
        show_add_activity_log_modal: Boolean,
        // edit_data: {
        //     type: [Array,Object],
        // },
    });
    // const edit_data = toRef(props,'edit_data')
    function closeModal(){
        document.getElementById('frmActivityLog').reset();
        resetData();
        emit('closeAddActivityLogModal');
        document.getElementById('close_btn').click();
    }
  // watch(() => 
  //       props.edit_data,(value) => {
  //           if(value){
  //               form.slack = value.slack;
  //               form.activity_log_name = value.name;
  //               form.activity_log_name_ar = value.name_ar;
  //               form.status = value.status == 1?true:false;
  //               if(value.units)
  //               {
  //                 activity_log_units.value = [];
  //                 for(var i=0;i<value.units.length;i++){
  //                  let unit = {
  //                     id : value.units[i].id,
  //                     unit_name : value.units[i].unit_name,
  //                     unit_name_ar : value.units[i].unit_name_ar,
  //                     abbreviation : value.units[i].abbreviation,
  //                     abbreviation_ar : value.units[i].abbreviation_ar,
  //                   };

  //                   activity_log_units.value.push(unit);
  //                 }
  //               }
  //           }
  //       }
  //   );
    async function saveActivityLog(){

        form.is_saving = true;
        
        var form_data = new FormData();
        form_data.append('description',form.description);
      
        var submit_url = (form.slack!='' && form.slack!=undefined)?'/api/v2/activity_log/update':'/api/v2/activity_log/save';
        await axios.post(submit_url, form_data).then( (response) => {
        
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
        activity_log_units.value = [{
        id: "",
        unit_name : "",
        unit_name_ar : "",
        abbreviation : "",
      }];
    }

    function addOption(){

      let unit = {
        id: "",
        unit_name : "",
        unit_name_ar : "",
        abbreviation : "",
      };

      activity_log_units.value.push(unit);

    }

    function removeOption(unit){
      activity_log_units.value.splice(activity_log_units.value.indexOf(unit),1);
    }
    
</script>