<template>
 
    <div class="modal hide cashier-layout-modal" id="dineInModal"  tabindex="-1" aria-labelledby="Selcet Dine In Table" aria-modal="true" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false">

        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header modal-title border-0">
                    
                    <div class="row align-items-center justify-content-between w-100">
                        
                        <div class="col-auto">
                            <div class="row align-items-center">
                                <div class="col-4 col-md-5" v-if="!dinein_mode">
                                    <div class="form-field mb-0">
                                        <VueDatePicker v-model="booking_date" @update:model-value="fetchTables()" :format="'dd-MM-yyyy'" :enable-time-picker="false"  />
                                    </div>
                                </div>
                                
                                <div class="col-auto">
                                    <ul class="nav nav-tabs seats-tabs" role="tablist">
                                        <li>{{ $t('AREAS') }} :</li>
                                        <li class="nav-item" role="" v-for="(area,index) in data.areas">
                                            <button class="nav-link" :class="{ 'active' :  (filters.active_area == index) }" @click="selectArea(index,area.id)" id="" type="button" role="tab" aria-selected="true" tabindex="-1">{{ area.name }}</button>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-auto">
                                    <ul class="nav nav-tabs seats-tabs" role="tablist">
                                        <li>{{ $t('SEATS') }} :</li>
                                        <li class="nav-item" role="presentation" >
                                            <button class="nav-link" :class="{ 'active' :  (filters.active_seat == null) }"  @click="selectSeat(null,null)" type="button" aria-selected="false" tabindex="-1">{{ $t('ALL') }}</button>
                                        </li>
                                        <li class="nav-item" role="presentation" v-for="(seat,index) in data.seats">
                                            <button class="nav-link" :class="{ 'active' :  (filters.active_seat == index) }" @click="selectSeat(index,seat)" type="button" aria-selected="false" tabindex="-1">{{  seat  }}</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto pe-0">
                            <div class="row align-items-center">
                                <!-- <div class="col-auto">

                                    <div class="form-check switch_label_right form-switch mb-0 me-3">
                                        <label>{{ $t('Show Only Available') }}
                                            <input class="form-check-input" v-model="filters.show_only_available" type="checkbox" role="switch">
                                        </label>
                                    </div>
                                </div> -->
                             
                                <div class="col-auto pe-0">
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal()" ></button>
                    
                </div>
                <div class="modal-body pt-0">
                    <div class="table-seats-wrap">
                        <div class="tab-content" data-simplebar>
                            
                            <div class="tab-pane fade show" id="seats_all" role="tabpanel">
                                <div class="c_table-wrap">
                                    <div class="row">
                                        
                                        <div class="text text-muted text-center pt-5" v-if="!filtered_tables">
                                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                                            {{ $t('Loading Tables') }}
                                        </div>
                                        <h5 class="text-muted text-center p-5" v-if="filtered_tables.length == 0">
                                            <span>{{ $t('No Tables Found') }}</span>
                                        </h5>

                                        <div class="col-4 mt-5" v-for=" (table,index) in filtered_tables ">
                                            <div class="c_table" :data-table-seat="table.table_capacity" :data-table-status="getTableStatus(table)" :data-table-area="table.table_capacity" @click="openDineInSeatModal(table)">
                                                <h3>{{ table.name }}</h3>
                                                <p> <Icon icon="fa6-solid:users" /> {{ table.table_capacity  }}</p>
                                            </div>
                                            <div class="c_table_data" v-if="table.reservations.length">
                                                <table class="table" >
                                                    <tr>
                                                        <th width="50%" style="font-size:10px !important;">{{ $t('Person') }}</th>
                                                        <th width="20%" style="font-size:10px !important;">{{ $t('Time') }}</th>
                                                        <th width="30%" style="font-size:10px !important;">{{ $t('Order') }}</th>
                                                    </tr>
                                                    
                                                    <tr v-for="(reservation,index) in table.reservations" :class="[ { 'text-danger' : reservation.checked_in_at != null && reservation.spent_minutes > 45 } , { 'text-success' : reservation.checked_in_at != null && reservation.spent_minutes <= 45 }, { 'bg-warning fw-bold' : reservation.is_check_in_time && reservation.checked_in_at == null }, { 'bg-success fw-bold' : reservation.is_check_in_time && reservation.checked_in_at != null} ]">
                                                        <td> 
                                                            {{ reservation.person_name  }} 
                                                            <br> {{ reservation.person_contact  }} (<Icon icon="fa6-solid:users" class="p-0" />{{ reservation.reserved_seats  }})
                                                        </td>

                                                        <td v-if="reservation.checked_in_at == null">{{ reservation.reservation_time_formatted   }}</td>
                                                        <td v-else >{{ reservation.checked_in_at_formatted  }}</td>

                                                        <td > 
                                                            <a v-if="reservation.is_check_in_time && reservation.checked_in_at == null" class="btn btn-xs btn-success" href="#" @click="checkIn(reservation.id)">{{ $t('Check-In') }}</a>
                                                            <a v-if="reservation.checked_in_at == null" class="ms-1 btn btn-xs btn-warning" href="#" @click="cancelBooking(reservation.id)" :class="[ reservation.is_check_in_time ? 'w-40' : 'w-100' ]">{{ $t('Cancel') }}</a> 
                                                            <a v-else href="#" class="btn btn-xs ms-1" :class="[ reservation.spent_minutes > 45 ? 'btn-danger' : 'btn-success' ]" @click="cancelBooking(reservation.id)" >{{ $t('Free Table') }}</a> 
                                                        </td>

                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                        <!-- <div class="seats-counter-wrap">
                            <div class="row align-items-center justify-content-between">
                                <div class="col-auto">
                                    <ul class="seats-info">
                                        <li>{{ $t('Available') }} <b>{{  data.available_tables  }}</b> </li>
                                        <li class="reserved">{{ $t('Occupied') }} <b> {{ data.occupied_tables }} </b> </li>
                                    </ul>
                                </div>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <AsyncSelectDineInSeat />
    
</template>

<script setup>
    
    import VueDatePicker from '@vuepic/vue-datepicker';
	import { useCashierStore } from '@/stores/cashierStore';
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    // import wosul_logo from '@/assets/images/flag.png';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();

	const cashierStore = useCashierStore();

    const props = defineProps(['show_dine_in_modal']);
    
    const dinein_mode = ref(false);

    watch(() => props.show_dine_in_modal, (newValue) => {
      
        if(newValue){
            fetchTables();
        }

    });
    

    const initialState = {
        server_messages : {
            type : "",
            messages : "",
        },
        is_processing: false,
    };
    const form = reactive({ ...initialState });

    const filterState = {
        areas: [],
        active_area: "",
        selected_area: "",
        seats: [],
        active_seat: null,
        selected_seat: null,
        show_only_available: (dinein_mode.value) ? true : false,
    };
    const filters = reactive({ ...filterState });

    const data = ref([]);
    const filtered_tables = ref([]);

    const booking_type = computed(() => {
        return cashierStore.booking_type;
    })
    
    const booking_date = computed({
        get() {
            return cashierStore.booking_date;
        },
        set(newValue) {
            cashierStore.setBookingDate(newValue);
        }
    })

    const booking_data = computed(() => {
        return cashierStore.booking_data;
    })

    watch(() => booking_data.value, (newValue) => {
        fetchTables();
    }, { deep: true });

    async function fetchTables(){

        if(booking_date.value != 'Invalid date'){

            form.is_processing = true;  
    
            var form_data = new FormData();
            form_data.append('booking_date', booking_date.value);
            form_data.append('booking_type', booking_type.value);
            form_data.append('booking_data', JSON.stringify(booking_data.value));
            
            await axios.post('/api/cashier/tables', form_data ).then( (response) => {
                
                form.server_messages.type = "success";
                form.server_messages.messages = response.data.msg;
                data.value = response.data.data;
                filtered_tables.value = data.value.tables;
                filters.selected_area = (data.value.areas.length > 0) ? data.value.areas[0].id : null;
                form.is_processing = false;
                
                applyFilters();
                
            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                form.is_processing = false;
                console.log(error);
            });
        
        }

    }

    const emit= defineEmits(["closeDineInModal"])
 
    function closeModal() {
        emit("closeDineInModal");
    }

  /* Filtering */

    watch(filters, (newValue, oldValue) => {
        applyFilters();
    });

    async function applyFilters(){
        
        if (filters.selected_area != null) {
            filtered_tables.value = _.filter(data.value.tables, (item) => {
                return item.dinein_area_id == filters.selected_area;
            })
        }

        if (filters.selected_seat != null) {
            filtered_tables.value = _.filter(filtered_tables.value, (item) => {
                return item.table_capacity == filters.selected_seat;
            })
        }

        if (filters.show_only_available) {
            filtered_tables.value = _.filter(filtered_tables.value, (item) => {
                return item.status == 0;
            })
        }else{
            filtered_tables.value = _.filter(filtered_tables.value, (item) => {
                return item.status == 1 || item.status == 0;
            })
        }
        
        // console.log(filtered_tables.value);
    }

    function selectArea(index,id){
        filters.active_area = index;
        filters.selected_area = id;
    }

    function selectSeat(index,id){
        if(index != null){
            filters.active_seat = index;
            filters.selected_seat = id;
        }else{
            filters.active_seat = null;
            filters.selected_seat = null;
        }
    }

	function openDineInSeatModal(table){
        
        
        if(booking_type.value == 1){
            $('#dineInSeatModal').modal('show');
            cashierStore.setTable(table);
            cashierStore.setSeats(table.table_capacity);
            cashierStore.setOrderType(2);
        }else{
            
            bookTable(table);
            
        }
        
        $('#dineInModal').modal('hide');

    }

    async function bookTable(table){
     
        var form_data = new FormData();
        form_data.append('table', JSON.stringify(table));
        form_data.append('booking_data', JSON.stringify(booking_data.value));
        
        await axios.post('/api/cashier/book_table', form_data ).then( (response) => {
            
            if(response.data.status_code == 200) {
                
                toast.success(response.data.msg);

            }else{
                
                toast.error(response.data.msg);
        
            }
        
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            form.is_processing = false;
            console.log(error);
        });
    
    }
    
    async function cancelBooking(id){
     
        var form_data = new FormData();
        form_data.append('reservation_id', id);
        
        await axios.post('/api/cashier/cancel_table_booking', form_data ).then( (response) => {
            
            if(response.data.status_code == 200) {
                
                toast.success(response.data.msg);
                fetchTables();

            }else{
                
                toast.error(response.data.msg);
        
            }
        
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            form.is_processing = false;
            console.log(error);
        });
    
    }
    
    async function checkIn(id){
     
        var form_data = new FormData();
        form_data.append('reservation_id', id);
        
        await axios.post('/api/cashier/check_in_table', form_data ).then( (response) => {
            
            if(response.data.status_code == 200) {
                
                toast.success(response.data.msg);
                fetchTables();

            }else{
                
                toast.error(response.data.msg);
        
            }
        
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            form.is_processing = false;
            console.log(error);
        });
    
    }

    function getTableStatus(table){
        if(table.is_checked_in){
            return 'checkedin';
        }else if(!table.is_checked_in && table.is_reserved){
            return 'reserved';
        }
    }

    const AsyncSelectDineInSeat = defineAsyncComponent( () => import('@/components/cashier/restro/SelectDineInSeat.vue') );

</script>