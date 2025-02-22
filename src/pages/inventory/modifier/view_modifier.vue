<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/modifiers" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Modifiers') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold"> {{ modifier.name  }} </h5>
                    </div>
                </div>
            </div>
        </template>
        <div class="content" v-if="is_modifier_loaded">
            <div class="page-heading">
                <div class="" v-if="form.server_messages.messages != ''">
                    <ServerMessage :server_messages="form.server_messages"  />
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="row">
                            <div class="col-12 text-end">
                                <a 
                                    class="btn btn-primary btn-sm mb-3" 
                                    href="#"
                                    data-bs-toggle="modal" 
                                    @click="openAddModifierOptionModal()" 
                                    data-bs-target="#addModifierOptionModal"
                                    >   
                                    + {{ $t('Add Option') }}
                                </a> 
                            </div>
                        </div>
                        <div v-if="is_options_listing">
                             <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <table v-else class="table table-condensed table-bordered">
                            <thead>
                                <tr>
                                    <th class="fw-bold" width="80%">{{ $t('Option') }}</th>
                                    <!-- <th class="fw-bold" width="10%">Sale Price</th> -->
                                    <th class="fw-bold" width="15%">{{ $t('Pricing Method') }}</th>
                                    <th scope="col" class="text-end" width="5%">{{ $t('Action') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="modifier_options != ''" v-for="(option,option_index) in modifier_options" :key="option_index">
                                    <td class="">
                                        
                                        <span class="fs-5">
                                            {{  option.option_name }} 
                                        </span>
                                        <span class="p-3" v-if="option.pricing_method == 1">{{ option.sale_price }} {{  currency_symbol  }} </span>
                                        <small v-if="option.option_name_ar != null"> ({{  option.option_name_ar }})</small>
                                        
                                        <a v-if="option.pricing_method == 2" role="button" class="p-3" data-bs-toggle="modal" @click="openAddModifierOptionItemModal(option.slack)" data-bs-target="#addModifierOptionItemModal"><u>+ {{ $t('Add Item') }}</u></a>
                                        

                                        <div class="mt-2" v-if="option.items.length">
                                            <div class="data-view-box mb-0" v-for="item in option.items">
                                                <div class="item">
                                                    <b>{{ item.product.name  }}</b>
                                                    <span>
                                                        {{ item.quantity  }} 
                                                        <span v-if="item.measurement_unit_id != null">{{  item.measurement_unit.unit_name  }}</span>
                                                        <span v-else>{{ $t('Units') }}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    
                                    </td>
                                    <!-- <td>{{  option.sale_price }}</td> -->
                                    <td>
                                        <span v-if="option.pricing_method == 1" class="badge badge-secondary" >
                                            {{ option.pricing_method_text  }}
                                        </span>
                                        <span v-else class="badge badge-dark text-dark" >
                                            {{ option.pricing_method_text  }}
                                        </span>
                                    </td>
                                    <td class="text-end">
                                        <div class="row flex-nowrap gx-2 text-end">
                                            <div class="col-auto">
                                                <a class="btn btn-icon btn-xs btn-light" href="#" data-bs-toggle="modal" @click="openAddModifierOptionModal(option)" data-bs-target="#addModifierOptionModal">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 512 512" class="iconify iconify--fa6-solid"><path fill="currentColor" d="m362.7 19.3l-48.4 48.4l130 130l48.4-48.4c25-25 25-65.5 0-90.5l-39.4-39.5c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2c-2.5 8.5-.2 17.6 6 23.8s15.3 8.5 23.7 6.1L151 475.7c14.1-4.2 27-11.8 37.4-22.2l233.3-233.2z"></path></svg>
                                                </a>
                                            </div>
                                            <div class="col-auto">
                                                 <a class="btn btn-icon btn-xs btn-light-danger" href="#" @click="deleteModifierOption(option.slack)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                                                 </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td class="text-center py-3" colspan="9">{{ $t('No Data Found') }}</td>
                                </tr>
                            </tbody>
                            
                        </table>
                    </div>
                </div>
            </div>

     
        </div>
        <ModifierDetailSkeleton v-else />

        <AsyncAddModifierOption :show_add_modifier_option_modal="show_add_modifier_option_modal" @closeAddModifierOptionModal="closeAddModifierOptionModal" :modifier_slack="slack" :edit_data="edit_data" />
        
        <AsyncAddModifierOptionItem :show_add_modifier_option_item_modal="show_add_modifier_option_item_modal" @closeAddModifierOptionItemModal="closeAddModifierOptionItemModal" :modifier_option_slack="option_slack" />

     </DefaultLayout>
</template>

<script setup>

import { Form } from 'vee-validate'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import {useRoute} from "vue-router";
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const auth = useAuthStore();
const currency_symbol = computed(() => {
    return auth.user.currency.symbol;
})
const AsyncAddModifierOption = defineAsyncComponent( () => import('@/components/modifier/AddModifierOption.vue') );
const AsyncAddModifierOptionItem = defineAsyncComponent( () => import('@/components/modifier/AddModifierOptionItem.vue') );

const route = useRoute();
const slack = route.params.slack;

const initialState = {
    server_messages: {
        type: "",
        messages: "",
    },
};

const form = reactive({ ...initialState });

onMounted(() => {
    refreshData();
});
    
function refreshData(){
    getModifier();
}

const is_options_listing = ref(false);
const modifier = ref([]);
const modifier_options = ref([]);
const show_add_modifier_option_modal = ref(false);
const edit_data = ref([]);
function openAddModifierOptionModal(editData = ''){
    if(editData == '')
        edit_data.value = [];
    else
        edit_data.value = editData;
    show_add_modifier_option_modal.value = true; 
}

function closeAddModifierOptionModal(slack = ''){
  show_add_modifier_option_modal.value = false;
  refreshData();
  if(slack!=''){
    openAddModifierOptionItemModal(slack);
  }
}

const is_modifier_loaded = ref(false);
async function getModifier(){

    await axios.get('/api/modifier', { params : {
            slack : slack,
        } }).then( (response) => {
            
        modifier.value = response.data.data.modifier;
        modifier_options.value = response.data.data.modifier.options;
        is_modifier_loaded.value = true;
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
    });

}

const option_slack = ref('');
const modifier_option_items = ref([]);
const show_add_modifier_option_item_modal = ref(false);



function openAddModifierOptionItemModal(slack){
    document.getElementById('addModifierOptionItemForm').reset();
    option_slack.value = slack;
    show_add_modifier_option_item_modal.value = true;
    $('#addModifierOptionItemModal').modal('show');
}

function closeAddModifierOptionItemModal(){
    show_add_modifier_option_item_modal.value = false;
    refreshData(); 
}


async function deleteModifierOption(slack){

    var is_confirmed = false;

    await Swal.fire({
        title: t('Do you want to delete this item?'),
        showCancelButton: true,
        confirmButtonText: t('Yes, Delete'),
        confirmButtonColor: '#d33',
        cancelButtonText: t('Cancel'),
    }).then( (result) => {
        if(result.isConfirmed){
            is_confirmed = true;        
        }
    });

    if(is_confirmed){

        await axios.post('/api/modifier/option/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            Swal.fire(response.data.msg);
            refreshData();

        }else{
            try{
                form.server_messages.type = "error";
                form.server_messages.messages = JSON.parse(response.data.msg);
            }catch(err){
                form.server_messages.type = "error";
                form.server_messages.messages = response.data.msg;
            }
        }

        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            // console.log(error);
        });
    }

}

</script>