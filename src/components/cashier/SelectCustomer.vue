<template>

   <teleport to='body' >
        <div class="modal hide cashier-layout-modal" id="customerModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header modal-title">
                        <h2 class="mb-0">{{ $t('Add Customer') }}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <Form :validation-schema="schema" @submit=" (customer.selection_type) ? submit() : save()" >
                            <VTextInput
                                type="text"
                                name="mobile_number"
                                v-model="customer.mobile_number"
                                :label="labels.mobile_number" 
                                placeholder="" 
                                size="large"
                                required
                                :input_group_text="country_code"
                                input_group_position="before"
                            />
                            
                            <VTextInput
                                type="text" 
                                name="name"
                                v-model="customer.name"
                                :label="labels.name" 
                                placeholder="" 
                                size="large"
               
                            />
                            
                            

                            <div class="modal-btns">
                                <button v-if="customer.selection_type == 1" type="button" class="btn btn-lg btn-light-primary" @click="submit()">{{ $t('Skip') }}</button>
                                <button v-if="customer.selection_type == 1" type="submit" class="btn btn-lg btn-primary">{{ $t('Proceed To Pay') }}</button>
                                <button v-if="customer.selection_type == 0" type="submit" class="btn btn-lg btn-light-primary" >{{ $t('Save') }}</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div> 
   </teleport>

</template>

<script setup>
    
    import { Form, Field } from 'vee-validate'
    import * as yup from 'yup';
	import { useCashierStore } from '@/stores/cashierStore';
    
    import { useAuthStore } from '@/stores/auth';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const labels = ref({
        name: t('Customer Name'),
        mobile_number: t("Mobile Number")
    });
    const cashierStore = useCashierStore();
	const authStore = useAuthStore();
    
    const schema = yup.object({
        mobile_number: yup.string().matches(/^[0-9]{9,10}$/, t('Mobile number must be 9 or 10 digits')).typeError(t('must be a number',{ name: t('Mobile Number') })).required(t('name is required', { name: t('Mobile Number') })).min(9).max(10),
        name: yup.string().matches(/^[A-Za-z\s]*$/,t('Name must be in alphabets'))
    });

    const country_code = computed(() => {
        return authStore.user.country.country_code;
    });

    const customer = computed( () => {
      return cashierStore.customer;
    });

    const emits = defineEmits(['payNow','close']);

    function submit(){
        cashierStore.setCustomer(customer.value);
        emits('payNow');
    }

    function save(){
        cashierStore.setCustomer(customer.value);
        emits('close');
    }

</script>