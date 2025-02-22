<template>
    <teleport to="body" >
        <div  class="modal fade cashier-layout p-0" id="discountModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal modal-dialog-centered">
                <div class="modal-content" v-if="product">
                    <div class="modal-header">
                        <div class="modal-title">
                            <div class="row gx-2">
                                <div class="col-auto veg-icon" v-if="product.dietary==1">
                                    <img src="/src/assets/images/veg_icon.svg" alt=""/>
                                </div>
                                <div class="col-auto nonveg-icon" v-if="product.dietary==2">
                                    <img src="/src/assets/images/nonveg_icon.svg" alt=""/>
                                </div>
                                <div class="col">
                                    <h2 >{{ product.name  }}</h2>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn-close" @click="close()" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row gx-5">
                           
                            <div :class="'col-md-12'" v-if="product.product.discounts.length > 0">
                                <div class="row discount-wrap">
                                    <h4>{{ $t('Discounts') }}</h4>

                                    <!-- <ul class="discount-list">
                                        <li class="col-md-6"> -->
                                        <div class="radio-wrap mb-3">
                                            <label>
                                                <input type="radio" name="discounts" value="" v-model="product.discount"> 
                                                <span>{{ $t('No Discount') }}</span>
                                            </label>
                                        </div>
                                        <!-- </li> -->
                                        <div class="col-md-6 mb-3" v-for="discount in product.product.discounts">
                                            <div class="discount_item">
                                                <label>
                                                    <input type="radio" name="discounts" :value="discount" v-model="product.discount">
                                                    <span>
                                                        <div class="text">
                                                            <h5 class="mb-1 fw-bold">{{  discount.name  }} </h5>   
                                                            <div class="pt-1 fw-bold" v-if="discount.type == 1">
                                                                 {{ discount.value }} {{ discount.type_text  }}  off
                                                            </div>
                                                            <div class="pt-1 fw-bold" v-if="discount.type == 2">
                                                                Flat {{ discount.value }} {{ currency_symbol }} OFF
                                                            </div>
                                                        </div>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <!-- </li>
                                        
                                    </ul> -->
                                </div>
                            </div>
                        </div>
                        <div class="total-wrap">
                            <div class="row align-items-center">
                                <div class="col-md-12">
                                    <a href="#" class="btn btn-lg btn-primary w-100" @click="apply()">{{ $t('APPLY') }}</a>
                                </div>
                            </div>
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
    import { isObject } from '@vueuse/core';
    import { reactive } from 'vue';

    const auth = useAuthStore();
    const cashierStore = useCashierStore();

    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })

    const props  = defineProps(['product']);
    const { product,openmodal } = toRefs(props);
    const emit = defineEmits(['closeModifierModal']);
    const radio = reactive({
        modifiers: ref([])
    })
    
    function close(){
        //radio.modifiers = [];
        //emit('closeModifierModal');
        $('#discountModal').modal('hide');
    }
  
    function apply(){
        
        cashierStore.addProductDiscount(product.value.cart_id,product.value.discount);
        close();
        
    }

</script>