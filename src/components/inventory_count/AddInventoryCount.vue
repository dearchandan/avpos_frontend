<template>
    <Form :validation-schema="schema" @submit="saveInventoryCount" enctype="multipart/form-data" :initial-values="form"
      v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)">
      <div class="row">
        <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''"
                            :server_messages="form.server_messages"/>
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="row">
              
                  <div class="col-4 col-md-3 col-lg-2">
                    <VTextInput
                        type="text"
                        name="reference_no"
                        v-model="form.reference_no"
                        :label="labels.reference_no"
                    />
                  </div>
  
                </div>
              </div>
            </div>
  
            <div class="col-md-12">
              <div class="card">
                <div class="row">
  
                  <h5 class="section-title pb-2 text-muted">{{ $t('Products') }}:</h5>
                  <div class="col-md-4 mb-4">
                    <AsyncProductSearch
                        @select-product="addProduct"
                        :placeholder="labels.search_placeholder"
                        :selected_products="selected_products"
                        :button_placeholder="labels.add_service"
                    />
                  </div>
                  <!--  Table goes here! -->
                  <div class="table-responsive">
                    <table class="table table-hover table-bordered mb-3 table-responsive-data">
                      <thead class="bg-light">
                      <tr>
                        <th>{{ $t('Product') }}</th>
                        <th class="text-center">{{ $t('System Quantity') }}</th>
                        <th class="text-center">{{ $t('Counted Quantity') }}</th>
                        <th class="text-center">{{ $t('Remove') }}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-if="form.inventory_count_items.length>0" v-for="(inventory_count_item,index) in form.inventory_count_items" :key="index">
                        <input type="hidden" name="product_name" v-model="inventory_count_item.product_name">
                        <input type="hidden" name="product.slack" v-model="inventory_count_item.product_slack">
                        <td data-title="Search Product" width="20%" v-if="inventory_count_item.type==1">
                          {{  inventory_count_item.product_name }}
                          <Field type="hidden" :name="'inventory_count_items['+index+'].product_name'" :value="inventory_count_item.product_name" ></Field>
                          <ErrorMessage :name="'inventory_count_items['+index+'].product_name'" as="div" class="error"></ErrorMessage>
                        </td>
                        <td data-title="Search Product" width="20%" v-else>
                          <VTextInput
                              type="text"
                              :name="'inventory_count_items['+index+'].product_name'"
                              label=""
                              v-model="inventory_count_item.product_name"
                          />
                        </td>
                        <td data-title="System Quantity" width="15%" >
                          <VTextInput
                              type="number"
                              :name="'inventory_count_items['+index+'].system_quantity'"
                              label=""
                              readonly
                              v-model="inventory_count_item.system_quantity"
                          />
                        </td>
                        <td data-title="Counted Quantity" width="15%" >
                          <VTextInput
                              type="number"
                              :name="'inventory_count_items['+index+'].counted_quantity'"
                              label=""
                              v-model="inventory_count_item.counted_quantity"
                          />
                        </td>
                     
                        <td data-title="Action" width="5%" class="text-center">
                          <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeProduct(inventory_count_item)">
                              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                            </a>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
  
            <div class="col-md-12">
              <div class="card">
                <div class="row">
                  <h5 class="section-title text-muted">{{ $t('Note/Terms and Conditions') }}:
                    <label for="" class="text-warning h6">{{ terms_character_count }}</label>
                  </h5>
                  <div class="col-12">
                    <textarea maxlength="500"
                        class="form-control form-control-solid text-area"
                        name="terms"
                        v-model="form.terms"
                        rows="1"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-warning" :disabled="form.is_submitting" @click="submit_type = 0">
          <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
          <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
          <span class="pt-0" v-else>{{ $t('Save as draft') }}</span>
        </button>
        <button type="submit" class="btn btn-primary ms-2" :disabled="form.is_submitting" @click="submit_type = 1">
          <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
          <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
          <span class="pt-0" v-else>{{ $t('Submit') }}</span>
        </button>
      </div>
    </Form>
    <EditFormSkeleton v-else />
  
  </template>
  
  
  <script setup>
  
  import { Form, Field, ErrorMessage } from 'vee-validate'
  import * as yup from 'yup';
  import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
  import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
  
  import { useAuthStore } from '@/stores/auth';
  import {onMounted, reactive, ref, watch} from "vue";
  import {useRoute} from "vue-router";
  import { useI18n } from 'vue-i18n'
  
  const submit_type = ref(0);

  const { t } = useI18n();
  const labels = ref({
    search_placeholder: t("Search and Add Product"),
    reference_no: t('Reference No.'),
  });
  
  const AsyncServerMessage = defineAsyncComponent(() => import('@/components/common/ServerMessage.vue'));
  const AsyncProductSearch = defineAsyncComponent(() => import('@/components/common/ProductSearch.vue'));
  
  const route = useRoute();
  const slack = route.params.slack;
  const inventory_count = ref([]);
  const auth = useAuthStore();
  
  const initialState = {
    server_messages: {
      type: "",
      messages: "",
    },
    is_submitting: false,
  
    // form data   
    slack: "",
    reference_no: "",
    terms: "",
    inventory_count_items: [],
  };
  
  const form = reactive({...initialState});
  
  const schema = yup.object().shape({
    reference_no: yup.number().typeError(t('must be a number',{ name: t('PO Reference') })).nullable().moreThan(0, "PO Reference cannot be negative")
        .transform((_, val) => (val !== "" ? Number(val) : null)),
    inventory_count_items: yup.array(yup.object({
      product_name: yup.string().required(t('name is required', { name: t('Product Name') })),
      counted_quantity:yup.number().typeError(t('must be a number',{ name: t('Quantity') })).required(t('name is required', { name: t('Quantity') })).positive(t('must be a positive number', { name: t('Quantity') }))
    })).required(),
  });
  
  onMounted(() => {
    getPOAddData();
    if(slack!=null){
      getInventoryCount();
    }
  });
  
  async function getPOAddData(){
    
    let add_data = await axios.get('api/v2/inventory_count/add');
    form.reference_no = add_data.data.data.reference_no;
  
  }

  const is_loaded = ref(false);
  async function getInventoryCount(){
    await axios.get('/api/v2/inventory_count', { params : {
        slack : slack,
      } }).then( (response) => {
        // console.log(response,'response');
        // return false;
      is_loaded.value = true;
      inventory_count.value = response.data.data;
      form.slack = inventory_count.value.slack;
      form.reference_no = inventory_count.value.reference_no;
      form.status = inventory_count.value.status;
      form.terms = inventory_count.value.terms;
      if(inventory_count.value.items.length > 0)
      {
        form.inventory_count_items = [];
        for(var i = 0;i < inventory_count.value.items.length;i++)
        {
          let product_template = reactive({
            product_slack : inventory_count.value.items[i].product_slack,
            product_name : inventory_count.value.items[i].product_name,
            system_quantity : inventory_count.value.items[i].system_quantity,
            counted_quantity : inventory_count.value.items[i].counted_quantity,
          });
          form.inventory_count_items.push(product_template);
        }
      }
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
  
  }
  
  const selected_products = ref([]);
  
  function addProduct(clicked_product){
    selected_products.value.push(clicked_product.slack);
    //HERE Type=1 PRODUCT
    let product_template = reactive({
      type:1,
      product_slack : clicked_product.slack,
      product_name : clicked_product.name,
      system_quantity : clicked_product.quantity,
      counted_quantity : 0,
    });
    form.inventory_count_items.push(product_template);

}
  
  function removeProduct(inventory_count_item){
    form.inventory_count_items.splice(form.inventory_count_items.indexOf(inventory_count_item), 1);
    selected_products.value.splice(selected_products.value.indexOf(inventory_count_item.product_slack), 1);
  }
  
  async function saveInventoryCount() {
    form.is_submitting = true;
    var form_data = new FormData();
    form_data.append('ic_slack', form.slack);
    form_data.append('reference_no', form.reference_no);
    form_data.append('terms', form.terms);
    form_data.append('products', JSON.stringify(form.inventory_count_items));
    form_data.append('status', submit_type.value);

    var submit_url = (form.slack!='' && form.slack!=undefined)?'/api/v2/inventory_count/update':'/api/v2/inventory_count/save';
    await axios.post(submit_url, form_data).then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;
        router.push('/inventory_counts');
      } else {
        try {
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
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
  
  const terms_character_count = computed(() => {
    if(form.terms =='' || form.terms == null){
      return 0+' / 500 Characters';
    }else{
      return form.terms.length+' / 500 Characters';
    } 
  });
  
  </script>