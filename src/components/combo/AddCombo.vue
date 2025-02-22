<template>
    <Form :validation-schema="schema" enctype="multipart/form-data" @submit="saveCombo">
        <div class="row card-strash">
            <div class="col-md-12">
                <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''" :server_messages="form.server_messages"  />

                   <div class="row">
                    
                        <div class="col-md-3 col-12 mb-4">
                            <div class="card">
                                    <div class="row">
                                        
                                        <div class="col-12 ">
                                            <div class="form-field">
                                                <label for="">{{ $t('Type') }}</label>
                                                <select name="pricing_method" class="form-control form-control-solid" v-model="form.type">
                                                    <option :value="combo_type.key" v-for="combo_type in combo_types">{{ combo_type.value  }}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="col-12 ">
                                            <VTextInput
                                                type="text" 
                                                name="name"
                                                v-model="form.name"
                                                :label="combo_name_placeholder" 
                                                :placeholder="combo_name_placeholder"
                                                :required="true"
                                            />
                                        </div>

                                        <div class="col-12">
                                            <div class="form-field">
                                                <label for="">{{ $t('Pricing Method') }}</label>
                                                <select name="pricing_method" class="form-control form-control-solid" v-model="form.pricing_method">
                                                    <option value="1">{{ $t('Custom Pricing') }}</option>
                                                    <option value="2">{{ $t('Based On Total Cost of Items Added') }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                         <div class="col-12" v-if="form.pricing_method == 1">
                                            <VTextInput
                                                type="number"
                                                name="price"
                                                :input_group_text="currency_symbol"
                                                v-model="form.price"
                                                min="0.01"
                                                step="0.01"
                                                :label="price_placeholder"
                                                @input="calculateTotal"
                                            />
                                        </div>

                                        <div class="col-12" v-if="form.pricing_method == 1">
                                            <VSelect 
                                                v-model="form.tax_id"
                                                name="tax_id" 
                                                :label="select_tax_placeholder" 
                                                :placeholder="select_tax_placeholder"
                                                :options="taxes"
                                                @input="calculateTotal"
                                            />
                                        </div>
                                        
                                        <div class="col-12">
                                            <label>{{ $t('Image') }}</label>
                                            <div class="input-group input-file-group">
                                                <input class="form-control form-control-solid" name="image" type="file" id="formFile" accept="image/jpg, image/jpeg, image/png" @change="selectFile">
                                                <label class="btn btn-light-primary min-width-0 mb-0" for="formFile">{{ $t('Upload') }}</label>
                                            </div>
                                        </div>

                                        <div class="col-12 mt-5">
                                            <div class="form-field">
                                                <div class="form-check form-switch ">
                                                    <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status" >
                                                    <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                            </div>       
                        </div>   

                        <div class="col-md-9 col-12 mb-4">
                            <div class="card">
                                <div class="row">

                                    <h5 class="section-title pb-3 text-muted">{{ $t("Products") }}:</h5>
                                    <div class="col-6  col-md-4 mb-3">
                                    <AsyncProductSearch
                                        @select-product="addProduct"
                                        :placeholder="search_placeholder"
                                        :selected_products="selected_products"
                                        :button_placeholder="add_service"
                                    />
                                    </div>
                                    <!--  Table goes here! -->
                                    <div class="table-responsive">
                                    <table class="table table-hover table-bordered mb-3 ">
                                        <thead class="bg-light">
                                        <tr>
                                        <th>{{ $t('Product/Service') }}</th>
                                        <th class="text-center">{{ $t('Quantity') }}</th>
                                        <th class="text-center">{{ $t('Measurement Unit') }}</th>
                                        <th class="text-center">{{ $t('Price') }}</th>
                                        <th class="text-center">{{ $t('Total') }}</th>
                                        <th class="text-center">{{ $t('Remove') }}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-if="combo_products.length>0" v-for="(combo_product,index) in combo_products" :key="index">
                                        <input type="hidden" name="product_name" v-model="combo_product.product_name">
                                        <input type="hidden" name="product.sku" v-model="combo_product.product_slack">
                                        <td data-title="Search Product" width="20%" v-if="combo_product.type==1">
                                            {{  combo_product.product_name }}
                                        </td>
                                        <td data-title="Search Product" width="20%" v-else>
                                            <VTextInput
                                                type="text"
                                                name="product_name"
                                                label=""
                                                v-model="combo_product.product_name"
                                            />
                                        </td>
                                        <td data-title="Quantity" width="15%" v-if="combo_product.type==1">
                                            <VTextInput
                                                type="number"
                                                name="quantity"
                                                label=""
                                                v-model="combo_product.quantity"
                                                min="0.01"
                                                step="0.01"
                                                v-on:input="calculateTotal"
                                            />
                                        </td>
                                        <td v-else class="text-end">
                                            <span >1.00</span>
                                        </td>
                                        <td data-title="Measurement Unit" width="15%" class="text-end">
                                            <VSelect
                                                name="measurement_unit_id"
                                                :placeholder="combo_product.quantity > 1 ? 'Units' : 'Unit'"
                                                :options="combo_product.measurement_units"
                                                v-model="combo_product.stock_measurement_unit_id"
                                                label=""
                                            />
                                        </td>
                                        <td data-title="Unit Price" width="15%" class="text-end">
                                            {{ combo_product.price }} {{ currency_symbol }}
                                        </td>
                                        <td data-title="Amount" width="10%" class="text-end">{{ combo_product.total_amount }}</td>
                                        <td data-title="Action" width="5%" class="text-center">
                                            <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeProduct(combo_product)">
                                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                                            </a>
                                        </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </div>
                                    <div class="row justify-content-between mt-1">
                                        <div class="row">
                                            <div class="col-10 mt-5 text-end m-auto">
                                                <h5>{{ $t('Combo Price') }}</h5>
                                            </div>
                                            <div class="col-2 mt-5 text-end text-primary fw-bold">
                                                <h5 v-if="form.pricing_method == 1"> {{ form.amount  }}  {{ currency_symbol  }}</h5>
                                                <h5 v-else> {{ grand_final_total}} {{ currency_symbol  }} </h5>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>       
            </div>
        </div>

         <div class="text-end">
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
</template>
<script setup>

import { Form } from 'vee-validate'
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );
const AsyncProductSearch = defineAsyncComponent(() => import('@/components/common/ProductSearch.vue'));

const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
})

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data   
  name : "",
  type : 1,
  is_stockable : true,
  status : true,
  image: "",
  description : "",
  purchase_price : "",
  alert_quantity : "",
  pricing_method: 1,
  price: 0,
  tax_id: "",
  tax_amount: 0,
  amount: 0,
  price_readonly: true,
  tax_readonly: true,
  image: "",
  combo_slack: ""
};

const form = reactive({ ...initialState });

const schema = yup.object({ 
    name: yup.string().required(t('name is required', { name: t('Combo Name') })).min(3,t('name must be at least n characters', { name: t('Combo Name'), number: 3 })),
    status: yup.bool().label('status'),
    price: yup.number().min(0,t("must be greater than or equal to 0",{ name:t('Price') })),
});

let combo_types = [
    {
      'key': 1,
      'value': 'Plain',
    },
    /*{
        'key': 2,
        'value': 'Customized',
    }*/
];
let grand_final_total = ref(0);
let grand_tax = ref(0);
let final_amount = ref(0);
let based_on_product_price = ref(true);
const select_tax_placeholder = t("Select Tax")
const price_placeholder = t("Price")
const combo_name_placeholder = t('Combo Name')
const search_placeholder = t('Search and Add Product')
const add_service = t('Add Service')
const taxes = ref([]);
onMounted(() => {
  getTaxes();
});

async function getTaxes(){
  _.forEach(auth.user.country.taxes, (item) => {
    let template = {
      'key': item.id,
      'value': item.name,
      'percentage': item.total_percentage,
    };
    taxes.value.push(template);
  })
}
async function selectFile(e){
    form.image = e.target.files[0];
}
const combo_products = ref([]);
const selected_products = ref([]);

const props = defineProps(['combo','combo_products']);

 watch(() => 
    props.combo,(value) => {
        if(value){
            //console.log(props.combo_products)
            form.name = value.name;
            form.is_stockable = value.is_stockable;
            form.status = value.status == 1?true:false;
            form.price = value.price;
            form.tax_id = value.tax_id;
            form.tax_amount = value.tax_amount;
            form.amount = value.amount;
            form.pricing_method = value.tax_id!=null?1:2;
            form.combo_slack = value.slack;
            calculateTotal();
        }
    }
 )
  watch(() => 
    props.combo_products,(value) => {
        if(value){
            let product_template;
            let measurement_units = ref([]);
               props.combo_products.forEach((item, index) => {
                //console.log(item)
                let form_data = new FormData();
                selected_products.value.push(item.product.slack);
                form_data.append('product_slack',item.product.slack);
                axios.post('/api/product/measurements',form_data).then( (response) => {
                    
                    _.forEach(response.data.data, (item) => {
                        let template = {
                        'key': item.id,
                        'value': item.unit_name,
                        'id': item.slack,
                        };
                        measurement_units.value.push(template);
                    }) 

                    product_template = reactive({
                        type: 1,
                        product_slack : item.product.slack,
                        product_name : item.product.name,
                        quantity : item.quantity,
                        stock_measurement_unit_id: item.measurement_unit_id,
                        stock_measurement_unit_value: item.stock_measurement_unit && item.stock_measurement_unit.unit_name?item.stock_measurement_unit.unit_name:'',
                        price : item.product.sale_price,
                        total_amount : item.product.sale_price,
                        measurement_units: measurement_units
                    });
                    combo_products.value.push(product_template)
                })
                
            });
            calculateTotal();
            
        }
    }
 )

async function addProduct(clicked_product){
  
  selected_products.value.push(clicked_product.slack);
    let measurement_units = ref([]);
    let product_template;
    let form_data = new FormData();
    form_data.append('product_slack',clicked_product.slack);
    await axios.post('/api/product/measurements',form_data).then( (response) => {
        
        _.forEach(response.data.data, (item) => {
            let template = {
            'key': item.id,
            'value': item.unit_name,
            'id': item.slack,
            };
            measurement_units.value.push(template);
        }) 

        product_template = reactive({
            type: 1,
            product_slack : clicked_product.slack,
            product_name : clicked_product.name,
            quantity : 1,
            stock_measurement_unit_id: clicked_product.stock_measurement_unit_id,
            stock_measurement_unit_value: clicked_product.stock_measurement_unit && clicked_product.stock_measurement_unit.unit_name?clicked_product.stock_measurement_unit.unit_name:'',
            price : clicked_product.sale_price,
            total_amount : clicked_product.sale_price,
            measurement_units: measurement_units
        });
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
    });

  combo_products.value.push(product_template);
  calculateTotal();
}

function calculateTotal() {
  var grand_sub_total = 0;
  var grand_discount = 0;
   grand_tax = 0;
   grand_final_total = 0;

  for (var index in combo_products.value) {
    var item_discount_amount = 0;
    var item_tax_amount = 0;
    var item_total_amount = 0;

    var quantity = combo_products.value[index].quantity;
    var unit_price = combo_products.value[index].price;

    if (!isNaN(quantity) && quantity != null && quantity != "" && !isNaN(unit_price) && unit_price != null && unit_price != "") {
      //item total
      item_total_amount = parseFloat(quantity) * parseFloat(unit_price);
      item_total_amount = item_total_amount.toFixed(2);
      combo_products.value[index].total_amount = item_total_amount;


      item_total_amount = parseFloat(item_total_amount) + parseFloat(item_tax_amount);
      item_total_amount = item_total_amount.toFixed(2);

      combo_products.value[index].total_amount = item_total_amount;

      grand_discount = parseFloat(grand_discount) + parseFloat(item_discount_amount);
      grand_tax = parseFloat(grand_tax) + parseFloat(item_tax_amount);
      grand_sub_total = parseFloat(grand_sub_total) + parseFloat(item_total_amount);

    }else{
      combo_products.value[index].price = 0;
      combo_products.value[index].total_amount = 0;
      continue;
    }

  }


    grand_final_total = grand_sub_total.toFixed(2);
    if(form.pricing_method == 2){
    form.price = grand_final_total
    }
    if(form.tax_id != '')
    {
        let obj =  taxes.value.find(o => o.key == form.tax_id);
        if(obj && parseFloat(obj.percentage) > 0)
        {
            var tax_amount = (parseFloat(obj.percentage) / 100) * parseFloat(form.price);
            grand_tax = tax_amount.toFixed(2);
        }
    }
    form.tax_amount = grand_tax;
    final_amount = parseFloat(form.price) + parseFloat(form.tax_amount)
    form.amount = final_amount.toFixed(2);

}
function removeProduct(combo_product){
  combo_products.value.splice(combo_products.value.indexOf(combo_product), 1);
  selected_products.value.splice(selected_products.value.indexOf(combo_product.product_slack), 1);
  calculateTotal();
}

async function saveCombo(){

    form.is_submitting = true;

    var form_data = new FormData();
    form_data.append('name',form.name);
    form_data.append('pricing_method',form.pricing_method);
    form_data.append('price',form.price);
    form_data.append('type',form.type);
    if(combo_products.value.length > 0){
        form_data.append('selected_products',JSON.stringify(combo_products.value));
    }
    form_data.append('amount',form.amount);
    if(form.pricing_method != 1)
        form_data.append('tax_id','');
    else
        form_data.append('tax_id',form.tax_id);

    form_data.append('tax_amount',form.tax_amount);
    
    form_data.append('image',form.image);
    form_data.append('description',form.description);
    form_data.append('status',form.status);
    form_data.append('combo_slack',form.combo_slack);

    var submit_url = form.combo_slack != '' && form.combo_slack != undefined?'/api/combo/update':'/api/combo/save';

    await axios.post(submit_url, form_data).then( (response) => {
    
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            form.is_submitting = false;

            resetData();

            router.push('/combos');
            
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
    });

}
function resetData(){
    Object.assign(form, initialState);
}
</script>