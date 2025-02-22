<template>

    <div class="" v-if="product != ''">
        <!-- <div class="row py-3">
            <div class="col-11">
                <h4>{{ $t('Add Ingredient') }} </h4>  
            </div>
            <div class="col-3">
                
            </div>
        </div> -->
        <div class="" >
            
            <div class="tab-content-head">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <h3>{{ $t('Add Ingredient') }}</h3>
                    </div>
                    <div class="col-auto">
                        <div class="form-field mb-0">
                            <!-- <select class="form-control form-control-solid form-control-sm w-100" v-model="selected_ingredient" @change="addItem()">
                                <option value="" :selected="selected_ingredient == ''">-- {{ $t('Select Ingredient') }} --</option>
                                <option v-for="(ingredient,index) in select_ingredients" :value="ingredient"> {{  ingredient.name  }} </option>
                            </select> -->

                            <AsyncIngredientSearch
                                @select-product="addItem"
                                :selected_ingredients="selected_ingredients_slack"
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
                <div class="col-12 py-3">
                    <table class="table table-condensed">
                        <thead>
                            <tr>
                                <th width="15%">{{ $t('Ingredient') }} </th>
                                <th width="15%">{{ $t('Rate') }}</th>
                                <th width="20%">{{ $t('Quantity') }} <em class="text-danger">*</em> </th>
                                <th width="20%">{{ $t('Measurement') }}</th>
                                <th width="15%" class="text-end">{{ $t('Amount') }}</th>
                                <th width="5%" class="text-end">{{ $t('Remove') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                                <tr v-if="form.ingredient_list != ''" v-for="(ingredient,index) in form.ingredient_list" :key="index">
                                    <td> <strong>{{  ingredient.ingredient_name }}</strong> </td>
                                    <td>
                                        <span> {{ ingredient.ingredient_price  }} {{ currency_symbol }} </span>
                                        <!-- / {{ $t("Per")+" " }}
                                        <span v-if="ingredient.ingredient_measurement_unit"> {{ (language == 'ar' && ingredient.ingredient_measurement_unit.unit_name_ar != '' && ingredient.ingredient_measurement_unit.unit_name_ar != null)?ingredient.ingredient_measurement_unit.unit_name_ar:ingredient.ingredient_measurement_unit.unit_name }} </span>
                                        <span v-else> {{ $t('Unit') }} </span> -->
                                    </td>
                                    <td>
                                        <VTextInput
                                            type="number" 
                                            :name="'ingredient_list['+index+'].quantity'"
                                            v-model="ingredient.quantity"
                                            @input="calculateIngredientPrice(ingredient,index)"
                                            step="1"
                                            size="small"
                                            :class="'mt-3'"
                                            :islabel=false
                                        />
                                    </td>
                                    <td>
                                        <select name="stock_measurement_unit_id" v-model="ingredient.product_ingredient_measurement_unit_id" class="form-control form-control-sm form-control-solid" @change="calculateIngredientPrice(ingredient,index)">
                                            <option v-if="ingredient.product_ingredient_measurement_unit_id == '' || ingredient.product_ingredient_measurement_unit_id == null " value="">{{ $t("Per Unit") }}</option>
                                            <option v-else v-for="(measurement,measurement_index) in ingredient.measurement_groups" :key="measurement_index" :value="measurement.id" >{{ measurement.unit_name+" "+measurement.unit_name_ar }}</option>
                                        </select> 
                                    </td>
                                    <td class="text-end">
                                        <span>{{ ingredient.product_ingredient_price  }} {{ currency_symbol }}</span>
                                    </td>
                                    <td class="text-end">
                                        <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeItem(ingredient)">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                                        </a>
                                    </td> 
                                </tr>
                                <tr v-else>
                                    <td colspan="9" class="text-center">{{ $t('No Ingredients Linked') }}</td>
                                </tr> 
                            
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-end">{{ $t('Total') }}</td>
                                <td class="text-end fw-bold">{{ total_ingredient_amount  }} {{ currency_symbol }}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                        
                    </table>
                </div>
<!--                <div class="col-12 py-3" v-if="form.server_messages.messages != ''">
                    <ServerMessage  :server_messages="form.server_messages"  />
                </div>-->
                <div class="row justify-content-end">
                  <div class="col-auto">
                    <div class="form-field pt-3">
                      <div class="form-check form-switch">
                        <Field
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            name="is_ingredients_total_price"
                            id="is_ingredients_total_price"
                            :unchecked-value="false"
                            :value="true"
                            v-model="form.is_ingredients_total_price"
                        />
                        <label class="form-check-label" for="is_ingredients_total_price"
                        >{{ $t("Set Product Price as Ingredient Cost?") }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
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
                </div>
            </Form>
        </div>
    </div>

</template>

<script setup>

    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import {Form, Field, useForm} from 'vee-validate'
    import { useAuthStore } from '@/stores/auth';
    import { useI18n } from 'vue-i18n'
    const { values,setFieldValue,setValues  } = useForm();

    const AsyncIngredientSearch = defineAsyncComponent(() => import('@/components/common/IngredientSearch.vue'));

    const { t } = useI18n();
    const props = defineProps({
        product : {
            type: Object
        }
    });
    const auth = useAuthStore();
    const currency_symbol = computed(() => {
      return auth.user.currency.symbol;
    })
    const selected_ingredients_slack = ref([]);
    const product = toRef(props,'product');
    const all_ingredients = ref('');
    const product_ingredients = product.value.ingredients;
    const selected_ingredient = ref('');
    const language = localStorage.getItem('language');
    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
        is_submitting: false,
        is_ingredients_total_price:false,
        ingredient_list: []
    };

    const form = reactive({ ...initialState });

    const schema = yup.object().shape({
        ingredient_list: yup.array(yup.object({
            quantity:yup.number().typeError(t('must be a number',{ name: t('Quantity') })).nullable()
            .when({
                is: product.value.is_stockable,
                then: (schema) => schema.required(t('name is required', { name: t('Quantity') })),
                otherwise:(schema) => schema.nullable()
            })
        }))
    });
    
    onMounted(() => {

      getProductMeasurementUnits();

      getAllIngredients();

      listExistingIngredients();

    });

    const measurement_units = ref([]);
    async function getProductMeasurementUnits(){
        let form_data = new FormData();
        form_data.append('product_slack',product.value.slack);
        await axios.post('/api/product/measurements',form_data).then( (response) => {
            measurement_units.value = response.data.data;
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
        });
    }

    async function getAllIngredients(){
      await axios.get('/api/v2/ingredients/all').then( (response) => {
        all_ingredients.value = response.data.data;
        populateSelectIngredientDropdown();

      }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
      });
    }

    const select_ingredients = ref([]);
    function populateSelectIngredientDropdown(){
        select_ingredients.value = all_ingredients.filter(function(all_ingredient_item) {
            return !product_ingredients.find(function(product_ingredient) {
                return all_ingredient_item.slack == product_ingredient.ingredient.slack
            })
        })
    }
    
    //const ingredient_list = ref([]);
    const total_ingredient_amount = computed(() => {
        let total = [];

        Object.entries(form.ingredient_list).forEach(([key, val]) => {
            total.push(val.product_ingredient_price) // the value of the current key.
        });

        return total.reduce(function(total, num){ return parseFloat(total) + parseFloat(num)  }, 0);
    });
    
    function listExistingIngredients(){

        _.forEach(product_ingredients, (value,index) => {
            
           let product_ingredient_template = {
                product_ingredient_slack : value.slack,
                ingredient_price : value.ingredient.this_branch_inventory.sale_price,
                ingredient_id : value.ingredient.id,
                ingredient_name : value.ingredient.name,
                quantity : value.quantity,
                ingredient_measurement_unit_id : value.ingredient.stock_measurement_unit_id,
                ingredient_measurement_unit : value.ingredient.stock_measurement_unit,
                product_ingredient_measurement_unit_id : value.measurement_unit_id,
                measurement_groups : value.measurement_groups,
                product_ingredient_price : value.price,
            };
            selected_ingredients_slack.value.push(value.ingredient.id);
            // product_ingredient_template.product_ingredient_price = calculateIngredientPrice(product_ingredient_template,index);

            form.ingredient_list.push(product_ingredient_template);
        });
      form.is_ingredients_total_price = product.value.this_branch_inventory.is_ingredients_total_price==1?true:false;
    }
    
    function addItem(clicked_ingredient){
        selected_ingredient.value = clicked_ingredient;
        if(selected_ingredient.value != ''){
            let product_ingredient_template = reactive({
                product_ingredient_slack : '',
                ingredient_price : selected_ingredient.value.sale_price,
                ingredient_id : selected_ingredient.value.id,
                ingredient_name : selected_ingredient.value.name,
                quantity : '',
                product_ingredient_price : 0,
                ingredient_measurement_unit_id : selected_ingredient.value.stock_measurement_unit_id,
                ingredient_measurement_unit : selected_ingredient.value.stock_measurement_unit,
                product_ingredient_measurement_unit_id : selected_ingredient.value.stock_measurement_unit_id,
                measurement_groups : selected_ingredient.value.measurement_groups,
            });

            form.ingredient_list.push(product_ingredient_template);
            selected_ingredients_slack.value.push(selected_ingredient.value.id);
            select_ingredients.value.splice(select_ingredients.value.indexOf(selected_ingredient.value), 1);
            selected_ingredient.value = '';
            
        }
    }
    
    function removeItem(item){
        form.ingredient_list.splice(form.ingredient_list.indexOf(item), 1);
        let ingredient =  _.find(all_ingredients.value, (value) => {
            return value.id == item.ingredient_id
        });
        selected_ingredients_slack.value.splice(selected_ingredients_slack.value.indexOf(ingredient.id), 1);
        select_ingredients.value.push(ingredient);
        select_ingredients.value = _.sortBy(select_ingredients.value, (value) => { return value.name; });

    }

    async function update(){

        form.is_submitting = true;

        var form_data = new FormData();
        form_data.append('product_slack',product.value.slack);
        form_data.append('ingredients',JSON.stringify(form.ingredient_list));
        form_data.append('total_ingredient_amount',total_ingredient_amount.value);
        form_data.append('is_ingredients_total_price',form.is_ingredients_total_price==true?1:0);

        await axios.post('/api/product/ingredient/update', form_data).then( (response) => {
            
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
        selected_ingredient.value = '';
    }

    function calculateIngredientPrice(ingredient,index){

        var from_measurement_unit_id = ingredient.ingredient_measurement_unit_id; 
        var to_measurement_unit_id = ingredient.product_ingredient_measurement_unit_id; 
        var price = ingredient.ingredient_price;
        var quantity = ingredient.quantity; 
        
        var conversion_value = '';
        _.forEach(ingredient.measurement_groups, (item) => {

            _.forEach(item.conversions, (subitem) => {

                if(subitem.from_measurement_unit_id == from_measurement_unit_id && subitem.to_measurement_unit_id == to_measurement_unit_id){
                    conversion_value = subitem.conversion_value;
                }

            } )

        })

        var new_price = 0;
        if(conversion_value == ''){
            new_price = parseFloat(price) * parseFloat(quantity);
        }else{
            new_price = parseFloat(price) * ( parseFloat(quantity) / parseFloat(conversion_value) );
        }

        form.ingredient_list[index].product_ingredient_price = Math.round((new_price + Number.EPSILON) * 100) / 100

    }

</script>