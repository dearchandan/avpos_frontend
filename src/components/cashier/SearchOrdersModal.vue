<template>
    <teleport to="body" >
        <div class="modal hide search-order-modal cashier-layout-modal" id="searchOrdersModal" tabindex="5" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title">
							<h2 class="mb-0">{{ $t("Search & Print") }}</h2>
						</div>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">

						<div class="form-search-feild position-relative mb-2">
							<input class="form-control form-control-lg" type="search" :placeholder="search_placeholder" v-model="search_term">
							<div class="icon">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g opacity="0.5">
									<path d="M6.77721 12.5582C9.96787 12.5582 12.5544 9.97031 12.5544 6.778C12.5544 3.58568 9.96787 0.997803 6.77721 0.997803C3.58654 0.997803 1 3.58568 1 6.778C1 9.97031 3.58654 12.5582 6.77721 12.5582Z" stroke="#767F8F" stroke-width="1.75071" stroke-linecap="round" stroke-linejoin="round"></path>
									<path d="M15.0025 15.0021L11.0027 11.0005" stroke="#767F8F" stroke-width="1.75071" stroke-linecap="round" stroke-linejoin="round"></path>
									</g>
								</svg>
							</div>
						</div>
						<div class="modal-data-scorll" data-simplebar="">
							<ul class="order-items">
								<li v-for="order in search_orders" v-if="search_orders.length ">
									<div class="date">
										<h2>{{ order.business_date_formatted.day }}</h2>
										<p>{{ order.business_date_formatted.month }} {{ order.business_date_formatted.year }}</p>
									</div> 
									<div class="row align-items-center justify-content-between">
										<div class="col-auto">
											<h2>#{{ order.order_number  }}</h2>
										</div>
										<div class="col-auto">
											<h3> {{ order.total  }} {{ currency_symbol }} </h3>
										</div>
									</div>
									<h6>
										<span v-for="(product,index) in order.products">
											{{ product.product_name }}<span v-if="(index + 1) != order.products.length">, </span>
										</span> 
									</h6>
									<div class="row align-items-center order-bottom">
										<div class="col-auto">
											<span class="fw-light"> 
												<Icon v-if="order.payment_method_id == 1" icon="bi:cash" />
												<Icon v-if="order.payment_method_id == 2" icon="streamline:money-atm-card-1-credit-pay-payment-debit-card-finance-plastic-money" /> 
												{{ order.payment_method_name  }} 
											</span>
										</div>
										<div class="col-auto" v-if="order.customer_phone != ''">
											<h4> <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M11 12.25V11C11 10.337 10.7366 9.70107 10.2678 9.23223C9.79893 8.76339 9.16304 8.5 8.5 8.5H3.5C2.83696 8.5 2.20107 8.76339 1.73223 9.23223C1.26339 9.70107 1 10.337 1 11V12.25" stroke="#4B5B73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M6 6C7.38071 6 8.5 4.88071 8.5 3.5C8.5 2.11929 7.38071 1 6 1C4.61929 1 3.5 2.11929 3.5 3.5C3.5 4.88071 4.61929 6 6 6Z" stroke="#4B5B73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>{{ order.customer_phone  }}
											</h4>
										</div>
									</div>
									<div class="print-order">
										<a :href="order.receipt_link" target="_blank">
											<svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M5.75 9.12508V2.41675H17.25V9.12508" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M5.75008 17.75H3.83341C3.32508 17.75 2.83757 17.5481 2.47813 17.1886C2.11868 16.8292 1.91675 16.3417 1.91675 15.8333V11.0417C1.91675 10.5333 2.11868 10.0458 2.47813 9.68638C2.83757 9.32693 3.32508 9.125 3.83341 9.125H19.1667C19.6751 9.125 20.1626 9.32693 20.522 9.68638C20.8815 10.0458 21.0834 10.5333 21.0834 11.0417V15.8333C21.0834 16.3417 20.8815 16.8292 20.522 17.1886C20.1626 17.5481 19.6751 17.75 19.1667 17.75H17.2501" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M17.25 13.9167H5.75V21.5834H17.25V13.9167Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>
										</a>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
        </div>
        </teleport>
</template>

<script setup>
	
	import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    import { useAuthStore } from '@/stores/auth';
	import { useCashierStore } from '@/stores/cashierStore';
	import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
	const cashierStore = useCashierStore();
    const authStore = useAuthStore();

	const currency_symbol = computed(() => {
      return authStore.user.currency.symbol;
    })

	const search_orders = computed(() => {
		return cashierStore.search_orders;
	})

	const search_term = ref("");
	const search_placeholder = t("search by order number or reference number")
    watch(() =>
        search_term.value, _.debounce( (newValue) => {
            cashierStore.getSearchOrders(newValue);
        },600),
    );

</script>

<style scoped>
.payment-icon{
	font-size: 25px !important;
}
</style>