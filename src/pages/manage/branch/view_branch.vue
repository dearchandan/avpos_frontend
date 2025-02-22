<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/branches" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t("Branches") }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ branch.name  }} </h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <div class="page-heading">
                <div class="py-3" v-if="form.server_messages.messages != ''">
                    <ServerMessage :server_messages="form.server_messages"  />
                </div>
            </div>

            <ListingSkeleton v-if="is_loading" />            
              
            <div v-else class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="row">
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Total No. of Orders") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.total_order_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Total Order Amount") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ parseFloat(dashboard_data.total_order_amount).toFixed(2) }} {{ currency_symbol }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Today's No. of Orders") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.todays_total_order_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Today's Order Amount") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ parseFloat(dashboard_data.todays_total_order_amount).toFixed(2) }} {{ currency_symbol }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--  invoice  -->
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Order on Hold") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.hold_total_order_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Orders In Kitchen") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.kitchen_total_order_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Total No. of Return Orders") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.total_order_return_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Total Return Order Amount") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ parseFloat(dashboard_data.total_order_return_amount).toFixed(2) }} {{ currency_symbol }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Today's No. of Return Orders") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">{{ dashboard_data.todays_total_order_return_count }}</h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-3">
                                <div class=" ">
                                    <div class="card">
                                        <div class="d-flex align-items-start flex-column box-content">
                                            <div class="p-2 theme-color-blue">
                                                {{ $t("Today's Return Order Amount") }}
                                            </div>
                                            <div class="mt-auto p-2">
                                                <span class="text-headline">
                                                    <h4 class="theme-color-blue">
                                                        {{ parseFloat(dashboard_data.todays_total_order_return_amount).toFixed(2) }} {{ currency_symbol }}
                                                    </h4>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-6 col-md-2 mx-auto">
                    <div class="card">
                        <div v-if="branch == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else class="text-center">
                            <img v-lazy="branch.logo">
                        </div>
                    </div>
                </div>
                <div class="col-md-10">
                    <div class="card">
                        <div v-if="branch == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else>
                            <div class="row">
                                
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Branch Name") }}:</b>
                                            {{ branch.name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Email") }}</b>
                                            {{ branch.email }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Branch Code") }}</b>
                                            {{ branch.code }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("VAT Registration Name") }}:</b>
                                            {{ branch.vat_registration_name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("VAT Number") }}:</b>
                                            {{ branch.vat_number }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("GST Number") }}:</b>
                                            {{ branch.gst_number }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Address") }}:</b>
                                            <span v-if="branch.first_address_line != null || branch.city != null ">
                                                {{ branch.first_address_line }}, {{ branch.second_address_line }}, {{ branch.district }}, {{ branch.city }}, , {{ branch.pincode }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4" v-if="branch.created_by">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Created By") }}:</b>
                                            {{ branch.created_by.name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4" v-if="branch.updated_by">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Created By") }}:</b>
                                            {{ branch.updated_by.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Created At") }}:</b>
                                            {{ branch.created_at_label }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Updated At") }}:</b>
                                            {{ branch.updated_at_label }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Invoice Policy") }}:</b>
                                            {{ branch.invoice_policy }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("POS Policy") }}:</b>
                                            {{ branch.pos_policy }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Purchase Policy") }}:</b>
                                            {{ branch.purchase_policy }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t("Quotation Policy") }}:</b>
                                            {{ branch.quotation_policy }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="row pb-4 align-items-center">
                            <div class="col-7">
                                <h4 class="mb-0">{{ $t("Banks") }}</h4>  
                            </div>
                            <div class="col-5 text-end">
                                <a 
                                    class="btn btn-primary btn-sm" 
                                    href="#"
                                    data-bs-toggle="modal" 
                                    @click="openAddBranchBankModal()" 
                                    data-bs-target="#addBranchBankModal"
                                    >   
                                    + {{ $t("Add Bank") }}
                                </a> 
                            </div>
                        </div>
                        <div v-if="is_banks_listing">
                             <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else class="table-responsive">
                            <table class="table table-condensed">
                                <thead>
                                    <tr>
                                        <th class="fw-bold">{{ $t("Bank Name") }}</th>
                                        <th class="fw-bold">{{ $t("A/C Holder") }}</th>
                                        <th class="fw-bold">{{ $t("A/C Number") }} </th>
                                        <th class="fw-bold">{{ $t("IBAN") }}</th>
                                        <th class="fw-bold">{{ $t("IFSC") }}</th>
                                        <th class="fw-bold">{{ $t("Created At") }}</th>
                                        <th class="fw-bold">{{ $t("Is Default") }}</th>
                                        <th scope="col" class="text-end">{{ $t("Action") }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="branch_banks != ''" v-for="(bank,bank_index) in branch_banks" :key="bank_index">
                                        <td>{{  bank.bank_name }}</td>
                                        <td>{{  bank.account_holder_name }}</td>
                                        <td>{{  bank.account_number }}</td>
                                        <td>{{  bank.iban_number }}</td>
                                        <td>{{  bank.ifsc_number }}</td>
                                        <td>{{  bank.created_at_label }}</td>
                                        <td>
                                            <div class="form-feild">
                                                <div class="form-check form-switch form-switch-2">
                                                    <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(bank.slack)" :checked="bank.status == 1">
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-end">

                                            <div class="row flex-nowrap gx-2 text-end">
                                                <div class="col-auto">
                                                    <a class="btn btn-icon btn-xs btn-light" href="#" data-bs-toggle="modal" @click="openBankModal(bank)" data-bs-target="#addBankModal"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 512 512" class="iconify iconify--fa6-solid"><path fill="currentColor" d="m362.7 19.3l-48.4 48.4l130 130l48.4-48.4c25-25 25-65.5 0-90.5l-39.4-39.5c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2c-2.5 8.5-.2 17.6 6 23.8s15.3 8.5 23.7 6.1L151 475.7c14.1-4.2 27-11.8 37.4-22.2l233.3-233.2z"></path></svg></a>
                                                </div>
                                                <div class="col-auto">
                                                    <a class="btn btn-icon btn-xs btn-light-danger" href="#" @click="deleteBranchBank(bank.slack)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg></a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td class="text-center py-3" colspan="9">{{ $t("No Data Found") }}</td>
                                    </tr>
                                </tbody>
                                
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card">
                        <div class="row pb-4">
                            <div class="col-7">
                                <h4>{{ $t("Branch Timings") }}</h4>  
                            </div>
                            <div class="col-5 text-end">
                                    <div class="form-switch ">
                                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" v-model="enable_timings" @change="enableTiming()">
                                    </div>
                            </div>
                        </div>
                        <table class="table table-condensed" v-if="enable_timings">
                            <thead>
                                <tr>
                                    <th width="20%" class="fw-bold">{{ $t("Day") }}</th>
                                    <th width="20%" class="fw-bold">{{ $t("24 Hours") }}</th>
                                    <th width="" class="fw-bold">{{ $t("Shifts") }} </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="timings" v-for="(timing,index) in timings">
                                    
                                    <td>{{  getWeekDayName(timing.weekday) }}</td>
                                
                                    <td>
                                        <div class="form-feild">
                                            <div class="form-check form-switch form-switch-2">
                                                <input class="form-check-input" type="checkbox" role="switch" id="Status_id" v-model="timing.is_allday_running" :checked="timing.is_allday_running" @change="updateTimings(timing)">
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <table>
                                            <thead v-if="timing.shifts">
                                                <tr v-for="shift in convertToArray(timing.shifts)">
                                                    <td :class="[ timing.is_allday_running == 1 ?  'text-muted disabled' : 'fw-bold' ]" >
                                                         <Icon icon="material-symbols:alarm-outline" class="pe-2" style="font-size: 16px;" /> 
                                                         <span>{{  shift.opening_time  }} {{ $t("to") }} {{  shift.closing_time  }}</span>
                                                    </td>
                                                    <td class="text-end">
                                                        <a role="button" class="text-danger" @click="deleteShift(timing.id,shift)">
                                                            <Icon icon="radix-icons:cross-2" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr v-if="!timing.is_allday_running">
                                                    <td colspan="2" class="text-primary" >
                                                        <a data-bs-toggle="modal" href="#" @click="openShiftModal(timing.weekday)" data-bs-target="#ShiftModal" >+ {{ $t("Add Shift") }}</a>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </td>
                                </tr>
                               
                            </tbody>
                        </table>
                         <!-- <div class="mt-2 text-end">
                             <button 
                             type="submit"
                             class="btn btn-primary"
                             @click="updateBranchShifts()" 
                             > -->
                                 <!-- <clip-loader v-if="form.is_saving" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                 <span class="pt-0" v-if="form.is_saving">
                                     {{ $t("Saving...") }}
                                 </span>
                                 <span class="pt-0" v-else> 
                                     {{ $t("Save") }}
                                 </span>  -->
 <!-- 
                             </button>
                         </div> -->
                    </div>
                </div>
            </div>

        </div>

        <AsyncAddBranchBank :show_add_branch_bank_modal="show_add_branch_bank_modal" @closeAddBranchBankModal="closeAddBranchBankModal" :branch_slack="slack" />
        
        <AsyncAddShift :show_shift_modal="show_shift_modal" @closeShiftModal="closeShiftModal" :branch_slack="slack" :weekday="selected_weekday" />

     </DefaultLayout>
     
</template>

<script setup>

import {ref, reactive, onMounted } from 'vue';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth';
	
const authStore = useAuthStore();

const { t } = useI18n();
const AsyncAddBranchBank = defineAsyncComponent( () => import('@/components/branch/AddBranchBank.vue') );
const AsyncAddShift = defineAsyncComponent( () => import('@/components/branch/AddShift.vue') );

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});
const route = useRoute();
const slack = route.params.slack;

const dashboard_data = ref([]);
const is_loading = ref(false);
const branch = ref([]);

const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
};

const form = reactive({ ...initialState });

onMounted(()=> {
    getBranch();
    fetchTimings();
    getBranchDashboardData();
});

async function getBranch(){

    is_loading.value = true;

    await axios.get('/api/branch', { params : {
            slack : slack,
        } }).then( (response) => {
    
        branch.value = response.data.data;
        enable_timings.value = (response.data.data.enable_timings == 1) ? true : false;
        is_loading.value = false;
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        // console.log(error);
    });

}

let timings = reactive([]);

async function fetchTimings(){

    is_loading.value = true;

    await axios.get('/api/branch/timings', { params : {
            slack : slack,
        } }).then( (response) => {
        
        timings = response.data.data;
      
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        console.log(error);
    });

}

const enable_timings = ref(false);
const is_timings_updating = ref(false);

async function updateTimings(timing){

    var form_data = new FormData();
    form_data.append('id',timing.id);
    form_data.append('is_allday_running',timing.is_allday_running);

    await axios.post('/api/branch/update_timings', form_data).then( (response) => {
    
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            authStore.refresh();

        }else{
            try{
                form.server_messages.type = "error";
                form.server_messages.messages = JSON.parse(response.data.msg);
            }catch(err){
                form.server_messages.type = "error";
                form.server_messages.messages = response.data.msg;
            }
            is_timings_updating.value = false;
        }
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_timings_updating.value = false;
        // console.log(error);
    });

}

/* Bank */
const show_add_branch_bank_modal = ref(false);

function openAddBranchBankModal(){
    show_add_branch_bank_modal.value = true; 
}
function closeAddBranchBankModal(){
    show_add_branch_bank_modal.value = false;
    getBranchBanks(); 
}

const is_banks_listing = ref(false);
const branch_banks = ref([]);

getBranchBanks();

async function getBranchBanks(){

    is_banks_listing.value = true;

    await axios.get('/api/branch/banks', { params : {
            branch_slack : slack,
        } }).then( (response) => {

        branch_banks.value = response.data.data;
        is_banks_listing.value = false;
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_banks_listing.value = false;
        // console.log(error);
    });

}

async function changeStatus(slack){
    
    var form_data = new FormData();
    form_data.append('slack',slack);

    await axios.post('/api/branch/bank/update_status', form_data).then( (response) => {

        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            getBranchBanks();

        }else{
            try{
                form.server_messages.type = "error";
                form.server_messages.messages = JSON.parse(response.data.msg);
            }catch(err){
                form.server_messages.type = "error";
                form.server_messages.messages = response.data.msg;
            }
        }
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        // console.log(error);
    });
}

async function enableTiming(){

    // if(enable_timings.value){
        
        var form_data = new FormData();
        form_data.append('slack',slack);
        form_data.append('status',enable_timings.value);
    
        await axios.post('/api/branch/enable_timings', form_data).then( (response) => {

            if(response.data.status_code == 200) {
                
                toast.success(response.data.msg);
                fetchTimings();
                authStore.refresh();
    
            }else{
                try{
                    form.server_messages.type = "error";
                    form.server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    form.server_messages.type = "error";
                    form.server_messages.messages = response.data.msg;
                }
            }
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            // console.log(error);
        });

    // }
}

async function deleteBranchBank(slack){

    var is_confirmed = false;

    await Swal.fire({
        title: t('Do you want to delete this item?'),
        showCancelButton: true,
        confirmButtonText: t('Yes, Delete'),
        confirmButtonColor: '#d33',
        cancelButtonText: t('Cancel'),
    }).then( (result) => {
        if(result.isConfirmed){
            is_confirmed = true;        
        }
    });

    if(is_confirmed){

        await axios.post('/api/branch/bank/delete',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {
            
            Swal.fire(response.data.msg);
            getBranchBanks();

        }else{
            try{
                form.server_messages.type = "error";
                form.server_messages.messages = JSON.parse(response.data.msg);
            }catch(err){
                form.server_messages.type = "error";
                form.server_messages.messages = response.data.msg;
            }
        }

        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            // console.log(error);
        });
    }

}

async function deleteShift(id, shift){

    let form_data = new FormData();
    form_data.append('id',id);
    form_data.append('shift',JSON.stringify(shift));

    await axios.post('/api/branch/shift/delete',form_data).then( (response) => {
        
    if(response.data.status_code == 200) {

        toast.success(response.data.msg);
        authStore.refresh();
        fetchTimings();

    }else{
        try{
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
        }catch(err){
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
        }
    }

    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        // console.log(error);
    });
}

async function updateBranchShifts(){
 
         var form_data = new FormData();
         form_data.append('branch_slack',slack);
         form_data.append('timings',JSON.stringify(timings));
  
         await axios.post('/api/branch/update_branch_timings', form_data).then( (response) => {
             
             //form.is_saving = true;
 
             if(response.data.status_code == 200) {
 
                 toast.success(response.data.msg);
                 //form.is_saving = false;
                 //$('#ShiftModal').modal('hide');
                //  emit('closeShiftModal');
                //  authStore.refresh();
                //  resetData();

 
             }else{
                 try{
                     form.server_messages.type = "error";
                     form.server_messages.messages = JSON.parse(response.data.msg);
                 }catch(err){
                     form.server_messages.type = "error";
                     form.server_messages.messages = response.data.msg;
                 }
                 //form.is_saving = false;
             }
             
         }).catch((error) => {
             form.server_messages.type = "error";
             form.server_messages.messages = error;
             form.is_saving = false;
             console.log(error);
         });
 
     }
const show_shift_modal = ref(false);
const selected_weekday = ref("");

function openShiftModal(weekday){
    selected_weekday.value = weekday;
    show_shift_modal.value = true; 
}
function closeShiftModal(){
    show_shift_modal.value = false;
    fetchTimings();
}

function convertToArray(string){
    return JSON.parse(string);
}
function getWeekDayName(weekday){
    let week = [t('Monday'),t('Tuesday'),t('Wednesday'),t('Thursday'),t('Friday'),t('Saturday'),t('Sunday')];
    return week[ weekday - 1 ];
}

async function getBranchDashboardData(){
    is_loading.value = true;
    await axios.get('/api/branch/dashboard_data', { params : {
            slack : slack,
        } }).then( (response) => {
        dashboard_data.value = response.data.data;
        is_loading.value = false;
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        console.log(error);
    });
}
</script>