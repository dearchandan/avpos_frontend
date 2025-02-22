<template>

  <Form>
    <div class="row">
      <div :class="is_button?'col-md-8':'col-md-12'">
        <div class="field-icon mb-4">
          <div class="form-field position-relative mb-0">
            <input type="search" 
                :class="[
                    height_sm ? 'form-control form-control-sm form-control-solid' : 'form-control form-control-solid',
                ]"
             :placeholder="placeholder" v-model="form.search_query">
            <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
            <div v-if="form.is_listing">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else class="">
              <ul class="recent-search" v-if="categories.length>0">
                <li v-for="(category,category_index) in categories" :key="category_index">
                  <a href="javascript:;" @click="emit('selectCategory', category),clearSearch()">
                  <h2>{{category.name}}</h2>
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
      getCategories();
    },500),
);


const props = defineProps({
  selected_categories: {
    type: Array,
    default: []
  },
  placeholder:{
    type: String,
    default: "Search Categories",
  },
  is_button:{
    type: Boolean,
    default: false,
  },
  height_sm :{
    type: [Boolean,String],
    required: false,
  },
  limit:{
    type: Number,
    default: "",
  },
});

const placeholder = props.placeholder;

const categories = ref([]);

async function getCategories(){

  form.is_listing = true;
  if(form.search_query!=''){
    await axios.get('/api/categories/all', { params : {
        search_query : form.search_query,
        limit: props.limit,
      } }).then( (response) => {

      categories.value = response.data.data;
      form.is_listing = false;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
  }else{
    categories.value = [];
    form.is_listing = false;
  }
}

function clearSearch(){
  categories.value = [];
  form.search_query = "";
}

const emit = defineEmits(['selectCategory']);

</script>