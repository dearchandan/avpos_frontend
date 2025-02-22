<template>
    <teleport to="body" >
        <div class="modal hide cashier-layout" id="ChangeAmountModal" tabindex="5" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header modal-title pb-5">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
					<div class="modal-body p-5 text-center">
                        <h3 class="text-primary ">{{ $t('Change Amount') }}</h3>
                        <h2 >{{ change }} {{ currency_symbol }}</h2>
					</div>
				</div>
			</div>
        </div>
        </teleport>
</template>

<script setup>
	
    import { useAuthStore } from '@/stores/auth';
	import { useI18n } from 'vue-i18n'

    const authStore = useAuthStore();

	const currency_symbol = computed(() => {
      return authStore.user.currency.symbol;
    })

    const { change } = defineProps(['change']);

</script>