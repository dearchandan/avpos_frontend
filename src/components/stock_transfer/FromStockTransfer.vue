<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <h5 class="section-title text-muted">{{ $t('Products Details') }}:</h5>
        <div class="row" v-if="props.stock_transfer.status<2">
          <div class="form-field">
            <div class="d-flex align-items-center flex-wrap">
              <label class="me-3 mt-3">
                <input class="form-check-input me-1" type="radio" name="search_type" checked="" v-model="form.search_type" :value="1" @click="changeSearch">{{ $t('Search by Category') }}
              </label>
              <label class="mt-3">
                <input class="form-check-input me-1" type="radio" name="search_type" v-model="form.search_type" :value="2" @click="changeSearch">{{ $t('Search by Product Name') }}
              </label>
            </div>
          </div>
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
                <div class="form-field">
                  <label class="label">{{ $t('Products') }} </label>
                  <multiselect
                      :options="products"
                      label="name"
                      valueProp="slack"
                      mode="single"
                      :searchable="true"
                      class="form-control form-control-solid"
                      v-on:change="getProductName($event)"
                  />
                </div>
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
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <Form
              @submit="update"
              :validation-schema="schema"
              :initial-values="form"
          >
            <div class="col-12 py-3">
              <div class="table-responsive">
              <table class="table table-condensed">
                <thead>
                <tr>
                  <th width="40%">{{ $t('Product') }}</th>
                  <th width="5%">{{ $t('UPC') }}</th>
                  <th width="5%">{{ $t('SKU') }}</th>
                  <th width="10%">{{ $t('Sale Price') }}</th>
                  <th width="10%">{{ $t('Quantity') }}<span class="text-danger">*</span></th>
                  <th width="10%" v-if="props.stock_transfer.status==2 || props.stock_transfer.status==3">{{ $t('Accepted Quantity') }}</th>
                  <th width="10%" v-if="props.stock_transfer.status==2 || props.stock_transfer.status==3">{{ $t('Rejected Quantity') }}</th>
                  <th width="10%" v-if="props.stock_transfer.status==2 || props.stock_transfer.status==3">{{ $t('Rejected Reason') }}</th>
                  <th width="10%" class="text-center" v-if="props.stock_transfer.status<2">{{ $t('Remove') }}</th>
                </tr>
                </thead>
                <tbody>

                <tr v-if="form.stock_transfer_products.length>0" v-for="(stock_transfer_product,index) in form.stock_transfer_products" :key="index">
                  <td><strong>{{  stock_transfer_product.product_name }}</strong></td>
                  <td>{{  stock_transfer_product.upc }}
                  </td>
                  <td>
                    <VTextInput
                        type="text"
                        name="sku"
                        v-model="stock_transfer_product.sku"
                        :disabled="props.stock_transfer.status>1"
                        :islabel=false
                        :class="'mt-0'"
                    />
                  </td>
                  <td>
                    <VTextInput
                        type="number"
                        :name="'stock_transfer_products['+index+'].sale_price'"
                        v-model="stock_transfer_product.sale_price"
                        :disabled="props.stock_transfer.status>1"
                        :islabel=false
                        :class="'mt-0'"
                    />
                  </td>
                  <td>
                    <VTextInput
                        type="number"
                        :name="'stock_transfer_products['+index+'].quantity'"
                        v-model="stock_transfer_product.quantity"
                        :max="stock_transfer_product.max_quantity"
                        min="0"
                        :disabled="props.stock_transfer.status>1"
                        :islabel=false
                        :class="'mt-0'"
                    />
                  </td>
                  <td v-if="props.stock_transfer.status==2 || props.stock_transfer.status==3">
                    {{ stock_transfer_product.accepted_quantity }}
                  </td>
                  <td v-if="props.stock_transfer.status==2 || props.stock_transfer.status==3">
                    {{ stock_transfer_product.rejected_quantity }}
                  </td>
                  <td class="text-center" v-if="props.stock_transfer.status==2 || props.stock_transfer.status==3">
                    <VSelect v-if="stock_transfer_product.rejected_quantity > 0"
                          :name="'stock_transfer_products['+index+'].rejected_reason'"
                          v-model="stock_transfer_product.rejected_reason"
                          :options="rejection_options"
                          :islabel=false
                          :disabled="true"
                      />
                      <span v-else> -- </span>
                      <input type="text" :class="'mt-2'"
                          v-model="stock_transfer_product.other_reason"
                          v-if="stock_transfer_product.rejected_reason == 4"
                          class="form-control form-control-solid"
                          :title="stock_transfer_product.other_reason"
                          :disabled="true"
                      />
                  </td>
                  <td class="text-center" v-if="props.stock_transfer.status<2">
                    <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeProduct(stock_transfer_product)">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                     </a>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="6">{{ $t('No Product Available') }}</td>
                </tr>

                </tbody>

              </table>
            </div>
            </div>
            <div class="col-12 py-3" v-if="form.server_messages.messages != ''">
              <ServerMessage  :server_messages="form.server_messages"  />
            </div>
            <div class="col-12 mt-2 text-end" v-if="props.stock_transfer.status<2">
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
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    
    import { useAuthStore } from '@/stores/auth';
    import {onMounted, reactive, ref, watch} from "vue";
    import { useI18n } from 'vue-i18n'
    const authStore = useAuthStore();
    const { t } = useI18n();
    const labels = ref({
      search_placeholder: t("Search and Add Product"),
      add_service: t("Add Service"),
    });
    const AsyncProductSearch = defineAsyncComponent(() => import('@/components/common/ProductSearch.vue'));

    const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
      search_type:1,

      stock_transfer_products: []
    };
    const form = reactive({ ...initialState });

    const schema = yup.object({
         stock_transfer_products: yup.array(yup.object({
            quantity:yup.number().typeError(t('must be a number',{ name: t('Quantity') })).required(t('name is required', { name: t('Quantity') })).positive(t('must be greater than zero', { name: t('Quantity') })).test({
              name: 'max',
              exclusive: false,
              params: { },
              //message: t('must be greater than or equal to n',{ name:t('Quantity'), number:$('[name="'+`${context.path}+'"]').attr("max")}),
              test: function (value,context) {
                 var max = $('[name="'+context.path+'"]').attr("max");
                 return value <= parseFloat(max) ?true: context.createError({path:`${context.path}`, message:t('must be less than or equal to n',{ name:t('Quantity'), number:max }) });

              },
            }),
        })).required()
    });

    const props = defineProps(['stock_transfer']);
    const is_loading = ref(false);
    const multiselect = defineComponent(
        Multiselect
    )
    const selected_product = ref('');
    const selected_product_slack = ref([]);

    onMounted(() => {
      loadTableData();
      loadCategory();
    });

    const rejection_options = ref([
        {
            key: 1, 
            value: 'Wastage/Damaged', 
        },{
            key: 2, 
            value: 'Undelivered', 
        },
        {
            key: 3, 
            value: 'No Reason', 
        },
        {
            key: 4, 
            value: 'Other', 
        }
    ]);

    function loadTableData(){
      _.forEach(props.stock_transfer.stock_transfer_products, (value) => {
        selected_product_slack.value.push(value.product.slack);
        let product_template = {
          product_slack : value.product.slack,
          product_name : value.product.name,
          sku : value.sku,
          upc : value.product.upc,
          sale_price : value.sale_price,
          max_quantity : value.product.this_branch_inventory.quantity,
          quantity : value.quantity,
          accepted_quantity : value.accepted_quantity,
          rejected_quantity : value.rejected_quantity,
          rejected_reason: value.rejected_reason,
          other_reason: value.other_reason,
        };
        form.stock_transfer_products.push(product_template);
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
        params : {category : form.category, only_available : 1, is_stocable_products:1, not_recipe:1, branch_slack:authStore.user.login_branch.slack }
      });
      products.value = product_data.data.data;
      check_product_in_list();
      all_product.value = JSON.parse(JSON.stringify(product_data.data.data));
    }

    function check_product_in_list(){
     // console.log(products.value);

      form.stock_transfer_products.map(function (value2,key2){
        let index_val = products.value.findIndex(x => x.slack === value2.product_slack);
        if(index_val>-1){
          products.value.splice(index_val, 1);
        }
      });
    }

    const sel_product =ref();
    // watch(selected_product, (value) => {   
    //   addProductForTransfer(value);
    //   loadProduct();
    // });

    function getProductName(value){
      if(value != '' && value != null && value != undefined){
        selected_product.value = value;
        addProductForTransfer(value);
        loadProduct();
      }else{
        selected_product.value = '';
      }
    }

    function addProductForTransfer(value){
      products.value.findIndex(function (entry, i) {
        if (entry.slack == value) {
          sel_product.value = entry;
        }
      });

      if(sel_product.value != null && sel_product.value != undefined && sel_product.value != ''){
        selected_product_slack.value.push(sel_product.value.slack);
        let product_template = reactive({
          product_slack : sel_product.value.slack,
          product_name : sel_product.value.name,
          sku : sel_product.value.sku,
          upc : sel_product.value.upc,
          sale_price : sel_product.value.sale_price,
          max_quantity : sel_product.value.quantity,
          quantity : '',
        });

        form.stock_transfer_products.push(product_template);
        products.value.splice(products.value.findIndex(x => x.slack === selected_product.value), 1);
      }
    }

    function addProduct(clicked_product){
      selected_product_slack.value.push(clicked_product.slack);
      let product_template = reactive({
        product_slack : clicked_product.slack,
        product_name : clicked_product.name,
        sku : clicked_product.sku,
        upc : clicked_product.upc,
        sale_price : clicked_product.sale_price,
        max_quantity : clicked_product.quantity,
        quantity : '',
      });
      form.stock_transfer_products.push(product_template);
    }

    function removeProduct(stock_transfer_product){
      form.stock_transfer_products.splice(form.stock_transfer_products.indexOf(stock_transfer_product), 1);
      selected_product_slack.value.splice(selected_product_slack.value.indexOf(stock_transfer_product.product_slack), 1);
      let product =  _.find(all_product.value, (value) => {
        return value.slack == stock_transfer_product.product_slack
      });
      if(product !== "undefined"){
        products.value.push(product);
      }
      loadCategory();
      loadProduct();
    }

    //update
    async function update(){
      form.is_submitting = true;
      var form_data = new FormData();
      form_data.append('stock_transfer_slack',props.stock_transfer.slack);
      form_data.append('products',JSON.stringify(form.stock_transfer_products));
      await axios.post('/api/stock_transfer/product/update', form_data).then( (response) => {
        // form.is_submitting = false;
        if(response.data.status_code == 200) {
          toast.success(response.data.msg);
          setTimeout(() => {
            router.push('/stock_transfers');
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