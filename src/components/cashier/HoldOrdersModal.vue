<template>
    <teleport to="body" >
        <div class="modal hide hold-order-modal cashier-layout-modal" id="holdOrdersModal" tabindex="5" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title">
							<h2 class="mb-0">{{ $t('Hold Orders') }} ({{ filtered_hold_orders.length }}) </h2>
						</div>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						
						<div class="text-danger" v-if="filtered_hold_orders.length == 0"> <h5>{{ $t('No hold orders found') }}</h5>  </div>

						<div v-else>
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
								<ul  class="hold-order-list">
									<li v-for="(order,index) in filtered_hold_orders" class="mb-4">
										<div>
										<div class="row justify-content-between order-top">
											<div class="col-auto">
												<div class="order-id">
													<h2>Order #{{ order.order_number  }}
														<span v-if="order.order_type == 2" class="text-success ps-3 fs-6">
															<Icon icon="streamline:food-kitchenware-fork-spoon-fork-spoon-food-dine-cook-utensils-eat-restaurant-dining" /> {{ $t('Dine In') }}
														</span>
														<span v-if="order.order_type == 1" class="text-primary ps-3 fs-6">
															<Icon icon="ep:takeaway-box" /> {{ $t('Take Away') }}
														</span>
													</h2>
												</div>
												<p class="py-3">
													<span v-for="(product,index) in order.products">
														{{ product.product_name }}
														<span v-if="(index + 1) != order.products.length">, </span>
													</span> 
												</p>
											</div>
											<div class="col-auto">
												<h6 class="fw-bold fs-6 text-primary"> {{  order.total }} {{  currency_symbol  }}  
													<!-- <span class="badge badge-danger ms-2" v-if="order.order_status == 3 || order.order_status == 4">Hold</span> 
													<span class="badge badge-success ms-2" v-else>Paid</span>  -->
												</h6>
											</div>
											
										</div>
										
										<div class="row align-items-center justify-content-between order-bottom ">
											
											<div class="col-auto ps-0">
												<span v-if="order.order_status == 4" class="py-2"> 
													<span v-if="order.kitchen_status == 0" class="badge badge-danger fw-bold"> {{ $t('Not Accepted') }} </span>
													<span v-if="order.kitchen_status == 1" class="badge badge-warning fw-bold"> {{ $t('Preparing') }}</span>
													<span v-if="order.kitchen_status == 2" class="badge badge-success fw-bold"> {{ $t('Ready to Serve') }}</span>
													<span v-if="order.kitchen_status == 3" class="badge badge-muted fw-bold"> {{ $t('Served') }} </span>
												</span>
												<span v-else>
													<span class="badge badge-danger">{{ $t('On Hold') }}</span>
												</span>
											</div>
											<div class="col-auto pe-0">
												
												<div class="btn-wrap" v-if="order.order_status == 3 || order.order_status == 4">
													<a role="button" class="btn btn-link text-danger" @click="cancelOrder(order.slack)">
														{{ $t('Cancel') }}
													</a>
													<a role="button" class="btn btn-primary btn-sm" @click="editOrder(order.slack)">
														<Icon icon="material-symbols:payments" /> {{ $t('Open & Pay') }}
													</a>
												</div>
											</div>
										</div>
										</div>
									</li>
							</ul>
							</div>
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

    const filtered_hold_orders = computed(() => {
		return cashierStore.filtered_hold_orders;
	})

	const search_term = ref("");
	const search_placeholder = t("search by order number or reference number")
    watch(() =>
        search_term.value, _.debounce( (newValue) => {
            cashierStore.filterHoldOrders(newValue);
        },600),
    );

	function editOrder(slack){
		cashierStore.editOrder(slack);
		$('#holdOrdersModal').modal('hide');
	}
	
	function cancelOrder(slack){
		Swal.fire({
			title: 'Warning!',
			icon: 'warning',
			title: t("Are you sure about this?"),
			confirmButtonText: 'Yes, Cancel',
			showCancelButton: true,
		}).then( async (result) => {
			
			if(result.isConfirmed){
				
				var form_data = new FormData();
				form_data.append('order_slack',slack);

				await axios.post('/api/v2/order/cancel', form_data ).then( (response) => {
            
				if(response.data.status_code == 200) {

					toast.success(response.data.msg);
					$('#holdOrdersModal').modal('hide');

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
				form.is_processing = false;
				console.log(error);
			});
			}
		});
	}

</script>