<template>

  <div v-if="ingredient != ''">

    <div class="row" v-if="ingredient.price_type == 3 && ingredient.ingredients.length <= 0 ">
      <div class="alert alert-warning p-3"> <Icon icon="fa6-solid:circle-info"/>  {{ $t('Please add ingredients to access inventory section') }}</div>
    </div>

    <div class="row" v-else>
      <Form
          @submit="update"
          :validation-schema="schema"
          :initial-values="form"
      >
        <div class="col-12 py-3">
          <div class="card">
            <div class="row mb-3">
              <div class="col-4">
                <label class="label  "> {{ $t('Branch') }}</label>
              </div>
              <div class="col-8">
                <div class="form-field ">
                  <strong>{{  auth.user.login_branch.name }}</strong>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4" v-if="ingredient.is_stockable">
                <label class="label  ">  {{ $t('Quantity') }} <span class="text-danger">*</span></label>
              </div>
              <div class="col-8" v-if="ingredient.is_stockable">
                <VTextInput
                    type="number"
                    :name="'quantity'"
                    :input_group_text="ingredient.stock_measurement_unit_id ? (language == 'ar' && ingredient.stock_measurement_unit.abbreviation_ar != '' && ingredient.stock_measurement_unit.abbreviation_ar != null)?ingredient.stock_measurement_unit.abbreviation_ar:ingredient.stock_measurement_unit.abbreviation : labels.units"
                    v-model="form.quantity"
                    step="1"
                    label=""
                    :class="''"
                    :islabel=false
                    size="small"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <label class="label  "> {{ $t('SKU') }}</label>
              </div>
              <div class="col-8">
                <div class="form-field ">
                  <input
                      type="text"
                      name="sku"
                      v-model="form.sku"
                      class="form-control form-control-solid "
                  />
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4" v-if="ingredient.is_stockable">
                <label class="label  "> {{ $t('Alert Quantity') }}</label>
              </div>
              <div class="col-8" v-if="ingredient.is_stockable">
                <div class="input-group ">
                  <input
                      type="number"
                      name="alert_quantity"
                      class="form-control form-control-solid "
                      v-model="form.alert_quantity"
                      :input_group_text="ingredient.stock_measurement_unit_id ? (language == 'ar' && ingredient.stock_measurement_unit.abbreviation_ar != '' && ingredient.stock_measurement_unit.abbreviation_ar != null)?ingredient.stock_measurement_unit.abbreviation_ar:ingredient.stock_measurement_unit.abbreviation : labels.units"
                  />
                  <div class="input-group-append" >
                    <span class="input-group-text h-100 form-control-solid">{{ ingredient.stock_measurement_unit_id ? (language == 'ar' && ingredient.stock_measurement_unit.abbreviation_ar != '' && ingredient.stock_measurement_unit.abbreviation_ar != null)?ingredient.stock_measurement_unit.abbreviation_ar:ingredient.stock_measurement_unit.abbreviation : labels.units }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <label class="label  "> {{ $t('Show In') }}</label>
              </div>
              <div class="col-8">
                <!-- <select class="form-control form-control-solid" name="" id="" v-model="form.show_in">
                    <option value="" :selected="form.show_in == ''">{{ $t('Everywhere') }}</option>
                    <option :value="option.value" v-for="(option,index) in show_in_options" :key="index">{{ option.value }}</option>
                </select> -->
                <VRadio
                    type="radio"
                    name="mode"
                    v-model="form.show_in"
                    :label="''"
                    :required="true"
                    :options="show_in_options"
                />
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4">
                <label class="label"> {{ $t('Is Favorite') }}</label>
              </div>
              <div class="col-8">
                <div class="form-check form-switch ">
                  <input class="form-check-input" type="checkbox" role="switch" id="is_favorite"  v-model="form.is_favorite">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <label class="label"> {{ $t('Status') }}</label>
              </div>
              <div class="col-8">
                <div class="form-check form-switch ">
                  <input class="form-check-input me-2" type="checkbox" role="switch" id="status" :checked="form.status" v-model="form.status">
                </div>
              </div>
            </div>
          </div>
          <div class="row py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage  :server_messages="form.server_messages"  />
          </div>
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
                            {{ $t('Save') }} </span>

          </button>
        </div>
      </Form>
    </div>

  </div>

  <ProductDetailFormSkeleton v-else />

</template>

<script setup>

    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { Form } from 'vee-validate'
    import { useAuthStore } from '@/stores/auth';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const props = defineProps({
        ingredient : {
            type: Object
        },
        all_branches : {
            type: Object
        }
    });
        
    const auth = useAuthStore();
    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })

    const ingredient = props.ingredient;
    const all_branches = props.all_branches;
    const all_branch_inventory = props.ingredient.all_branch_inventory;
    const selected_branch = ref('');
    
    const initialState = {
      server_messages: {
          type: "",
          messages: "",
      },
      is_submitting: false,

      all_branch_inventory_data: [],
      branch_slack : auth.user.login_branch.slack,
      branch_name : auth.user.login_branch.name,
      quantity : 0,
      sku : "",
      alert_quantity : 0,
      show_in :  '',
      status : false,
      is_favorite : false
    };

    const form = reactive({ ...initialState });

    const show_in_options = ref([
      {
        name: t('Everywhere'),
        value: '',
      },
      {
        name: 'POS',
        value: 'POS',
      },{
        name: 'INVOICE',
        value: 'INVOICE',
      }
    ]);
    const schema = yup.object({
      quantity:yup.number().typeError(t('must be a number',{ name: t('Quantity') })).nullable()
          .when({
            is: ingredient.is_stockable,
            then: (schema) => schema.required(t('name is required', { name: t('Quantity') })),
            otherwise:(schema) => schema.nullable()
          })
    });
    
    onMounted(() => {
        refreshData();
    });

    watchEffect(() => {
      if(!_.isEmpty(ingredient)){
        refreshData();
      }
    })
    const branches = ref([]);
    
    function refreshData(){

      if(ingredient.this_branch_inventory){
        let inventory = ingredient.this_branch_inventory;
        form.branch_slack = inventory.branch.slack;
        form.branch_name = inventory.branch.name;
        form.quantity = inventory.quantity;
        form.sku = inventory.sku;
        form.alert_quantity = inventory.alert_quantity;
        form.show_in = (inventory.show_in != null && inventory.show_in!='') ? inventory.show_in : '';
        form.status = (inventory.status == '1') ? true : false;
        form.is_favorite = (inventory.is_favorite == '1') ? true : false;
      }
    
    }

    function addItem(){

        if(selected_branch.value != ''){
            
            let all_branch_inventory_template = reactive({
                branch_slack : selected_branch.value.slack,
                branch_name : selected_branch.value.name,
                quantity : '',
                sku : '',
                alert_quantity : ingredient.alert_quantity,
                show_in : '',
                status : true,
                is_favorite : ''
            });
    
            form.all_branch_inventory_data.push(all_branch_inventory_template);
            branches.value.splice(branches.value.indexOf(selected_branch.value), 1);
            selected_branch.value = '';
            
        }
    }
    
    function removeItem(inventory){
        
        form.all_branch_inventory_data.splice(form.all_branch_inventory_data.indexOf(inventory), 1);
        let branch =  _.find(all_branches, (value) => {
            return value.slack == inventory.branch_slack
        });
        branches.value.push(branch);
        
        branches.value = _.sortBy(branches.value, (value) => { return value.name; });

    }

    async function update(){

        form.is_submitting = true;

      let all_branch_inventory_template = {
        branch_slack : form.branch_slack,
        branch_name : form.branch_name,
        quantity : form.quantity,
        sku : form.sku,
        alert_quantity : form.alert_quantity,
        show_in : (form.show_in != null) ? form.show_in : '',
        status : (form.status == '1') ? true : false,
        is_favorite : (form.is_favorite == '1') ? true : false
      };

      form.all_branch_inventory_data.push(all_branch_inventory_template);

        var form_data = new FormData();
        form_data.append('ingredient_slack',ingredient.slack);
        form_data.append('inventory',JSON.stringify(form.all_branch_inventory_data));

        await axios.post('/api/ingredient/inventory/update', form_data).then( (response) => {
            
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
        selected_branch.value = '';
    }

</script>