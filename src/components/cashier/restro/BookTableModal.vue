<template>
    <teleport to="body" >
        <div class="modal hide cashier-layout-modal" id="bookTableModal" tabindex="5" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title ">
							<h2 class="mb-0 ">{{ $t("Book Table") }}</h2>
						</div>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<Form :validation-schema="schema" @submit="selectTable" v-slot="{ setFieldValue,values }" enctype="multipart/form-data">
							<div class="row">
								<div class="col-md-6">
									<VTextInput
									type="datetime-local"
									name="booking_datetime"
									:label="labels.booking_datetime"
									:required="true"
								/>
								</div>
								<div class="col-md-6">
									<VTextInput
										type="number" 
										name="seats"
										:label="labels.seats"
										:required="true"
									/>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<VTextInput
									type="number"
									name="mobile_number"
									:label="labels.mobile_number"
									:required="true"
									:input_group_text="country_code"
									input_group_position="before"
								/>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<VTextInput
										type="text" 
										name="person_name"
										:label="labels.person_name"
									/>
								</div>
							</div>
						
							<div class="modal-btns">
								<button 
									type="submit"
									class="btn btn-primary" 
									>   <span class="pt-0">
											{{ $t('Select Table') }}
										</span>
										<svg class="ms-2 me-2" width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 5.25C0.585786 5.25 0.25 5.58579 0.25 6C0.25 6.41421 0.585786 6.75 1 6.75V5.25ZM17.5303 6.53033C17.8232 6.23744 17.8232 5.76256 17.5303 5.46967L12.7574 0.696699C12.4645 0.403806 11.9896 0.403806 11.6967 0.696699C11.4038 0.989592 11.4038 1.46447 11.6967 1.75736L15.9393 6L11.6967 10.2426C11.4038 10.5355 11.4038 11.0104 11.6967 11.3033C11.9896 11.5962 12.4645 11.5962 12.7574 11.3033L17.5303 6.53033ZM1 6.75H17V5.25H1V6.75Z" fill="white"/>
										</svg> 
								</button>
							</div>
						</Form>
						
					</div>
				</div>
			</div>
        </div>
        </teleport>
</template>

<script setup>
	
	import { useAuthStore } from '@/stores/auth';
	import { useCashierStore } from '@/stores/cashierStore';
    import useGlobalFunctions from '@/composables/global_functions.js';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
	import { Form,Field } from 'vee-validate'
	import * as yup from 'yup';
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n();
    const authStore = useAuthStore();
    const cashierStore = useCashierStore();

    const server_messages = reactive({
        type : "",
        messages : "",
    });

	const labels = ref({
		booking_datetime : t('Booking Date & Time'),
		seats : t('Seats'),
		mobile_number : t('Mobile Number'),
		person_name : t('Booking Person Name'),
	});

	const schema = yup.object({ 
		seats: yup.number().required(t('Please enter seats', { name: t('Seats') })),
		booking_datetime: yup.string().required(t('Please select booking date & time', { name: t('Select Booking Date & Time') })),
		mobile_number: yup.number().required(t('Please enter mobile number', { name: t('Mobile Number') })),
	});

	const country_code = computed(() => {
		return authStore.user.country.country_code;
	})

	
	const emits = defineEmits(['refreshDineInTables']);

	function selectTable(values){
		
		emits('refreshDineInTables',values);

		$('#bookTableModal').modal('hide');

	}

</script>
