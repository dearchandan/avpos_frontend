<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="" to="/products" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Products') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5>{{ product.name  }} </h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <div class="row">
                <div class="col-lg-3" >
                    <div class="card p-3 p-xl-4" v-if="is_product_detail_listed">
                        <div class="row flex-xl-nowrap align-items-center mb-3">
                            <div class="col-auto col-lg-12 col-xl-auto">
                                <div class="p-view-thumbnail">
                                    <img v-lazy="product.image_path" alt="" class="w-100 d-block"/>
                                </div>
                            </div>
                            <div class="col col-lg-12 col-xl">
                                <div class="p-view-head">
                                    <h2>{{ product.name }} <br v-if="product.name_ar != ''"> {{  product.name_ar  }} </h2>
                                    <h5 v-if="product.short_description">{{ product.short_description }}</h5>
                                    <h5 v-if="product.short_description_ar">{{ product.short_description_ar }}</h5>
                                </div>
                            </div>
                        </div>
                        <div class="row g-1 flex-nowrap flex-lg-wrap flex-xl-nowrap mb-1 mb-md-3">
                            <!-- <div class="col col-lg-12 col-xl">
                                <div class="pview-head-data">
                                    {{ $t('Default Purchase Price') }} <b class="d-block" v-if="product.purchase_price">{{ product.purchase_price }}  <span v-if="product.stock_measurement_unit">Per {{ product.stock_measurement_unit.abbreviation  }}</span> <span v-else>{{ $t('Per Unit') }}</span></b>
                                    <b v-else> - </b>
                                </div>
                            </div> -->
                            <div class="col col-lg-12 col-xl" >
                                <div class="pview-head-data">
                                    {{ $t('Default Sale Price') }} <b class="d-block" v-if="product.sale_price">{{ product.sale_price }} <span v-if="product.stock_measurement_unit">{{ $t('Per') }} {{ (language == 'ar' && product.stock_measurement_unit.abbreviation_ar != '' && product.stock_measurement_unit.abbreviation_ar != null)?product.stock_measurement_unit.abbreviation_ar:product.stock_measurement_unit.abbreviation  }}</span> <span v-else>{{ $t('Per Unit') }}</span></b>
                                    <b v-else> - </b>
                                </div>
                            </div>
                            <div class="col col-lg-12 col-xl">
                                <div class="pview-head-data">
                                    {{ $t('Default Alert Quantity') }} <b class="d-block"  v-if="product.alert_quantity">{{ product.alert_quantity }} <span v-if="product.stock_measurement_unit"> {{ (language == 'ar' && product.stock_measurement_unit.abbreviation_ar != '' && product.stock_measurement_unit.abbreviation_ar != null)?product.stock_measurement_unit.abbreviation_ar:product.stock_measurement_unit.abbreviation  }}</span> <span v-else> {{ $t('Unit') }}</span></b>
                                    <b v-else> - </b>
                                </div>
                            </div>
                        </div>
                        <div class="dv-data">
                            <div class="item">
                                <span>{{ $t('Stock Measurement') }}</span>
                                <span v-if="product.stock_measurement_unit"> {{ (language == 'ar' && product.stock_measurement_unit.unit_name_ar != '' && product.stock_measurement_unit.unit_name_ar != null)?product.stock_measurement_unit.unit_name_ar:product.stock_measurement_unit.unit_name  }}</span> 
                                <span v-else> {{ $t('Units') }} </span> 
                            </div>
                            <div class="item">
                                <span>{{ $t('Sale Measurement') }}</span>
                                <span v-if="product.sale_measurement_unit"> {{ (language == 'ar' && product.sale_measurement_unit.unit_name_ar != '' && product.sale_measurement_unit.unit_name_ar != null)?product.sale_measurement_unit.unit_name_ar:product.sale_measurement_unit.unit_name  }}</span> 
                                <span v-else> {{ $t('Units') }} </span> 
                            </div>
                            <div class="item">
                                <span>{{ $t('Price Type') }}</span>
                                {{  $t(product.price_type_text)  }}
                            </div>
                            <div class="item">
                                <span>{{ $t('UPC (Barcode)') }}</span>
                                {{ product.upc }}
                            </div>
                            <div class="item" v-if="layout == 2">
                                <span>{{ $t('MPN') }}</span>
                                {{ product.mpn }}
                            </div>
                            <div class="item" v-if="layout == 2">
                                <span>{{ $t('EAN') }}</span>
                                {{ product.ean }}
                            </div>
                            <div class="item" v-if="layout == 2">
                                <span>{{ $t('Manufacturer') }}</span>
                                {{ product.manufacturer }}
                            </div>
                            <div class="item" v-if="layout == 2">
                                <span>{{ $t('Brand') }}</span>
                                {{ product.brand }}
                            </div>
                            <div class="item">
                                <span>{{ $t('Calories') }}</span>
                                {{ product.calories }}
                            </div>
                            <div class="item" v-if="product.preparation_time != ''">
                                <span>{{ $t('Preparation Time') }}</span>
                                {{ product.preparation_time  }} {{ $t('Mins') }}
                            </div>
                            <div class="item">
                                <span>{{ $t('Created At') }}</span>
                                {{ product.created_at_label }}
                            </div>
                            <div class="item">
                                <span>{{ $t('Updated At') }}</span>
                               {{ product.updated_at_label }}
                            </div>
                            <div class="item" v-if="product.description">
                                <b class="d-block w-100" >{{ $t('Description') }} :</b>
                                <span class="d-block w-100">{{ product.description }}</span>
                            </div>
                            <div class="item" v-if="product.description_ar">
                                <b class="d-block w-100">{{ $t('Description (Arabic)') }} :</b>
                                <span class="d-block w-100">{{ product.description_ar }}</span>
                            </div>
                        </div>
                    </div>
                    <ProductDetailSkeleton v-else />
                </div>
                <div class="col-lg-9">
                    <ul class="nav nav-tabs nav-underline" id="myTab" role="tablist" v-if="product!=''">
                         <li class="nav-item" role="presentation" v-for="(tab,index) in tabs" :key="index">
                            <button 
                                v-tippy="(tab.required && tab.count <= 0) ? low_inventory_message : ''" 
                                class="nav-link" 
                                @click="setActive(tab,index)" 
                                :class="[ active_tab.index == index || (active_tab.index == '' && index == 0)  ? 'active' : '' , (tab.required && tab.count <= 0) ? 'text-danger' : ''  ]"  
                                type="button" role="tab" aria-selected="false" tabindex="-1">
                                {{ tab.value }} 
                                <span v-if="tab.count >= 0 && tab.key != 'inventory'" class="badge count-badge" :class="[ active_tab.index != index ? 'badge-secondary' : 'badge-dark' ]" >
                                    {{  tab.count }}
                                </span> 
                            </button>
                        </li>
                       
                    </ul>
                    <div class="tab-content" id="myTabContent" >
                        
<!--                        <AsyncAddProductBranch v-if="active_tab.index == '' || active_tab.tab.key == 'inventory'" :product="product" :all_branches="all_branches" @saveProductBranch="getProduct()" /> -->

                        <AsyncAddProductIngredient v-if="active_tab.tab.key == 'ingredients' && product.type == 2" :product="product"/>
                        
                        <AsyncAddProductSupplier v-if="active_tab.tab.key == 'suppliers'" :product="product"/>

                        <AsyncAddProductModifier v-if="active_tab.tab.key == 'modifiers' && product.type == 2" :product="product"  />
                        
                        <!-- <AsyncAddProductVariant v-if="active_tab.tab.key == 'variants' && !product.is_variant  " :product="product"  /> -->
                    
                        <!-- <AsyncAddProductDeliveryPartner :product="product" :all_delivery_partners="all_delivery_partners"  /> -->
                    </div>

                </div>
            </div>
            
        </div>

     </DefaultLayout>
</template>

<script setup>

import {ref, reactive, onMounted, defineAsyncComponent } from 'vue';

import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth';

 const language = localStorage.getItem('language');
const authStore = useAuthStore();
const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;

const initialState = {
    server_messages: {
        type: "",
        messages: "",
    },
};

const form = reactive({ ...initialState });


const AsyncProductDetail = defineAsyncComponent( () => import('@/components/product/ProductDetail.vue') );
const AsyncAddProductBranch = defineAsyncComponent( () => import('@/components/product/AddProductBranch.vue') );
const AsyncAddProductSupplier = defineAsyncComponent( () => import('@/components/product/AddProductSupplier.vue') );
const AsyncAddProductIngredient = defineAsyncComponent( () => import('@/components/product/AddProductIngredient.vue') );
const AsyncAddProductModifier = defineAsyncComponent( () => import('@/components/product/AddProductModifier.vue') );
// const AsyncAddProductVariant = defineAsyncComponent( () => import('@/components/product/selected_variant.vue') );
// const AsyncAddProductDeliveryPartner = defineAsyncComponent( () => import('@/components/product/AddProductDeliveryPartner.vue') );

const product = ref("");
const product_modifier_count = ref(0);
// const product_variant_count = ref(0);
const active_tab = ref({
    index : '',
    tab : ''
});

onMounted(() => {
    getProduct();
});
const tabs = computed(() => {
    
    let values = [
        {
            key: 'ingredients',
            value: t('Ingredients'),
            count: (product.value.type == 2) ? product.value.ingredients.length : 0,
            required: false,
        },
        {
            key: 'modifiers',
            value: t('Modifiers'),
            count: product_modifier_count.value,
            required: false,
        }
        ,{
            key: 'suppliers',
            value: t('Suppliers'),
            count: _.size(product.value.product_suppliers),
            required: false,
        }
        // ,{
        //     key: 'variants',
        //     value: t('Variants'),
        //     count: product_variant_count.value,
        //     required: false,
        // } 
        
    ]
    
    if(product.value.type == 1){
        values = _.filter(values, (item) => {
            return item.key != 'ingredients' && item.key != 'modifiers'
        }) 
    }
    
    // if(product.value.is_variant){
    //     values = _.filter(values, (item) => {
    //         return item.key != 'variants'
    //     }) 
    // }

    return values;

});

function setActive(tab,index){
    let template = {
        tab: tab,
        index: index,
    };
    active_tab.value = template;
}

const low_inventory_message = t("Inventory can not be left blank, at least 1 branch should have some stock!");

const is_product_detail_listed = ref(false);
async function getProduct(){

    await axios.get('/api/v2/product', { params : {
            slack : slack,
        } }).then( (response) => {
            
        product.value = response.data.data.product;
        product_modifier_count.value = response.data.data.product_modifier_count;
        // product_variant_count.value = response.data.data.product_variant_count;
        if(product.value){
            setActive(tabs.value[0],0)
        }
        is_product_detail_listed.value = true;
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
    });

}


const layout = computed(() => {
  return authStore.user.merchant.layout;
})

</script>
