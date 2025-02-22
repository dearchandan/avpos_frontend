<template>

    <div class="card" v-if="ingredient != ''">
        <div class="row">
            <div class="col-12 py-3">
                <h4>{{ $t('Add Delivery Partner') }} </h4>  
            </div>
        </div>
        <div class="row" >
            <div class="col-3">
                <select class="form-control form-control-solid w-100" v-model="selected_delivery_partner" @change="addItem()">
                    <option value="" :selected="selected_delivery_partner == ''">-- {{ $t('Select Delivery Partner') }} --</option>
                    <option v-for="(delivery_partner,index) in select_delivery_partners" :value="delivery_partner"> {{  delivery_partner.name  }} </option>
                </select>
            </div>
            <Form
                @submit="update"
            >
                <div class="col-12 py-3">
                    <table class="table table-condensed">
                        <thead>
                            <tr>
                                <th width="40%">{{ $t('Delivery Partner') }} <em class="text-danger">*</em> </th>
                                <th width="45%">{{ $t('Sale Price') }}</th>
                                <th width="5%">{{ $t('Remove') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                                <tr v-if="delivery_partner_list != ''" v-for="(delivery_partner,index) in delivery_partner_list" :key="index">
                                    <td> <strong>{{  delivery_partner.delivery_partner_name }}</strong> </td>
                                    <td>
                                        <VTextInput
                                            type="number" 
                                            name="sale_price"
                                            v-model="delivery_partner.sale_price"
                                            :input_group_text="currency_symbol"
                                        />
                                    </td>
                                    <td class="text-center">
                                        <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeItem(delivery_partner)">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                                        </a>
                                    </td> 
                                </tr>
                                <tr v-else>
                                    <td colspan="9">{{ $t('No Delivery Partner Prices Found') }}</td>
                                </tr>
                            
                        </tbody>
                        
                    </table>
                </div>
                <div class="col-12 py-3" v-if="form.server_messages.messages != ''">
                    <ServerMessage  :server_messages="form.server_messages"  />
                </div>
                <div class="col-12 mt-2 text-end">
                    <button 
                    type="submit"
                    class="btn btn-primary" 
                    :disabled="form.is_submitting"
                    >
                        <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                        <span class="pt-0" v-if="form.is_submitting">
                            {{ $t('Saving...') }}
                        </span>
                        <span class="pt-0" v-else>
                            {{ $t('Save') }}
                        </span> 

                    </button>
                </div>
            </Form>
        </div>
    </div>

</template>

<script setup>

    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { Form } from 'vee-validate'
    import { useAuthStore } from '@/stores/auth';

    const auth = useAuthStore();
    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })

        
    const props = defineProps({
        ingredient : {
            type: Object
        },
        all_delivery_partners : {
            type: Object
        }
    });
    const ingredient = props.ingredient;
    const all_delivery_partners = props.all_delivery_partners;
    const branch_ingredient_delivery_partners = props.ingredient.branch_ingredient_delivery_partners;
    const selected_delivery_partner = ref('');
    
    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
        is_submitting: false,
    };

    const form = reactive({ ...initialState });

    // const schema = yup.object({
    //     quantity: yup.number().required().label('quantity'),
    //     sale_price: yup.number().required().label('sale price'),
    // });
    
    onMounted(() => {
        refreshData();   
    });

    function refreshData(){

        populateSelectDeliveryPartnerDropdown();
        
        listExistingDeliveryPartners();
        
    }

    const select_delivery_partners = ref([]);
    function populateSelectDeliveryPartnerDropdown(){
        select_delivery_partners.value = all_delivery_partners.filter(function(all_delivery_partner_item) {
            return !branch_ingredient_delivery_partners.find(function(ingredient_delivery_partner) {
                return all_delivery_partner_item.slack == ingredient_delivery_partner.delivery_partner.slack
            })
        })
    }
    
    const delivery_partner_list = ref([]);
    function listExistingDeliveryPartners(){
        _.forEach(branch_ingredient_delivery_partners, (value) => {
           let ingredient_delivery_partner_template = {
                product_delivery_partner_slack : value.slack,
                delivery_partner_id : value.delivery_partner.id,
                delivery_partner_name : value.delivery_partner.name,
                default_quantity : value.default_quantity,
                default_price : value.default_price,
                default_measurement_unit_id : value.default_measurement_unit_id,
            };
            delivery_partner_list.value.push(ingredient_delivery_partner_template);
        })
    }
    
    function addItem(){

        if(selected_delivery_partner.value != ''){
            
            let ingredient_delivery_partner_template = reactive({
                product_delivery_partner_slack : '',
                delivery_partner_id : selected_delivery_partner.value.id,
                delivery_partner_name : selected_delivery_partner.value.name,
                default_quantity : '',
                default_price : ingredient.sale_price,
                default_measurement_unit_id : ingredient.stock_measurement_unit_id,
            });
    
            delivery_partner_list.value.push(ingredient_delivery_partner_template);
            select_delivery_partners.value.splice(select_delivery_partners.value.indexOf(selected_delivery_partner.value), 1);
            selected_delivery_partner.value = '';
            
        }
    }
    
    function removeItem(item){
        
        delivery_partner_list.value.splice(delivery_partner_list.value.indexOf(item), 1);
        let delivery_partner =  _.find(all_delivery_partners, (value) => {
            return value.id == item.delivery_partner_id
        });
        select_delivery_partners.value.push(delivery_partner);
        select_delivery_partners.value = _.sortBy(select_delivery_partners.value, (value) => { return value.name; });

    }

    async function update(){

        form.is_submitting = true;

        var form_data = new FormData();
        form_data.append('ingredient_slack',ingredient.slack);
        form_data.append('branch_id',auth.user.branch_id);
        form_data.append('delivery_partners',JSON.stringify(delivery_partner_list.value));

        await axios.post('/api/ingredient/delivery_partner/update', form_data).then( (response) => {
            
            form.is_submitting = false;
            
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);

                resetData();

            }else{
                try{
                    form.server_messages.type = "error";
                    form.server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    form.server_messages.type = "error";
                    form.server_messages.messages = response.data.msg;
                }
                form.is_submitting = false;
            }
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            form.is_submitting = false;
            console.log(error);
        });

    }   

    function resetData(){
        selected_delivery_partner.value = '';
    }

</script>