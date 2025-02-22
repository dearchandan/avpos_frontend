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
              <ul class="recent-search" v-if="modifiers.length>0">
                <li v-for="(modifier,modifier_index) in modifiers" :key="modifier_index">
                  <a href="javascript:;" @click="emit('selectProduct', modifier),clearSearch()">
                  <h2>{{modifier.name}}</h2>
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
      getModifiers();
    },500),
);


const props = defineProps({
  selected_modifiers: {
    type: Array,
    default: []
  },
  placeholder:{
    type: String,
    default: "Search Modifiers",
  },
  is_button:{
    type: Boolean,
    default: false,
  },
});

const placeholder = props.placeholder;

const modifiers = ref([]);

async function getModifiers(){

  form.is_listing = true;
  if(form.search_query!=''){
    await axios.get('/api/v2/modifier/all', { params : {
        search_query : form.search_query,
        except_modifiers: props.selected_modifiers,
        limit: 5,
      } }).then( (response) => {

      modifiers.value = response.data.data;
      form.is_listing = false;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_listing = false;
      console.log(error);
    });
  }else{
    modifiers.value = [];
    form.is_listing = false;
  }
}

function clearSearch(){
  modifiers.value = [];
}

const emit = defineEmits(['selectModifier']);

</script>