<template>

    <div class="" v-if="product != ''">
        <!-- <div class="row">
            <div class="col-12 py-3">
                <h4>Add modifier </h4>  
            </div>
        </div> -->
        <div class="my-2" >
            <div class="tab-content-head">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <h3>{{ $t('Modifiers') }}</h3>
                    </div>
                    <div class="col-auto">
                        <div class="form-field mb-0">
<!--                            <select class="form-control form-control-solid form-control-sm w-100" v-model="selected_modifier" @change="saveProductModifier">
                                <option value="">&#45;&#45; {{ $t('Select modifier') }} &#45;&#45;</option>
                                <option v-for="(modifier,index) in all_modifiers" :value="modifier"> {{  modifier.name  }} </option>
                            </select>-->
                          <AsyncModifierSearch
                              @select-product="addItem"
                              :selected_modifiers="selected_modifiers_ids"
                          />
                        </div>
                    </div>
                </div>
            </div>
          <Form
              @submit="update"
              :validation-schema="schema"
              :initial-values="form"
          >
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th width="20%">{{ $t('Modifier') }}</th>
                            <th width="20%">{{ $t('Modifier Options') }}</th>
                            <th>{{ $t('Modifier Option Price') }}</th>
                            <th class="text-end">{{ $t('Remove') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="form.modifier_list != ''" v-for="product_modifier in form.modifier_list">
                            <td class="valign-top" width="20%" >
                                <div class="mb-0">
                                  <b>{{ product_modifier.modifier_name }}</b>
                                </div>
                            </td>  
                            <td colspan="2" class="px-0">
                                <table class="table normal-table"  >
                                    <tbody>
                                        <tr v-for="product_modifier_options in product_modifier.modifier_options">
                                            <td width="25%">{{ product_modifier_options.option_name }}</td>  
                                            <td>
                                                <div class="form-field mb-0 field-end-label">
                                                    <input class="form-control form-control-sm form-control-solid" :value="product_modifier_options.sale_price" readonly />
                                                    <small>Per Unit</small>
                                                </div>
                                            </td>  
                                            
                                        </tr>
                                        
                                    </tbody>
                                </table> 
                            </td>
                            <td class="text-end align-middle">
                              <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeItem(product_modifier)">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                              </a>
                            </td> 
                        </tr>
                        
                    </tbody>
                </table>
            </div>

            <div class="col-12 mt-2 text-end">
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

</template> 

<script setup>

    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { Form } from 'vee-validate'
    import { useAuthStore } from '@/stores/auth';   
    import { useI18n } from 'vue-i18n'

    const AsyncModifierSearch = defineAsyncComponent(() => import('@/components/common/ModifierSearch.vue'));

    const { t } = useI18n();
    const auth = useAuthStore();
    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })
    
    const props = defineProps({
        product : {
            type: Object
        }
    });
    const selected_modifiers_ids = ref([]);
    const product = toRef(props,'product');
    const selected_modifier = ref('');
    const product_slack = product.value.slack;
    const product_modifiers = ref([]);
    const all_modifiers = ref([]);

    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
        is_submitting: false,
        modifier_list: []
    };

    const form = reactive({ ...initialState });

    onMounted(() => {
        getProductModifiers();
    });

    async function getProductModifiers(){
        
        await axios.get('/api/v2/product/modifiers', { params : {
                slack : product_slack,
            } }).then( (response) => {

            product_modifiers.value = response.data.data.product_modifiers;

            _.forEach(product_modifiers.value, (value,index) => {

              let option_array = [];
              _.forEach(value.options, (option,index) => {
               let modifier_option = {
                 option_name : option.option_name,
                 option_name_ar : option.option_name_ar,
                 sale_price : option.sale_price,
               }
               option_array.push(modifier_option);
              });

              let modifier_template = {
                modifier_slack : value.slack,
                modifier_id : value.modifier_id,
                modifier_name : value.modifier.name,
                modifier_name_ar : value.modifier.name_ar,
                modifier_options : option_array
              };
              form.modifier_list.push(modifier_template);
              selected_modifiers_ids.value.push(value.modifier_id);
            });

            all_modifiers.value = response.data.data.all_modifiers;

            // filter out existing modifiers
            let existing_items = product_modifiers.value.map( (item) => item.modifier.id );
            all_modifiers.value = all_modifiers.value.filter( (item) => {
                return !existing_items.includes(item.id);
            })

        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            console.log(error);
        });
    }

    
    async function deleteProductModifier(slack){

        var is_confirmed = false;

        await Swal.fire({
            title: t('Do you want to delete this item?'),
            showCancelButton: true,
            confirmButtonText: t('Yes, Delete'),
            cancelButtonText: t('Cancel'),
            confirmButtonColor: '#d33',
        }).then( (result) => {
            if(result.isConfirmed){
                is_confirmed = true;        
            }
        });

        if(is_confirmed){

            await axios.post('/api/product/modifier/delete',{
                slack : slack,
            }).then( (response) => {
                
            if(response.data.status_code == 200) {
                
                toast.success(response.data.msg);
                getProductModifiers();

            }else{
                try{
                    form.server_messages.type = "error";
                    form.server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    form.server_messages.type = "error";
                    form.server_messages.messages = response.data.msg;
                }
            }

            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                console.log(error);
            });
        }

    }

    /*async function saveProductModifier(clicked_modifier){
        let form_data = new FormData();
        form_data.append('product_slack',product.value.slack);
        form_data.append('modifier_slack',clicked_modifier.slack);

        await axios.post('/api/product/modifier/save',form_data).then( (response) => {
        
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getProductmodifiers();

        }else{
            try{
                form.server_messages.type = "error";
                form.server_messages.messages = JSON.parse(response.data.msg);
            }catch(err){
                form.server_messages.type = "error";
                form.server_messages.messages = response.data.msg;
            }
        }

        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            console.log(error);
        });   
    
    }*/

    function addItem(clicked_modifier){
      selected_modifier.value = clicked_modifier;
      if(selected_modifier.value != ''){

        let option_array = [];
        _.forEach(selected_modifier.value.options, (option,index) => {
          let modifier_option = {
            option_name : option.option_name,
            option_name_ar : option.option_name_ar,
            sale_price : option.sale_price,
          }
          option_array.push(modifier_option);
        });
        let modifier_template = reactive({
          modifier_slack : selected_modifier.value.slack,
          modifier_id : selected_modifier.value.id,
          modifier_name : selected_modifier.value.name,
          modifier_name_ar : selected_modifier.value.name_ar,
          modifier_options : option_array
        });
        form.modifier_list.push(modifier_template);

        selected_modifiers_ids.value.push(selected_modifier.value.id);
        selected_modifier.value = '';
      }
    }

    function removeItem(item){
      form.modifier_list.splice(form.modifier_list.indexOf(item), 1);
      let modifier =  _.find(all_modifiers.value, (value) => {
        return value.id == item.modifier_id
      });
      selected_modifiers_ids.value.splice(selected_modifiers_ids.value.indexOf(modifier.id), 1);
    }


    async function update(){

      form.is_submitting = true;

      var form_data = new FormData();
      form_data.append('product_slack',product_slack);
      form_data.append('modifiers',JSON.stringify(form.modifier_list));

      await axios.post('/api/product/modifier/update', form_data).then( (response) => {

        form.is_submitting = false;

        if(response.data.status_code == 200) {

          toast.success(response.data.msg);

          resetData();

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

    function resetData(){
      selected_modifier.value = '';
    }

</script>

<style scoped>

    .no-border{
        border:0px !important;
    }
    .modifier-item{
        height: 0px;
        padding:0px 0px 3px 0px;
    }

</style>