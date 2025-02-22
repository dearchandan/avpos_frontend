<template>

   <teleport to='body' >
        <div class="modal hide " id="openRegisterModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <!-- <div class="modal-header modal-title">
                        <h2 class="mb-0">Register</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div> -->
                    <div class="modal-body mt-5">

                        <Form :validation-schema="schema" @submit="submit()" >
                            
                            <VTextInput
                                type="text" 
                                name="cash_in_hand"
                                v-model="cash_in_hand"
                                :label="cash_in_hand_label" 
                                placeholder="" 
                                size="large"
                                required
                            />

                            <div class="modal-btns">
                                <button type="submit" class="btn btn-lg btn-primary">{{ $t('Open Register') }}</button>
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
    import { useAuthStore } from '@/stores/auth';
    import { useCashierStore } from '@/stores/cashierStore';
    import { useI18n } from 'vue-i18n'
    import {useRoute} from "vue-router";

    const { t } = useI18n();
    const props = defineProps(['terminal']);
    const terminal = toRef(props,'terminal');
    const route = useRoute();

    const authStore = useAuthStore();
    const cashierStore = useCashierStore();

    const cash_in_hand = ref(0);
    const cash_in_hand_label = t("Cash In Hand");
    const schema = yup.object({
        cash_in_hand: yup.number().moreThan(-1).typeError(t('must be a number',{ name: t('Cash In Hand') })).required(t('name is required', { name: t('Cash In Hand') })),
    });

    const server_messages = reactive({
        type: "",
        messages: "",
    });
    
	async function submit(){

		if(terminal.registered_device_id == null){
			
            let order_slack = route.query.order_slack;

			var form_data = new FormData();
			form_data.append('terminal_slack',terminal.value.slack);
			form_data.append('cash_in_hand',cash_in_hand.value);

			await axios.post('/api/business_register/open', form_data ).then( (response) => {

				if(response.data.status_code == 200) {
                    
                    $('#openRegisterModal').modal('hide');
                    
                    authStore.refresh().then(() => {

                        cashierStore.refreshTerminals().then(() => {

                            if(order_slack != undefined){
                                location.href = '/order/'+order_slack;
                            }else{
                                toast.success(response.data.msg);
                            }

                        });
                    });

				}else{
					try{
						server_messages.type = "error";
						server_messages.messages = JSON.parse(response.data.msg);
					}catch(err){
						server_messages.type = "error";
						server_messages.messages = response.data.msg;
					}
				}
				
			}).catch((error) => {
				server_messages.type = "error";
				server_messages.messages = error;
				console.log(error);
			});

		}else{
		
			toast.warning('Terminal is already linked to a device '+terminal.registered_device_id);
		
		}
	
	}


</script>