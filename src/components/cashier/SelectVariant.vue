<template>
    <teleport to="body" >
        <div  class="modal fade variant-modal" id="variantModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content" v-if="product">
                    <div class="modal-header">
                        <div class="modal-title">
                           {{ $t('Variants') }}
                        </div>
                        <button type="button" class="btn-close" @click="close()" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="product-box-wrap" data-simplebar >

                            <div class="row g-3 g-md-2" v-if="variants.length" v-for="(variant,index) in variants"> 
                                <h5>{{  variant[0]  }}</h5>
                                
                                <div class="col-4" v-if="variant[1].length" v-for="(product,index) in variant[1]">

                                    <div @click="addToCart(product.variant_product)" class="product-box d-block" style="cursor: pointer;" :class="{ 'low-stock' : product.variant_product.is_stockable && product.variant_product.quantity > 0 && product.variant_product.quantity <= product.variant_product.alert_quantity, 'out-of-stock' : product.variant_product.is_stockable && product.variant_product.quantity == 0}">

                                        <div class="row">
                                        
                                            <div class="col-auto">
                                                <div class="image" style="padding: 0;">
                                                    <a href="#">
                                                        <img :src="product.variant_product.image_path" alt="">
                                                    </a>
                                                    <div class="veg-icon " v-if="product.variant_product.dietary==1">
                                                        <img src="/src/assets/images/veg_icon.svg" alt=""/>
                                                    </div>
                                                    <div class="nonveg-icon " v-if="product.variant_product.dietary==2">
                                                        <img src="/src/assets/images/nonveg_icon.svg" alt=""/>
                                                    </div>
                                                    <div class="box-favorite-icon" v-if="product.variant_product.is_favorite">
                                                        <img src="/src/assets/images/favorite-icon.svg" alt=""/>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                            <div class="col">
                                                <div class="text">
                                            
                                            <div class="badge" v-if="product.variant_product.is_stockable && product.variant_product.quantity > 0 && product.variant_product.quantity <= product.variant_product.alert_quantity">
                                                <span class="bg-warning">{{ $t('Low Stock') }}</span> 
                                            </div>
                                            <div class="badge" v-if="product.variant_product.is_stockable && product.variant_product.quantity == 0">
                                                <span class="bg-danger">{{ $t('Out Of Stock') }}</span> 
                                            </div>

                                            <h2 class="pt-3 pb-1 mb-0 fw-bold text-start">
                                                {{ product.variant_product.name }} 
                                                <!-- <a href="#" data-bs-toggle="modal" data-bs-target="#CashierProductDetail" @click="showProductDetail(product)">
                                                    <Icon icon="solar:info-square-line-duotone" class="text-primary" style="font-size: 15px;"  /> 
                                                </a> -->
                                            </h2>
                                            <h6 class="mb-2 text-muted text-start" v-if="product.variant_product.calories"> {{  product.variant_product.calories  }} {{ $t('Calories') }}</h6>
                                            <br v-else>
                                            <div class="row align-items-center justify-content-between">
                                                <div class="col-8 text-start">
                                                    <h5 class="fw-bold" style="font-size: 16px;">{{ product.variant_product_inventory?.sale_price  }} SAR </h5>
                                                </div>
                                                <div class="col-auto" v-if="product.variant_product.has_variants">
                                                    <div class="icon" >
                                                        <Icon icon="tabler:list-details" class="text-muted" style="font-size: 20px;"  />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                            </div>
                                        
                                        </div>

                                        
                                    </div>
                                </div>
                                
                            </div>
                            <div class="row">
                                <div class="mt-2 text-end">
                                    <button type="submit" class="btn btn-primary" @click="skipVariant()">{{ $t('Skip') }}</button>
                                </div>
                            </div>
<!-- 
                             <h4 class="text text-muted text-center pt-5 mt-5" v-else>
                                <img src="/src/assets/images/logo.png" alt="" />
                                <div class="p-3">Loading Products</div>
                                <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                            </h4> -->

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>

    import { useAuthStore } from '@/stores/auth';
	import { useCashierStore } from '@/stores/cashierStore';
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
   
    const auth = useAuthStore();
    const cashierStore = useCashierStore();

    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })

    const props  = defineProps(['product']);
    const product = toRef(props,'product');
    
    const variants = computed(() => {

        if(props.product.product_variants){

            let chunks = props.product.product_variants.reduce((result, item) => {
                
                const key = item['variant']['name'];
                
                if (!result[key]) {
                    result[key] = []; 
                }
    
                result[key].push(item); 
    
                return result;
          
            },[]);
            
            return Object.entries(chunks);

        }else{

            return [];
        
        }

    });

    function addToCart(product){
        // console.log(product,'product');
        let searched_product = cashierStore.all_products.find( (item) => {
            return item.id == product.id;
        });

        cashierStore.addToCart(searched_product);

        $('#variantModal').modal('hide');

    }
    
    function skipVariant(){
        addToCart(product.value);
    }

    const emit = defineEmits(['closeVariantModal']);

    function close(){
        emit('closeVariantModal');
    }
    

</script>