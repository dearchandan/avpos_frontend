<template>

   <teleport to='body' >
        <div class="modal hide cashier-layout-modal" id="closeRegisterModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header modal-title">
                        <h2 class="mb-0">{{ $t('Closing Register') }}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-if="is_shift_available"></button>
                    </div>
                    <div class="modal-body">

                        <div class="text-center my-2" v-if="force_closing"> <span class="text-danger">{{ $t("Sorry! The shift time has expired, either increase the shift time or close the register") }}</span> </div>
                        <div class="col text-center" v-if="force_closing">
                                <span class="btn btn-success btn-sm me-2" style="cursor: pointer;" @click="addTime(15)">+15 Mins</span>
                                <span class="btn btn-success btn-sm me-2" style="cursor: pointer;" @click="addTime(30)">+30 Mins</span>
                                <span class="btn btn-success btn-sm me-2" style="cursor: pointer;" @click="addTime(45)">+45 Mins</span>  
                                <span class="btn btn-success btn-sm me-2" style="cursor: pointer;" @click="addTime(60)">+60 Mins</span>  
                        </div>
                        <div class="text-center my-4" v-if="force_closing"> <h5 class="text-black fw-bold ">{{ $t("OR") }}</h5> </div>
                        <Form :validation-schema="schema" @submit="submit()" >
                            
                            <div class="form-feild py-3">
                                <label for="" class="">{{ $t('Cash In System') }}</label>
                                <h6 class="pt-2">{{  getRoundedValue(cash_in_system)  }} {{ currency_symbol  }} </h6>
                            </div>
                            
                            <VTextInput
                                type="text" 
                                name="cash_in_hand"
                                v-model="cash_in_hand"
                                :label="cash_in_hand_label" 
                                placeholder="" 
                                size="large"
                                required
                            />
                            
                            <div class="modal-btns" >
                                <button type="submit" class="btn btn-lg btn-primary">{{ $t('Close Register') }}</button>
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
    import useGlobalFunctions from "@/composables/global_functions.js";

    const props  = defineProps(['terminal_closing_time','force_closing',"cash_in_hand_remain","is_shift_available"]);
    const { t } = useI18n();
    const authStore = useAuthStore();
    const cashierStore = useCashierStore();

    const { getRoundedValue } = useGlobalFunctions();

    const currency_symbol = computed(() => {
      return authStore.user.currency.symbol;
    })

    const cash_in_hand = ref(0);
    const cash_in_hand_label = t("Cash In Hand");
    const schema = yup.object({
        cash_in_hand: yup.number().typeError(t('must be a number',{ name: t('Cash In Hand') })).required(t('name is required', { name: t('Cash In Hand') })).min(0,t('must be greater than or equal to 0', { name: t('Cash In Hand') })),
    });
    
    const emits = defineEmits(['openTerminal','closeRegister']);

    const terminal_id = computed(() => {
        return authStore.loggedInTerminal
    });
    
    const business_register_slack = computed(() => {
        return (authStore.loggedInTerminal) ? authStore.loggedInTerminal.active_business_register.slack : '';
    });
    
    const cash_in_system = computed(() => {
        return cashierStore.system_closing_cash;
    });

        

watch(() => 
     props.cash_in_hand_remain, (value) => {
          cash_in_hand.value = getRoundedValue(value);
      },
  );

    async function submit(){

        var form_data = new FormData();
        form_data.append('cash_in_system',cash_in_system.value);
        form_data.append('cash_in_hand',cash_in_hand.value);
        form_data.append('terminal_id',terminal_id.value);
        form_data.append('business_register_slack',business_register_slack.value);

        await axios.post('/api/business_register/close', form_data ).then( (response) => {
            
            if(response.data.status_code == 200) {
                                                    
                $('#closeRegisterModal').modal('hide');

                toast.success(response.data.msg);
                
                authStore.refresh();

                cashierStore.refreshTerminals();

                // emits('openTerminal');
                emits('closeRegister')

                router.push('/orders');

            }else{
                try{
                    server_messages.type = "error";
                    server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    server_messages.type = "error";
                    server_messages.messages = response.data.msg;
                }
                form.is_processing = false;
            }
            
        }).catch((error) => {
            server_messages.type = "error";
            server_messages.messages = error;
            form.is_processing = false;
            console.log(error);
        });
     
    }
    async function addLog(duration){

        var form_data = new FormData();
        form_data.append('duration',duration);
       form_data.append('terminal_id',authStore.user.logged_in_terminal.id)

        await axios.post('/api/business_register/add/log', form_data ).then( (response) => {
            
            if(response.data.status_code == 200) {
                                                    
                $('#closeRegisterModal').modal('hide');

                //cashierStore.refreshTerminals();

                // emits('openTerminal');
                emits('closeRegister')

                //router.push('/orders');

            }else{
                try{
                    server_messages.type = "error";
                    server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    server_messages.type = "error";
                    server_messages.messages = response.data.msg;
                }
                form.is_processing = false;
            }
            
        }).catch((error) => {
            server_messages.type = "error";
            server_messages.messages = error;
            form.is_processing = false;
            console.log(error);
        });
     
    }
    function addTime(minutes)
    {
        if(authStore.user.logged_in_terminal!=null){

            if(localStorage.getItem("timings")){
                var timings = JSON.parse(localStorage.getItem("timings"))
                const d = new Date();
                let day = d.getDay()
                let timing = '';
                if(timings.find(e => e.weekday === day))
                {
                if(timings[timings.findIndex(e => e.weekday === day)].is_allday_running == false)
                timing = timings[timings.findIndex(e => e.weekday === day)];
                }
                if(timing != '')
                {
                    var shifts = JSON.parse(timing.shifts)
                    var nowDate = new Date();
                    var current_shift = shifts[shifts.findIndex(e => (nowDate <= new Date(nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate()+" "+e.closing_time+":00") && nowDate >= new Date(nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate()+" "+e.opening_time+":00")))];
                    if(current_shift!=undefined){
                        var date = new Date(nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate()+" "+current_shift.closing_time+":00");
                        var new_closing_time = new Date(date.getTime() + minutes*60000);

                         var new_closing_stamp = (new_closing_time.getHours())+":"+(new_closing_time.getMinutes())
                        shifts[shifts.findIndex(e => (nowDate <= new Date(nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate()+" "+e.closing_time+":00") && nowDate >= new Date(nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate()+" "+e.opening_time+":00")))] = {"opening_time": current_shift.opening_time,"closing_time": new_closing_stamp};

                        var new_shifts = JSON.stringify(shifts);
                        timings[day-1].shifts = new_shifts;
                        localStorage.setItem("timings",JSON.stringify(timings));

                        addLog(minutes);

                    }
                }
                //emits('closeRegister');

            }
        }
    }

</script>