<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <h5 class="section-title text-muted">{{ $t('Products Details') }}:</h5>
        <div class="row" v-if="props.stock_adjustment.status<2">
          <!-- <div class="form-field">
            <div class="d-flex align-items-center flex-wrap">
              <!-- <label class="me-3 mt-3">
                <input class="form-check-input me-1" type="radio" name="search_type" checked="" v-model="form.search_type" :value="1" @click="changeSearch">{{ $t('Search by Category') }}
              </label> -->
              <!-- <label class="mt-3">
                <input class="form-check-input me-1" type="radio" name="search_type" v-model="form.search_type" :value="2" @click="changeSearch">{{ $t('Search by Product Name') }}
              </label>
            </div>
          </div> -->
          <div class="col-12" v-if="form.search_type==1">
            <div class="row">
              <div class="col-md-3">
                <VSelect
                    name="categories"
                    :label="t('Category')"
                    v-model="form.category"
                    :placeholder="'--'+t('Select Category')+'--'"
                    :options="categories"
                    @change="loadProduct"
                />
              </div>
              <div class="col-md-3">
                <label class="label">{{ $t('Products') }} </label>
                <multiselect
                    v-model="selected_product"
                    :options="products"
                    label="name"
                    valueProp="slack"
                    mode="single"
                    :searchable="true"
                    class="form-control form-control-solid p-0"
                />
              </div>
            </div>
          </div>
          <div class="col-12" v-if="form.search_type==2">
            <div class="row">
              <div class="col-md-3">
                <AsyncProductSearch
                    @select-product="addProduct"
                    :placeholder="labels.search_placeholder"
                    :selected_products="selected_product_slack"
                    :button_placeholder="labels.add_service"
                    :is_stocable_products="1"
                    :not_recipe="1"
                    :only_available="1"
                    :is_stock_adjustment="1"
                    :selected_branch_id="props.sel_branch_id"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <Form @submit="update" :validation-schema="schema" :initial-values="form" id="products_submit">
            <div class="col-12 py-3">
              <div class="table-responsive">
                <table class="table table-condensed">
                  <thead>
                  <tr>
                    <th width="25%">{{ $t('Product') }}</th>
                    <!-- <th width="10%">{{ $t('SKU') }}</th> -->
                    <th width="10%">{{ $t('Current Quantity') }}</th>
                    <th width="10%">{{ $t('Stock Action') }}</th>
                    <th width="10%">{{ $t('Quantity') }}<span class="text-danger">*</span></th>
                    <th width="10%">{{ $t('Purch. Price') }}</th>
                    <th width="10%">{{ $t('Purch. Total Amt') }}<span class="text-danger">*</span></th>
                    <th width="15%">{{ $t('Reason') }}<span class="text-danger">*</span></th>
                    <th width="15%">{{ $t('Custom Reason') }}</th>
                    <th width="5%" class="text-center" v-if="props.stock_adjustment.status<2">{{ $t('Remove') }}</th>
                  </tr>
                  </thead>
                  <tbody>

                  <tr v-if="form.stock_adjustment_products.length>0" v-for="(stock_adjustment_product,index) in form.stock_adjustment_products" :key="index">
                    <td><strong>{{  stock_adjustment_product.product_name }}</strong></td>
                    <!-- <td>
                      <VTextField
                          type="text"
                          name="sku"
                          v-model="stock_adjustment_product.sku"
                          :disabled="props.stock_adjustment.status>1"
                      />
                    </td> -->
                    <td>
                      <VTextInput
                          type="number"
                          :name="'stock_adjustment_products['+index+'].max_quantity'"
                          v-model="stock_adjustment_product.max_quantity"
                          disabled
                          :islabel=false
                          :class="'mt-3'"
                      />
                    </td>
                    <td>
                      <!-- <Field :name="'stock_adjustment_products['+index+'].action'" v-slot="{ field, meta, errors }" v-model="stock_adjustment_product.action">
                        <select v-bind="field" class="form-control  form-control-solid" >
                          <option value="1">{{ $t('Increment') }}</option>
                          <option value="2">{{ $t('Decrement') }}</option>
                        </select>
                      </Field>
                      <ErrorMessage  :name="'stock_adjustment_products['+index+'].action'" as="div" class="error"></ErrorMessage>  -->
                      <VSelectInput
                            v-model="stock_adjustment_product.action" :class="mt3"
                            :name="'stock_adjustment_products['+index+'].action'"
                            :options="actions"
                            :islabel="false"
                      />
                    </td>
                    <td>
                      <VTextInput
                          type="number"
                          :name="'stock_adjustment_products['+index+'].quantity'" @input="calculateTotal(index)"
                          v-model="stock_adjustment_product.quantity"
                          :max="stock_adjustment_product.max_quantity" min="1"
                          :disabled="props.stock_adjustment.status>1"
                          :islabel=false
                          :class="'mt-3'"
                      />
                    </td>
                    <td>
                      <VTextInput
                          type="number"
                          :name="'stock_adjustment_products['+index+'].purchase_price'" @input="calculateTotal(index)"
                          v-model="stock_adjustment_product.purchase_price"
                          :disabled="props.stock_adjustment.status>1"
                          :islabel=false
                          :class="'mt-3'"
                      />
                    </td>
                    <td>
                      <VTextInput
                          type="number"
                          :name="'stock_adjustment_products['+index+'].item_total'"
                          v-model="stock_adjustment_product.item_total"
                          :disabled="props.stock_adjustment.status>1"
                          :islabel=false
                          :class="'mt-3'" readonly
                      />
                    </td>
                    <td>
                      <!-- <VSelectInput
                            v-model="stock_adjustment_product.reason" :class="mt3"
                            :name="'stock_adjustment_products['+index+'].reason'"
                            :options="reasons"
                            :islabel="false"
                      /> -->
                      <Field :name="'stock_adjustment_products['+index+'].reason'" v-slot="{ field, meta, errors }" v-model="stock_adjustment_product.reason">
                        <select v-bind="field" class="form-control form-control-solid" @change="reasonChange(index)">
                          <option value="Stock On Fire">{{ $t('Stock On Fire') }}</option>
                          <option value="Stolen Goods">{{ $t('Stolen Goods') }}</option>
                          <option value="Damaged Goods">{{ $t('Damaged Goods') }}</option>
                          <option value="Stock Written Off">{{ $t('Stock Written Off') }}</option>
                          <option value="Inventory Revaluation">{{ $t('Inventory Revaluation') }}</option>
                          <option value="Custom">{{ $t('Custom') }}</option>
                        </select>
                      </Field>
                      <ErrorMessage  :name="'stock_adjustment_products['+index+'].reason'" as="div" class="error"></ErrorMessage>
                    </td>
                    <td>
                      <VTextInput
                          type="text"
                          :name="'stock_adjustment_products['+index+'].custom_reason'"
                          v-model="stock_adjustment_product.custom_reason"
                          :disabled="stock_adjustment_product.reason != 'Custom'"
                          :class="'mt-3'"
                          :islabel=false
                      />
                    </td>
                    <td class="text-center" v-if="props.stock_adjustment.status<2">
                      <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeProduct(stock_adjustment_product)">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                      </a>
                    </td>
                  </tr>
                  <tr v-else>
                    <td colspan="10" class="text-center">{{ $t('No Product Available') }}</td>
                  </tr>

                  </tbody>

                </table>
              </div>
            </div>
            <div class="col-12 py-3" v-if="form.server_messages.messages != ''">
              <ServerMessage  :server_messages="form.server_messages"  />
            </div>
            <div class="row mt-2 justify-content-end" v-if="props.stock_adjustment.status == 1">
              <div class="col-auto">
                <button type="button" class="btn btn-primary dev_product_submit" :disabled="form.is_submitting || form.stock_adjustment_products.length==0" 
                  @click="submit_products(1)">
                  <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 ">  </clip-loader>
                  <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
                  <span class="pt-0" v-else> {{ $t('Save') }}</span>
                </button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-success dev_product_submit" :disabled="form.is_submitting || form.stock_adjustment_products.length==0" 
                  @click="submit_products(2)">
                  <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 ">  </clip-loader>
                  <span class="pt-0" v-if="form.is_submitting">{{ $t('Approving...') }}</span>
                  <span class="pt-0" v-else>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.6364 1L4.63636 9L1 5.36364" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" strock="currentColor"/>
                    </svg>
                    {{ $t('Approve') }}</span>
                </button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-danger dev_product_submit" :disabled="form.is_submitting || form.stock_adjustment_products.length==0" 
                  @click="submit_products(3)">
                  <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 ">  </clip-loader>
                  <span class="pt-0" v-if="form.is_submitting">{{ $t('Rejecting...') }}</span>
                  <span class="pt-0" v-else> 
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 1L1 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1 1L9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('Reject') }}</span>
                </button>
              </div>
            </div>
            <button type="submit" class="d-none" :disabled="form.is_submitting" id="submit_btn"></button>
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
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    
    import { useAuthStore } from '@/stores/auth';
    import {onMounted, reactive, ref, watch} from "vue";
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const labels = ref({
      search_placeholder: t("Search and Add Product"),
      add_service: t("Add Service"),
    });
    const AsyncProductSearch = defineAsyncComponent(() => import('@/components/common/ProductSearchByBranch.vue'));

    const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
      search_type:2,

      stock_adjustment_products: [],
      adjustment_status : 1,
    };
    const form = reactive({ ...initialState });


  const schema = yup.object().shape({
    stock_adjustment_products: yup.array(yup.object({
      action:yup.string().required(t('name is required', { name: t('Action') })),
      reason:yup.string().required(t('name is required', { name: t('Reason') })),
      quantity:yup.number()
        .typeError(t('must be a number',{ name: t('Quantity') }))
        // .required(t('name is required', { name: t('Quantity') }))
        //.positive(t('must be a positive number', { name: t('Quantity') }))
        .when('action', {
          is: (val) => val == 2,
          then: (schema) => schema
            .positive(t('must be a positive number', { name: t('Quantity') }))
            .required(t('name is required', { name: t('Quantity') }))
            .test({
              name: 'max',
              exclusive: false,
              params: { },
              //message: t('must be greater than or equal to n',{ name:t('Quantity'), number:$('[name="'+`${context.path}+'"]').attr("max")}),
              test: function (value,context) {
                  var max = $('[name="'+context.path+'"]').attr("max");
                  return value <= parseFloat(max) ?true: context.createError({path:`${context.path}`, message:t('must be less than or equal to n',{ name:t('Quantity'), number:max }) });
              },
            }),
          otherwise:(schema) => schema.positive(t('must be a positive number', { name: t('Quantity') })).required(t('name is required', { name: t('Quantity') }))
        })
    },['quantity','action'])).required(),
    
  });


    const actions = ref([
      { id : 1, name : 'Increment'},
      { id : 2, name : 'Decrement'}
    ]);

    const reasons = ref([
      { id : 'Stock On Fire', name : t('Stock On Fire')},
      { id : 'Stolen Goods', name : t('Stolen Goods')},
      { id : 'Damaged Goods', name : t('Damaged Goods')},
      { id : 'Stock Written Off', name : t('Stock Written Off')},
      { id : 'Inventory Revaluation', name : t('Inventory Revaluation')},
      { id : 'Custom', name : t('Custom')}
    ]);

    const props = defineProps(['stock_adjustment', 'sel_branch_id']);
    const is_loading = ref(false);
    const multiselect = defineComponent( Multiselect);
    const selected_product = ref('');
    const selected_product_slack = ref([]);

    onMounted(() => {
      loadTableData();
      loadCategory();
    });

    function loadTableData(){
      _.forEach(props.stock_adjustment.stock_adjustment_products, (value) => {
        selected_product_slack.value.push(value.product.slack);
        let product_template = {
          product_slack : value.product.slack,
          product_name : value.product.name,
          // sku : value.sku,
          purchase_price : value.purchase_price,
          action : value.action,
          reason : value.reason,
          custom_reason : value.custom_reason,
          max_quantity : value.selected_branch_stock,
          quantity : value.quantity,
          item_total : value.quantity * value.purchase_price,
        };
        form.stock_adjustment_products.push(product_template);
      })
    }

    async function changeSearch(event){
      form.search_type = event.target.value;
      loadCategory();
      loadProduct();
    }

    const categories = ref([]);
    async function loadCategory(){
      categories.value = [];
      let category_data = await axios.get('api/categories/all');
      category_data = category_data.data.data;
      _.forEach(category_data, (item) => {
        let template = {
          'key': item.slack,
          'value': item.code+' - '+item.name,
        };
        categories.value.push(template);
      })
    }

    const products = ref([]);
    const all_product = ref([]);

    async function loadProduct(){
      products.value = [];
      let product_data = await axios.get('api/products/all',{
        params : {category : form.category, only_available : 1, is_stocable_products:1, not_recipe:1, branch_id:props.sel_branch_id }
      });
      products.value = product_data.data.data;
      check_product_in_list();
      all_product.value = JSON.parse(JSON.stringify(product_data.data.data));
    }

    function check_product_in_list(){      

      form.stock_adjustment_products.map(function (value2,key2){
        let index_val = products.value.findIndex(x => x.slack === value2.product_slack);
        if(index_val>-1){
          products.value.splice(index_val, 1);
        }
      });
    }

    const sel_product =ref();
    watch(selected_product, (value) => {
      addProductForAdjustment(value);
    })


    function reasonChange(index){
      if(form.stock_adjustment_products[index].reason != 'Custom'){
        form.stock_adjustment_products[index].custom_reason = '';
      }
    }
    function calculateTotal(index){
      let qty = parseFloat(form.stock_adjustment_products[index].quantity);
      if(isNaN(qty)){
        qty = 0;
      }
      let total_purch_price = parseFloat(form.stock_adjustment_products[index].purchase_price) * qty;
      // product_detail.item_total = total_purch_price;
      form.stock_adjustment_products[index].item_total = total_purch_price;
      return total_purch_price;
    }

    function addProductForAdjustment(value){
      products.value.findIndex(function (entry, i) {
        if (entry.slack == value) {
          sel_product.value = entry;
        }
      });
      if(sel_product.value != null){
        if(isNaN(sel_product.value.purchase_price)){
          sel_product.value.purchase_price = 0;
        }
        selected_product_slack.value.push(sel_product.value.slack);
        let product_template = reactive({
          product_slack : sel_product.value.slack,
          product_name : sel_product.value.name,
          // sku : sel_product.value.sku,
          purchase_price : sel_product.value.purchase_price,
          action : '',
          reason : '',
          custom_reason : '',
          max_quantity : sel_product.value.quantity,
          quantity : '',
          item_total : '',
        });
        form.stock_adjustment_products.push(product_template);
        products.value.splice(products.value.findIndex(x => x.slack === selected_product.value), 1);
      }
    }

    function addProduct(clicked_product){
      if(isNaN(clicked_product.purchase_price)){
        clicked_product.purchase_price = 0;
        }
      selected_product_slack.value.push(clicked_product.slack);
      let product_template = reactive({
        product_slack : clicked_product.slack,
        product_name : clicked_product.name,
        // sku : clicked_product.sku,
        purchase_price : clicked_product.purchase_price,
        action : '',
        reason : '',
        custom_reason : '',
        max_quantity : clicked_product.quantity,
        quantity : '',
        item_total : '',
      });
      form.stock_adjustment_products.push(product_template);
    }

    function removeProduct(stock_adjustment_product){
      form.stock_adjustment_products.splice(form.stock_adjustment_products.indexOf(stock_adjustment_product), 1);
      selected_product_slack.value.splice(selected_product_slack.value.indexOf(stock_adjustment_product.product_slack), 1);
      let product =  _.find(all_product.value, (value) => {
        return value.slack == stock_adjustment_product.product_slack
      });
      if(product !== "undefined"){
        products.value.push(product);
      }
      loadCategory();
      loadProduct();
    }
    function submit_products(btn_val){
      
      form.adjustment_status = btn_val;
      document.getElementById("submit_btn").click();
    }
    //update
    async function update(){
      form.is_submitting = true;
      var form_data = new FormData();
      form_data.append('stock_adjustment_slack',props.stock_adjustment.slack);
      form_data.append('status',form.adjustment_status );
      form_data.append('products',JSON.stringify(form.stock_adjustment_products));
      await axios.post('/api/stock_adjustment/product/update', form_data).then( (response) => {
        if(response.data.status_code == 200) {
          toast.success(response.data.msg);
          setInterval(() => {
            window.location.href = '/stock_adjustments';
          }, 2000);
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
</script>