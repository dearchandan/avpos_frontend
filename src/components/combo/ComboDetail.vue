<template>
        <div class="row card-strash">
            <div class="col-md-12">
                <div class="row">
                    
                        <div class="col-md-5 col-12 mb-4">
                            <div class="card">

                                    <div class="row">
                                        <div class="col-12 mb-4">
                                            <div class="text-center">
                                                <img :src="combo.image">
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-6">
                        
                                            <VSelect
                                                name=""
                                                :label="labels.type"
                                                v-model="combo.type"
                                                :placeholder="labels.select_type"
                                                :options="types"
                                                :disabled="is_disabled"
                                            />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <VTextInput
                                                type="text" 
                                                name=""
                                                :label="labels.name"
                                                v-model="combo.name"
                                                :readonly="is_readonly"
                                            />
                                        </div>
                                       <div class="col-12 col-md-6">
                                            <VTextInput
                                                type="text" 
                                                name=""
                                                v-model="combo.description"
                                                :label="labels.description" 
                                                :placeholder="labels.description"
                                                :readonly="is_readonly"
                                            />
                                           
                                        </div>
                                        <div class="col-12 pt-6 col-md-6">
                                            <div class="form-field mt-4">
                                                <div class="form-check form-switch pt-3">
                                                    <input class="form-check-input me-2" type="checkbox" role="switch" id="status"  disabled :checked="combo.status == 1">
                                                    <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                                                </div>
                                            </div>
                                        </div>
                                         <div class="col-12 col-md-6">
                                            <VTextInput
                                                type="number"
                                                name=""
                                                :input_group_text="'SAR'"
                                                v-model="combo.price"
                                                min="0.01"
                                                step="0.01"
                                                :label="labels.price"
                                                :readonly="is_readonly"
                                            />
                                            <!-- <div class="form-check">
                                                <input class="form-check-input me-2" type="checkbox" id="based_on_product_price"  @input="updateProductPrice" >
                                                <label class="form-check-label" >Based on Product price</label>
                                            </div> -->
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <VSelect 
                                            v-model="combo.tax_id"
                                            name="" 
                                            :label="labels.select_tax"
                                            :placeholder="labels.select_tax"
                                            :options="taxes"
                                            :disabled="is_disabled"
                                            />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <VTextInput
                                                type="number"
                                                name=""
                                                :input_group_text="'SAR'"
                                                v-model="combo.tax_amount"
                                                min="0.01"
                                                step="0.01"
                                                :label="labels.tax_amount"
                                                 :readonly="is_readonly"
                                            />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <VTextInput
                                                type="number"
                                                name=""
                                                :input_group_text="'SAR'"
                                                v-model="combo.amount"
                                                min="0.01"
                                                step="0.01"
                                                :label="labels.amount"
                                                :readonly="is_readonly"
                                            />
                                        </div>

                                     
                                        
                                    </div>
                            </div>       
                        </div> 
                        <div class="col-md-7 col-12 mb-4">
                            <div class="card">
                                <div class="row">

                                    <h5 class="section-title pb-3 text-muted">{{ $t('Products') }}:</h5>
                                        <div class="table-responsive">
                                            <table class="table table-hover table-bordered mb-3 ">
                                                <thead class="bg-light">
                                                <tr>
                                                <th width="80%">{{ $t('Product/Service') }}</th>
                                                <th class="text-right" width="20%">{{ $t('Quantity') }}</th>
                                                <!-- <th class="text-center">Unit Price</th>
                                                <th class="text-center">Measurement Unit</th> -->
                                                <!-- <th class="text-center">Total</th> -->
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-if="combo_product_list.length>0" v-for="(combo_product,index) in combo_product_list" :key="index">
                                                        <td data-title="Product" width="20%" >
                                                           {{ combo_product.name }}
                                                        </td>
                                                        
                                                        <td data-title="Quantity" width="15%" >
                                                            <VTextInput
                                                                type="number"
                                                                name=""
                                                                :input_group_text="labels.units"
                                                                label=""
                                                                v-model="combo_product.quantity"
                                                                min="0.01"
                                                                step="0.01"
                                                                :readonly="is_readonly"
                                                            />
                                                        </td>
                                                        <!-- <td data-title="Unit Price" width="15%" class="text-end">
                                                            {{ combo_product.sale_price }} SAR
                                                        </td>
                                                        
                                                        <td data-title="Measurement Unit" width="15%" class="text-end">
                                                            <VSelect
                                                                v-if="combo_product.measurement_unit_id"
                                                                name="measurement_unit_id"
                                                                placeholder="Choose measurement unit"
                                                                :options="combo_product.measurement_units"
                                                                class="mb-0"
                                                                v-model="combo_product.measurement_unit_id"
                                                                label=""
                                                                disabled="is_disabled"
                                                            />
                                                            <span>Unit</span>
                                                        </td> -->
                                                        <!-- <td data-title="Amount" width="10%" class="text-end">{{ combo_product.quantity * combo_product.sale_price }}</td> -->
                                                      
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                </div>
                            </div>
                        </div>           
                </div>
            </div>
        </div>
</template>

<script setup>
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useAuthStore } from '@/stores/auth';
import {onMounted, reactive, ref, toRef, watch} from "vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const labels = ref({
  type: t('Type'),
  select_type: t('Select Type'),
  name: t("Combo Name"),
  select_tax: t("Select Tax"),
  price: t("Price"),
  tax_amount: t("Tax Amount"),
  amount: t("Amount"),
  units: t("Units"),
  description: t("Description")
});
const auth = useAuthStore();
const currency_symbol = computed(() => {
  return auth.user.currency.symbol;
})

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  }
};
const form = reactive({ ...initialState });
const props = defineProps(['combo','combo_products']);
const is_loading = ref(false);
const is_readonly = ref(true);
const is_disabled = ref(true);
let combo_products = toRef(props,'combo_products');
let combo_product_list = ref([]);
let types = [
    {
      'key': 1,
      'value': 'Simple',
    },
    {
        'key': 2,
        'value': 'Customized',
    }
];
const taxes = ref([]);
onMounted(() => {
  getTaxes();
  getMeasurements();
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
async function getMeasurements(){
    

    _.forEach(combo_products.value, (product) => {
        let measurement_units = ref([]);
        let form_data = new FormData();
        form_data.append('product_slack',product.product.slack);
        axios.post('/api/product/measurements',form_data).then( (response) => {
           _.forEach(response.data.data, (item) => {
                let template = {
                'key': item.id,
                'value': item.unit_name,
                'id': item.slack,
                };
                measurement_units.value.push(template)
            });
         let product_template = {
            'name': product.product.name,
            'quantity': product.quantity,
            'measurement_unit_id': product.measurement_unit_id,
            'sale_price': product.product.sale_price,
            'measurement_units': measurement_units
            };
         combo_product_list.value.push(product_template)
       }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
        });
    });

    // let product_template;
    // let form_data = new FormData();
    // form_data.append('product_slack',clicked_product.slack);
    // await axios.post('/api/product/measurements',form_data).then( (response) => {
    //     _.forEach(response.data.data, (item) => {
    //         let template = {
    //         'key': item.id,
    //         'value': item.unit_name,
    //         'id': item.slack,
    //         };
    //         measurement_units.value.push(template);
    //     }) 
    //     product_template = reactive({
    //         type: 1,
    //         product_slack : clicked_product.slack,
    //         product_name : clicked_product.name,
    //         quantity : 1,
    //         stock_measurement_unit_id: clicked_product.stock_measurement_unit_id,
    //         stock_measurement_unit_value: clicked_product.stock_measurement_unit && clicked_product.stock_measurement_unit.unit_name?clicked_product.stock_measurement_unit.unit_name:'',
    //         price : clicked_product.product_sale_price,
    //         total_amount : clicked_product.product_sale_price,
    //         measurement_units: measurement_units
    //     });
    // }).catch((error) => {
    //     form.server_messages.type = "error";
    //     form.server_messages.messages = error;
    // });

  //combo_products.value.push(product_template);
  //calculateTotal();
}
</script>
