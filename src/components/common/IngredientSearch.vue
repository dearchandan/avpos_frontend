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
              <ul class="recent-search" v-if="ingredients.length>0">
                <li v-for="(ingredient,ingredient_index) in ingredients" :key="ingredient_index">
                  <a href="javascript:;" @click="emit('selectProduct', ingredient),clearSearch()">
                  <h2>{{ingredient.name}}</h2>
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
      getIngredients();
    },500),
);


const props = defineProps({
  selected_ingredients: {
    type: Array,
    default: []
  },
  placeholder:{
    type: String,
    default: "Search Ingredients",
  },
  is_button:{
    type: Boolean,
    default: false,
  },
});

const placeholder = props.placeholder;

const ingredients = ref([]);

async function getIngredients(){

  form.is_listing = true;
  if(form.search_query!=''){
    await axios.get('/api/ingredients/all', { params : {
        search_query : form.search_query,
        except_products: props.selected_ingredients,
        limit: 5,
      } }).then( (response) => {

      ingredients.value = response.data.data;
      form.is_listing = false;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
  }else{
    ingredients.value = [];
    form.is_listing = false;
  }
}

function clearSearch(){
  ingredients.value = [];
}

const emit = defineEmits(['selectProduct']);

</script>