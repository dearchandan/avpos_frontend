<template>

    <div v-if="terminal == null && is_shift_available == true" class="text-center" style="padding-top: 25vh">
    
        <h5 class="text-danger fw-bold">{{ $t("Ooops! We couldn't find any opened terminal") }}</h5>
        <a role="button" @click="openTerminal()" class="btn btn-link text-primary text-underline"><u>{{ $t('Click here to open terminal') }}</u></a>
        
    </div>
    <!-- {{ is_shift_available }} -->
    <div v-if="terminal == null && is_shift_available == false" class="text-center" style="padding-top: 25vh">
    
        <h5 class="text-danger fw-bold">{{ $t("No shift available, please check/manage shift for your logged in branch.") }}</h5>
        <router-link :to="'/branch/'+logged_in_branch_slack" class="btn btn-link text-primary text-underline"><u>{{ $t('Click here to add/manage shift') }}</u></router-link>
        
    </div>
    <!-- <div v-else class="product-box-wrap"  data-simplebar  > -->
    <div v-else-if="terminal != null && is_shift_available == true" class="product-box-wrap"  id="content" v-scroll="onScroll">

        <div class="row g-3 g-md-2" v-if="products.length > 0" >
            <div role="button" class="col item cursor-pointer"  v-for="(product,index) in products" @click="!product.is_out_of_stock ? addToCart(product) : '' ">
                <div class="product-box" :class="{ 'low-stock' : product.is_low_stock, 'out-of-stock' : product.is_out_of_stock}">
                    <div class="image">
                     
                        <a href="#" >
                            <img v-lazy=product.image_path alt="Product image not found" :class="{ 'opacity-25' : product.is_out_of_stock }" >
                        </a>
                        <div class="veg-icon " v-if="product.dietary == 1">
                            <img src="/src/assets/images/veg_icon.svg" alt=""/>
                        </div>
                        <div class="nonveg-icon " v-if="product.dietary == 2">
                            <img src="/src/assets/images/nonveg_icon.svg" alt=""/>
                        </div>
                        <div class="box-favorite-icon" v-if="product.is_favorite">
                            <img src="/src/assets/images/favorite-icon.svg" alt=""/>
                        </div>
                    </div>

                    <div class="text">
                        
                        <h2 class="pb-1 mb-0 fw-bold text-start" >
                            <span :class="{ 'text-muted' : product.is_out_of_stock }" class="pe-2">{{ product.name }} </span>
                            <!-- <a href="#" data-bs-toggle="modal" data-bs-target="#CashierProductDetail" @click="showProductDetail(product)">
                                <Icon icon="solar:info-square-line-duotone" class="text-primary" style="font-size: 15px;"  /> 
                            </a> -->
                        </h2>
                        <h6 class="mb-2 text-muted text-start" v-if="product.calories && product.calories > 0"> {{  product.calories  }} {{ $t('Calories') }}</h6>
                        <br v-else>
                        <div class="row align-items-center justify-content-between">
                            <div class="col-8 text-start">
                                <h5 :class="{ 'text-muted' : product.is_out_of_stock }">{{ product.this_branch_inventory?.initial_sale_price  }} {{ currency_symbol }} </h5>
                                <span class="text-info fw-bold" v-if="multiple_price_name != ''"> {{ multiple_price_name }} </span>
                            </div>
                            <!-- <div class="col-auto">
                                <div class="icon">
                                    <a href="#" data-bs-toggle="modal" data-bs-target="#Combo_Meal" >
                                        <img src="/src/assets/images/combo_icon.svg" alt="">
                                    </a> 
                                </div>
                            </div> -->
                            <div class="col-auto" v-if="product.has_variants">
                                <div class="icon" >
                                    <Icon icon="tabler:list-details" class="text-muted" style="font-size: 20px;"  />
                                </div>
                            </div>
                        </div>
                        <div class="badge " v-if="product.is_low_stock">
                            <span class="text-danger" v-if="product.this_branch_inventory.quantity == 1"> {{  product.this_branch_inventory.quantity  }} {{ $t('item left') }}</span>
                            <span class="text-danger" v-else> {{  product.this_branch_inventory.quantity  }} {{ $t('items left') }}</span>
                        </div>
                        <div class="badge" v-if="product.is_out_of_stock">
                            <span class="bg-danger opacity-50">{{ $t('Out Of Stock') }}</span> 
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <CashierNoProductsFound v-if="is_products_loaded && products.length == 0" />
        
        <CashierProductListSkeleton v-if="!is_products_loaded && page == 1" />
        
        <AsyncCashierProductDetail v-if="show_product_detail" :product="selected_product" />

        <AsyncSelectVariant  @closeVariantModal="closeVariantModal" :product="selected_product"  />



        
    </div>

</template>

<script setup lang="ts"> 

    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
	import { useCashierStore } from '@/stores/cashierStore';
	import { useCashierStorePersist } from '@/stores/cashierStorePersist';
	import { useSettingStore } from '@/stores/settingStore';
    import { useAuthStore } from '@/stores/auth';
    import type { UseScrollReturn } from '@vueuse/core';
    import { vScroll } from '@vueuse/components';
    import { onMounted, watch, watchEffect } from 'vue';
    import { useI18n } from "vue-i18n";
    const { t } = useI18n();

    const settingStore = useSettingStore();
    const authStore = useAuthStore();
    
    const logo = computed(() => {
      return settingStore.logo;
    });

    const cashierStore = useCashierStore();
    const cashierStorePersist = useCashierStorePersist();

    const props = defineProps(['page','is_shift_available']);
    
    const products = computed(() => {
        return cashierStore.all_products;
    });
   
    const is_products_loaded = computed(() => {
        return cashierStore.is_products_loaded;
    });

    const terminal = computed(() => {
        return authStore.loggedInTerminal;
    });
    
    const product_data = computed(() => {
        return products.value.filter((item) => {
            return !item.is_variant;
        });
    });
    
    const show_product_detail = ref(false);
    const selected_product = ref("");
    const bottom = ref(false);
    const page = props.page;
    const logged_in_branch_slack = computed(() => {
        return authStore.user.login_branch.slack;
    });

    const currency_symbol = computed(() => {
        return authStore.user.currency.symbol;
    });

    function showProductDetail(product){
        selected_product.value = product;
        show_product_detail.value = true;
    }
    
    // const variants = ref([]);
    function addToCart(product){
  
        let cart_item = cashierStore.cart.find( (value) => value.product_id == product.id );
        if(cart_item){
            if( cart_item.product.is_stockable && cart_item.product_quantity >= cart_item.product.this_branch_inventory.quantity){
                toast.error(t(`There is no more stock left for ${cart_item.name}!`));
                return false;
            }
            cashierStore.increaseCartItemQty(cart_item.cart_id,1);
        }else{
            
            if(product.has_variants){
                selected_product.value = product;
                $('#variantModal').modal('show');
            }else{
                cashierStore.addToCart(product);
            }
        }

    }

     const onScroll = _.debounce( (state: UseScrollReturn) => {
        if(state.arrivedState.bottom){
            var page = props.page + 1;
            emits('getProductsOnScroll',page);
        }
     },300);
     
    function closeVariantModal(){
        $('#variantModal').modal('hide');
    }

    const emits = defineEmits(['openTerminal','getProductsOnScroll']);

    function openTerminal(){
        emits('openTerminal');
    }

    const AsyncCashierProductDetail = defineAsyncComponent( () => import('@/components/cashier/CashierProductDetail.vue') );
	const AsyncSelectVariant = defineAsyncComponent( () => import('@/components/cashier/SelectVariant.vue') );

    onMounted(() => {
       emits('getProductsOnScroll',1);
    });
    
    const multiple_price_name = computed(() => {
        return cashierStorePersist.multiple_price_name
    });
    
</script>