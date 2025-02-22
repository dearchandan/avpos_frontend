<template>
    <teleport to="body" >
        <div  class="modal fade cashier-layout p-0" id="modifierDiscountModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-w-550 modal-dialog-centered">
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
                            <div :class="'col-md-12'" v-if="product.product.product_modifiers.length > 0">
                                <div class="variation-select-group" v-for="(modifier,i) in product.product.product_modifiers">
                                    <h4>{{ modifier.modifier.name  }} <span v-if="!modifier.modifier.allow_multiple_selections">({{ $t('required') }})</span></h4>
                                    <ul class="variation-select-list">
                                        <li v-if="!modifier.modifier.allow_multiple_selections" v-for="option in modifier.options">
                                            <div class="radio-wrap">
                                                <label>
                                                    <input type="radio" :name="modifier.modifier.name" :value="option" v-model="radio.modifiers[modifier.modifier.id]" >
                                                    <span>{{  option.option_name  }}
                                                        <div class="v_price">{{ option.sale_price }} {{ currency_symbol }} </div>
                                                    </span>
                                                </label>
                                            </div>
                                        </li>
                                        <li v-else  v-for="(option,index) in modifier.options"> 
                                            <div class="checkbox-wrap" >
                                                <label>
                                                    <input type="checkbox" :name="modifier.modifier.name+'_'+index" :value="option" :checked="option.is_default" v-model="product.modifiers">

                                                    <span>{{  option.option_name  }} 
                                                        <div class="v_price">{{ option.sale_price }} {{ currency_symbol }}</div>
                                                    </span>
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!-- <div :class="[ product.product.product_modifiers.length == 0 ? 'col-md-12' : 'col-md-5 border-end' ]" v-if="product.product.discounts.length > 0">
                                <div class="discount-wrap">
                                    <h4>{{ $t('Discounts') }}</h4>
                                    <ul class="discount-list">
                                        <div class="radio-wrap mb-3">
                                            <label>
                                                <input type="radio" name="discounts" value="" v-model="product.discount"> 
                                                <span>{{ $t('No Discount') }}</span>
                                            </label>
                                        </div>
                                        
                                        <li v-for="discount in product.product.discounts">
                                            <div class="discount_item">
                                                <label>
                                                    <input type="radio" name="discounts" :value="discount" v-model="product.discount">
                                                    <span>
                                                        <div class="text">
                                                            <h5 class="mb-1 fw-bold">{{  discount.name  }} <Icon v-if="discount.is_taxable" icon="tabler:receipt-tax" /></h5>   
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
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div> -->
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
    watchEffect(()=>{
        if(product.value.modifiers == ''){
            radio.modifiers = [];
        }
    })
    watchEffect(() => {
        if(product.value){
            for (var i = 0; i < product.value.product.product_modifiers.length; i++) {
                if(!_.isUndefined(product.value.product.product_modifiers[i]))
                {
                    if(product.value.product.product_modifiers[i].modifier.allow_multiple_selections == false){
                        for (var j = 0; j < product.value.product.product_modifiers[i].options.length; j++) {
                            if(product.value.modifiers.findIndex(e => e.modifier_id === product.value.product.product_modifiers[i].options[j].modifier_id) > -1)
                            {
                                if(_.isUndefined(radio.modifiers[product.value.product.product_modifiers[i].modifier_id]) ){
                                    if(product.value.modifiers.findIndex(e => e.id === product.value.product.product_modifiers[i].options[j].id) > -1)
                                    radio.modifiers[product.value.product.product_modifiers[i].modifier_id] = product.value.product.product_modifiers[i].options[j];
                                }
                            }
                        }
                    }

                }
            }
        }
    })
    function close(){
        radio.modifiers = [];
        emit('closeModifierModal');
    }
  
    function apply(){
        for (var i = 0; i < radio.modifiers.length; i++) {
            if(!_.isUndefined(radio.modifiers[i]))
            {
                if(product.value.modifiers.findIndex(e => e.modifier_id === radio.modifiers[i].modifier_id) > -1)
                product.value.modifiers.splice(product.value.modifiers.findIndex(e => e.modifier_id === radio.modifiers[i].modifier_id),1); 
                
            }
         }
        for (var i = 0; i < radio.modifiers.length; i++) {
            if(!_.isUndefined(radio.modifiers[i]))
            {
                if(!product.value.modifiers.find(e => e.id === radio.modifiers[i].id))
                    product.value.modifiers.push(radio.modifiers[i])
                   
            }
        }

        cashierStore.addProductModifiers(product.value.cart_id,product.value.modifiers);
        close();
        $('#modifierDiscountModal').modal('hide');
    }

</script>