<template>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="row">
            <div class="col-md-12 mb-3">
              <h5>{{ $t('Products') }}</h5>
            </div>
            <Form>
              <div class="col-12">
                <table class="table table-condensed">
                  <thead>
                  <tr>
                    <th width="10%">{{ $t('Item') }}</th>
                    <th width="10%" class="text-end">{{ $t('System Quantity') }}</th>
                    <th width="10%" class="text-end">{{ $t('Counted Quantity') }}</th>
                    <th width="10%" class="text-end">{{ $t('Discrepancy') }}</th>
                    <th width="10%" class="text-end">{{ $t('Discrepancy (%)') }}</th>
                  </tr>
                  </thead>
                  <tbody>
  
                  <tr v-if="inventory_count_items.length>0" v-for="(inventory_count_item,index) in inventory_count_items" :key="index">
                    <!--:disabled="inventory_count_item.status"-->
                    <td><strong>{{ inventory_count_item.product_name }}</strong></td>
                    <td class="text-end">{{ inventory_count_item.system_quantity }}</td>
                    <td class="text-end">{{ inventory_count_item.counted_quantity }}</td>
                    <td class="text-end">
                        <span class="text-success fw-bold" v-if="inventory_count_item.discrepancy_value > 0">+{{ inventory_count_item.discrepancy_value }}</span>
                        <span class="text-danger fw-bold" v-else>{{ inventory_count_item.discrepancy_value }}</span>
                    </td>
                    <td class="text-end">
                        <span class="text-success" v-if="inventory_count_item.discrepancy_value > 0">+{{ inventory_count_item.discrepancy_percentage }}</span>
                        <span class="text-danger" v-else>-{{ inventory_count_item.discrepancy_percentage }}%</span>
                    </td>
                  </tr>
                  <tr v-else>
                    <td colspan="8">{{ $t('No Item Available') }}</td>
                  </tr>
  
                  </tbody>
  
                </table>
              </div>
            
              <div class="col-12 py-3" v-if="form.server_messages.messages != ''">
                <ServerMessage  :server_messages="form.server_messages"  />
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
  import {onMounted, reactive, ref, toRef, watch} from "vue";
  import { useI18n } from 'vue-i18n'
  
  const { t } = useI18n();
  
  const initialState = {
    server_messages: {
      type: "",
      messages: "",
    }
  };
  const form = reactive({ ...initialState });
  const props = defineProps(['inventory_count']);
  const is_loading = ref(false);
  const inventory_count_items = ref([]);
  const inventory_count = toRef(props,'inventory_count');
  
  onMounted(() => {
    loadTableData();
  });
  
  function loadTableData(){
    console.log(inventory_count.value,'value');
    _.forEach(inventory_count.value.items, (value) => {
        let discrepancy = 0;
        if(value.counted_quantity < value.system_quantity){
            discrepancy = parseFloat(value.counted_quantity) - parseFloat(value.system_quantity);
        }else{
            discrepancy = parseFloat(value.system_quantity) - parseFloat(value.counted_quantity);
        }
      let product_template = {
        product_slack : value.product_slack,
        product_name : value.product_name,
        system_quantity : parseFloat(value.system_quantity).toFixed(2),
        counted_quantity : parseFloat(value.counted_quantity).toFixed(2),
        discrepancy_value : discrepancy,
        discrepancy_percentage : getPercentage(parseFloat(value.system_quantity),parseFloat(value.counted_quantity)),
      };
      inventory_count_items.value.push(product_template);
    });
  }

  function getPercentage(system_quantity,counted_quantity){
    let value = 0;
    if(counted_quantity > system_quantity){
        value = ((counted_quantity * 100) / system_quantity) - 100;    
    }else{
        value = 100 - ((counted_quantity * 100) / system_quantity);     
    }

    return value.toFixed(2);
  }
  
  </script>