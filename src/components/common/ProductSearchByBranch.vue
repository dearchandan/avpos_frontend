<template>

  <Form>
    <div class="row">
      <div :class="is_button?'col-md-8':'col-md-12'">
        <div class="field-icon mb-4">
          <div class="form-field position-relative mb-0">
            <input type="search" class="form-control form-control-solid" :placeholder="placeholder" v-model="form.search_query">
            <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
            <div v-if="form.is_listing">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else class="">
              <ul class="recent-search" v-if="products.length>0">
                <li v-if="products != ''" v-for="(product,product_index) in products" :key="product_index">
                  <a href="javascript:;" @click="emit('selectProduct', product),clearSearch()">
                  <h2>{{product.name}}</h2>
                  <div class="wpr">
                    <h4>{{ $t("Code") }}: {{product.code}}</h4>
                    <h4 class="pr" v-if="product.sale_price>0">{{product.sale_price}} SAR</h4>
                  </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4" v-if="is_button">
        <button type="button" class="btn btn-primary" @click="emit('selectService', form.search_query)">
          <span class="pt-0">{{ button_placeholder }}</span>
        </button>
      </div>
    </div>
  </Form>

</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import { useAuthStore } from '@/stores/auth';
import {onMounted, reactive, ref, watch} from "vue";
import { provide } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,
};
const form = reactive({...initialState});
watch(() =>
        form.search_query, _.debounce( () => {
      getProducts();
    },500),
);


const props = defineProps({
  product_type : String,
  selected_products: {
    type: Array,
    default: []
  },
  selected_branch_id: {
    type: Array,
    default: []
  },
  placeholder:{
    type: String,
    default: "Search Product",
  },
  is_button:{
    type: Boolean,
    default: false,
  },
  button_placeholder:{
    type: String,
    default: "Add",
  },
  not_recipe:{
    type: Number,
    default: 0,
  },
  only_available:{
    type: Number,
    default: 0,
  },
  is_stocable_products:{
    type: Number,
    default: 0,
  },
  is_stock_adjustment:{
    type: Number,
    default: 0,
  },
});

const placeholder = props.placeholder;
const button_placeholder = props.button_placeholder;

const products = ref([]);

async function getProducts(){

  form.is_listing = true;
  if(form.search_query!=''){
    await axios.get('/api/products/all', { params : {
        search_query : form.search_query,
        limit : 10,
        product_type: props.product_type,
        except_products: props.selected_products,
        not_recipe: props.not_recipe,
        is_stocable_products: props.is_stocable_products,
        only_available: props.only_available,
        branch_id: props.selected_branch_id,
        is_stock_adjustment: props.is_stock_adjustment,
      } }).then( (response) => {

      products.value = response.data.data;
      form.is_listing = false;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
  }else{
    products.value = [];
    form.is_listing = false;
  }
}

function clearSearch(){
  products.value = [];
}

const emit = defineEmits(['selectProduct','selectService']);

</script>