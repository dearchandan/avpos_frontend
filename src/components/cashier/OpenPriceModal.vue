<template>

   <teleport to='body' >
        <div class="modal hide cashier-layout" id="OpenPriceModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered ">
                <div class="modal-content">
                    <div class="modal-header modal-title">
                        <h2 class="mb-0">{{ $t('Update Price') }}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <Form :validation-schema="schema" @submit="submit()" >

                            <Field name="price" label="label">
                                
                                <label class="label"> {{  $t('Enter New Price')  }}  </label>
                                
                                    <div class="input-group mb-1">
                                       
                                        <input 
                                        class="form-control form-control-solid"
                                        type="number"
                                        v-model="new_price"
                                        :placeholder="new_price_placeholder"
                                        />
                                        <div class="input-group-append" >
                                            <span class="input-group-text h-100 form-control-solid">{{ currency_symbol }}</span>
                                        </div>
                                    </div>
                            </Field>
                            <ErrorMessage name="price" as="div" class="error"></ErrorMessage>

                            <a href="#" class="mt-3 badge badge-primary" v-if="new_price != old_price" @click="new_price = old_price">Original Price: {{  old_price  }}</a>

                            <div class="modal-btns">
                                <button type="submit" class="btn btn-lg btn-primary">{{ $t('Apply') }}</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div> 
   </teleport>

</template>

<script setup>
    
    import { Form, Field, ErrorMessage } from 'vee-validate'
    import * as yup from 'yup';
	import { useCashierStore } from '@/stores/cashierStore';
    
    import { useAuthStore } from '@/stores/auth';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();

    const authStore = useAuthStore();
    const currency_symbol = computed(() => {
      return authStore.user.currency.symbol;
    })

    const props = defineProps(['product']);
    
    const old_price = computed(() => {
        if (props.product && props.product.product) {
            return props.product.product.this_branch_inventory.initial_sale_price;
        } 
    });

    const new_price = ref(0);
    const new_price_placeholder = t('Enter New Price');
    
    watch(
        () => props.product,
        () => {
            if (props.product && props.product.product) {
                new_price.value = props.product.product.this_branch_inventory.sale_price;
            } 
        }
    );

    const price_label = t("Price Per Unit"); 
    const cashierStore = useCashierStore();

    const schema = yup.object({});

    function submit(){
        cashierStore.setOpenPrice(props.product.cart_id,_.round(parseFloat(new_price.value),2));
        $('#OpenPriceModal').modal('hide');
    }

</script>