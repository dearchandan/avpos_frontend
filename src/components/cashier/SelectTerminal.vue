<template>
	   <teleport to='body'>
		<div class="modal fade " id="terminalModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
				<div class="modal-dialog modal-dialog-centered modal-w-1260 modal-xl">
					<div class="modal-content">
						<div class="modal-header modal-title border-0">
							<h2 class="mb-0">{{ $t('Terminals') }}</h2>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
						</div>
						<div class="modal-body pt-0">
							<div class="tarminals-wrap">
								<div class="tarminals-items-wrap" data-simplebar v-if="all_terminals && all_terminals && all_terminals.length > 0">
									<h2>{{ $t('Terminals') }} <span class="badge badge-light" v-if="all_terminals">{{  all_terminals.length  }}</span></h2>
									<div class="row gx-0 flex-nowrap">
										<div class="col-auto" v-for="(terminal,index) in all_terminals" @click="selectTerminal(terminal)">
											<div class="terminal_box" :data-terminal-status="[ terminal.registered_device_id != null ? 'linked' : 'assigned' ]"  >
												<h3> {{  terminal.terminal_name  }} </h3>
												<p v-if="terminal.last_logged_out_at_formatted">
													<b class="text-success">{{ $t('Closed at') }}</b>
													{{ terminal.last_logged_out_at_formatted }}
												</p>
												<p  v-if="terminal.registered_device_id != null "> {{ $t('Linked with') }} <br> <Icon icon="mdi:tablet-ipad" /> {{ terminal.registered_device_id  }} </p>
												<p v-if="terminal.last_logged_in_at_formatted == null " class="text-success badge badge-success">{{ $t('New Terminal') }}</p>
											</div>
										</div>
									</div>
								</div>
								<div class="text-danger" v-else> <h5>{{ $t('No active terminals found') }}</h5>  </div>
							</div>
						</div>
					</div>
				</div>
		</div>

		<AsyncServerMessage v-if="server_messages.messages != ''" :server_messages="server_messages"  />

		<AsyncOpenRegister :terminal="selected_terminal"  /> 

		</teleport>
</template>


<script setup>

	import { useCashierStore } from '@/stores/cashierStore';
	import { useAuthStore } from '@/stores/auth';
	
	const cashierStore = useCashierStore();
	const authStore = useAuthStore();

    const server_messages = reactive({
        type : "",
        messages : "",
    });

	const active_register = computed(() => {
		return (authStore.loggedInTerminal) ? authStore.loggedInTerminal.active_business_register : '';
	})

	onMounted(() => {
		if (localStorage.getItem("auth") && localStorage.getItem("timings")) {

			var timings = JSON.parse(localStorage.getItem("timings"));

			const d = new Date();
			let day = d.getDay();
			let timing = "";
			if (timings.find((e) => e.weekday === day)) {
				if (
				timings[timings.findIndex((e) => e.weekday === day)]
					.is_allday_running == false
				)
				timing = timings[timings.findIndex((e) => e.weekday === day)];
			}
			if (!(timing != "" && timing.shifts!='' && timing.shifts!=null)) {
				if(active_register.value == ''){
					$('#terminalModal').modal('show');
				}
			}
	  }
	});

	const selected_terminal = ref('');

	async function selectTerminal(terminal){

		if(terminal.registered_device_id == null){

			selected_terminal.value = terminal;

			$('#terminalModal').modal('hide');

			$('#openRegisterModal').modal('show');

		}else{

			toast.warning('Terminal is already linked to a device '+terminal.registered_device_id);

		}
	
	}

	const all_terminals = computed(() => {
		return cashierStore.all_terminals;
	});

	const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );
	const AsyncOpenRegister = defineAsyncComponent( () => import('@/components/cashier/OpenRegister.vue') );

</script>