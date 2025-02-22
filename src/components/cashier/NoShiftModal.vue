<template>
    <teleport to="body" >
        <div class="modal hide hold-order-modal cashier-layout-modal" id="noShiftModal" tabindex="5" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title text-center mx-auto">
							<h2 class="mb-0">{{ $t('Alert!') }} </h2>
						</div>
						<!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
					</div>
					<div class="modal-body">
                        <div class="text-center">
                            <p class="text-danger">{{ $t("No shift available, please check/manage shift for your logged in branch.") }}</p>
                            <a role="button" class="btn btn-primary" @click="closeRegisterModal" >
								{{ $t('Close Register') }}
							</a>
                        </div>
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
    import { useI18n } from 'vue-i18n'

    const props  = defineProps(['terminal_closing_time','force_closing',"cash_in_hand_remain"]);
    const { t } = useI18n();
    const authStore = useAuthStore();

    const currency_symbol = computed(() => {
      return authStore.user.currency.symbol;
    })

    const cash_in_hand = ref(0);
    const cash_in_hand_label = t("Cash In Hand");

	 const emits = defineEmits(['closeRegister']);

	 function closeRegisterModal(){
		$("#noShiftModal").modal("hide");
		emits('closeRegister')
	 }
</script>