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
              <ul class="recent-search" v-if="suppliers.length>0">
                <li v-for="(supplier,supplier_index) in suppliers" :key="supplier_index">
                  <a href="javascript:;" @click="emit('selectSupplier', supplier),clearSearch()">
                  <h2>{{supplier.name}}</h2>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
      getSuppliers();
    },500),
);


const props = defineProps({
  selected_suppliers: {
    type: Array,
    default: []
  },
  placeholder:{
    type: String,
    default: "Search Supplier",
  },
  is_button:{
    type: Boolean,
    default: false,
  },
});

const placeholder = props.placeholder;
const button_placeholder = props.button_placeholder;

const suppliers = ref([]);

async function getSuppliers(){

  form.is_listing = true;
  if(form.search_query!=''){
    await axios.get('/api/v2/suppliers/all', { params : {
        search_query : form.search_query,
        except_suppliers: props.selected_suppliers,
        limit: 5,
      } }).then( (response) => {

      suppliers.value = response.data.data;
      form.is_listing = false;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
  }else{
    suppliers.value = [];
    form.is_listing = false;
  }
}

function clearSearch(){
  suppliers.value = [];
}

const emit = defineEmits(['selectSupplier']);

</script>