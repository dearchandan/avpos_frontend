<template>
   <div class="modal hide modal-lg" id="addConversionModal"  tabindex="-1" aria-labelledby="Add Conversion" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false" >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ $t("Add/Edit Conversion") }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                     
                        <Form
                        @submit="saveConversion"
                        enctype="multipart/form-data"
                        >
                          <div class="row pt-3">
                            <table class="table table-bordered">
                              <thead>
                              <tr>
                                <th>{{ $t('From Measurement Unit') }}</th>
                                <th>{{ $t('To Measurement Unit') }}</th>
                                <th>{{ $t('Value') }}</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr v-if="form.conversions.length > 1" v-for="(conversion,index) in form.conversions" :key="index">
                                <td>
                                  {{ conversion.from_unit_name }}
                                </td>
                                <td>
                                  {{ conversion.to_unit_name }}
                                </td>
                                <td>
                                  <VTextInput
                                      type="text"
                                      name="unit_name"
                                      v-model="conversion.conversion_value"
                                      label=""
                                      placeholder="Ex. kg"

                                  />
                                </td>
                              </tr>
                              <tr v-else>
                                <td colspan="4" class="text-center"><strong>{{ $t("Atleast 2 measurement units are required for conversion") }} </strong></td>
                              </tr>
                              </tbody>
                              <tfoot>
                              </tfoot>
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

    // import axios from 'axios';
    import {ref, reactive, watch, computed, onMounted} from 'vue';
    import { Form, Field, ErrorMessage } from 'vee-validate'
    import * as yup from 'yup';
    import VTextInput from '@/components/common/VTextInput.vue'
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    
    import { useAuthStore } from '@/stores/auth';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    // import _ from 'lodash';

    const is_loading = ref(false);

    const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
      is_saving: false,
      is_listing: false,

      // form data
      conversions : [{
        slack : "",
        from_unit_name : "",
        to_unit_name : "",
        conversion_value : "",
      }],
    };

    const form = reactive({ ...initialState });

    const authStore = useAuthStore();

    /*const schema = yup.object({
        measurement_name: yup.string().required().min(3).label('Measurement name'),
        status: yup.bool().label('status'),
    });*/

    

    const emit = defineEmits(['closeAddConversionModal'])

    const props = defineProps(['show_add_conversion_modal','measurement_slack']);

    function closeModal(){
        resetData();
        emit('closeAddConversionModal');

    }
    /*onMounted(() => {
      getConversions()
    });*/

    watch(() =>
          props.measurement_slack, (value) => {
          if(value){
            getConversions();
          }
        },
    );

    async function getConversions(){
      form.conversions = [];
      await axios.post('/api/measurement/conversions',{
        slack : props.measurement_slack
      }).then( (response) => {

        response.data.data.conversions.forEach((elm) => {
          form.conversions.push({
            slack: elm.slack,
            from_unit_name: elm.from_unit_name,
            to_unit_name: elm.to_unit_name,
            conversion_value: elm.conversion_value
          })
        });
      }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        form.is_listing = false;
        console.log(error);
      });

    }

    async function saveConversion(){

      var form_data = new FormData();
        form_data.append('conversions',JSON.stringify(form.conversions));


      await axios.post('/api/measurement/conversion/save', form_data).then( (response) => {

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