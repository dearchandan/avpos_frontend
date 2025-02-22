<template>

    <div v-if="product != ''">
        
        <div class="row" v-if="product.price_type == 3 && product.ingredients.length <= 0 ">
            <div class="alert alert-warning p-3"> <Icon icon="fa6-solid:circle-info"/>  {{ $t('Please add ingredients to access inventory section') }}</div>
        </div>

        <div class="row" v-else>
            <Form
                @submit="update"
                :validation-schema="schema"
                :initial-values="form"
            >
                <div class="col-12 py-3">
                    <div class="card">
                        <div class="row mb-3">
                            <div class="col-4">
                                <label class="label  "> {{ $t('Branch') }}</label>
                            </div>
                            <div class="col-8">
                                <div class="form-field ">
                                <strong>{{  auth.user.login_branch.name }}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <label class="label  ">  {{ (auth.user.login_branch.tax_inclusive_pricing) ? $t('Sale Price (Incl. Tax)') : $t('Sale Price (Excl. Tax)') }}</label>
                            </div>
                            <div class="col-8">
                                <label for="" v-if="product.price_type == 3">{{ inventory.sale_price }} {{ currency_symbol }} / Unit</label>
                                    
                                <VTextInput
                                    type="number"
                                    :name="'sale_price'"
                                    :input_group_text="product.sale_measurement_unit_id ? '/ ' + (language == 'ar' && product.sale_measurement_unit.abbreviation_ar != '' && product.sale_measurement_unit.abbreviation_ar != null)?product.sale_measurement_unit.abbreviation_ar:product.sale_measurement_unit.abbreviation : labels.per_unit"
                                    v-model="form.sale_price"
                                    step="1"
                                    size="small"
                                    label=""
                                    :class="''"
                                    :islabel=false
                                    v-else
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" v-if="product.is_stockable">
                                <label class="label  ">  {{ $t('Quantity') }} <span class="text-danger">*</span></label>
                            </div>
                            <div class="col-8" v-if="product.is_stockable">
                                <VTextInput
                                    type="number"
                                    :name="'quantity'"
                                    :input_group_text="product.stock_measurement_unit_id ? (language == 'ar' && product.stock_measurement_unit.abbreviation_ar != '' && product.stock_measurement_unit.abbreviation_ar != null)?product.stock_measurement_unit.abbreviation_ar:product.stock_measurement_unit.abbreviation : labels.units"
                                    v-model="form.quantity"
                                    step="1"
                                    label=""
                                    :class="''"
                                    :islabel=false
                                    size="small"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <label class="label  "> {{ $t('SKU') }}</label>
                            </div>
                            <div class="col-8">
                                <div class="form-field ">
                                <input
                                    type="text" 
                                    name="sku"
                                    v-model="form.sku"
                                    class="form-control form-control-solid "
                                />
                                </div>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-4" v-if="product.is_stockable">
                                <label class="label  "> {{ $t('Alert Quantity') }}</label>
                            </div>
                            <div class="col-8" v-if="product.is_stockable">
                                <div class="input-group ">
                                    <input
                                        type="number" 
                                        name="alert_quantity"
                                        class="form-control form-control-solid "
                                        v-model="form.alert_quantity"
                                        :input_group_text="product.stock_measurement_unit_id ? (language == 'ar' && product.stock_measurement_unit.abbreviation_ar != '' && product.stock_measurement_unit.abbreviation_ar != null)?product.stock_measurement_unit.abbreviation_ar:product.stock_measurement_unit.abbreviation : labels.units"
                                    />
                                    <div class="input-group-append" >
                                        <span class="input-group-text h-100 form-control-solid">{{ product.stock_measurement_unit_id ? (language == 'ar' && product.stock_measurement_unit.abbreviation_ar != '' && product.stock_measurement_unit.abbreviation_ar != null)?product.stock_measurement_unit.abbreviation_ar:product.stock_measurement_unit.abbreviation : labels.units }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <label class="label  "> {{ $t('Show In') }}</label>
                            </div>
                            <div class="col-8">
                                <!-- <select class="form-control form-control-solid" name="" id="" v-model="form.show_in">
                                    <option value="" :selected="form.show_in == ''">{{ $t('Everywhere') }}</option>
                                    <option :value="option.value" v-for="(option,index) in show_in_options" :key="index">{{ option.value }}</option>
                                </select> -->
                                <VRadio
                                          type="radio"
                                          name="mode"
                                          v-model="form.show_in"
                                          :label="''"
                                          :required="true"
                                          :options="show_in_options"
                                      />
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-4">
                                <label class="label"> {{ $t('Is Favorite') }}</label>
                            </div>
                            <div class="col-8">
                                <div class="form-check form-switch ">
                                    <input class="form-check-input" type="checkbox" role="switch" id="is_favorite"  v-model="form.is_favorite">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <label class="label"> {{ $t('Status') }}</label>
                            </div>
                            <div class="col-8">
                                <div class="form-check form-switch ">
                                    <input class="form-check-input me-2" type="checkbox" role="switch" id="status" :checked="form.status" v-model="form.status">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row py-3" v-if="form.server_messages.messages != ''">
                        <ServerMessage  :server_messages="form.server_messages"  />
                    </div>
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
                            {{ $t('Save') }} </span> 

                    </button>
                </div>
            </Form>
        </div>
    
    </div>

    <ProductDetailFormSkeleton v-else />

</template>

<script setup >
    import { reactive, computed } from 'vue'
    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    import { Form,Field,ErrorMessage,useForm } from 'vee-validate'
    import { useAuthStore } from '@/stores/auth';
    import { useI18n } from 'vue-i18n'
    const language = localStorage.getItem('language');
    const { setTouched,values } = useForm();

    const { t } = useI18n();
    const props = defineProps({
        product : {
            type: Object
        },
        all_branches : {
            type: [Object,Array]
        }
    });
    
    const product = toRef(props,'product');
    const all_branches = toRef(props,'all_branches');
    const all_branch_inventory = product.value.all_branch_inventory;
    const selected_branch = ref('');

        
    const auth = useAuthStore();
    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })

    const labels = ref({
        units: t('Units'),
        per_unit: t('Per Unit'),
    });
    
    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
        is_submitting: false,

        all_branch_inventory_data: [],

        branch_slack : auth.user.login_branch.slack,
        branch_name : auth.user.login_branch.name,
        quantity : 0,
        sale_price : 0,
        sku : "",
        alert_quantity : 0,
        show_in :  '',
        status : false,
        is_favorite : false
    };


    const form = reactive({ ...initialState });
    
    let schema = yup.object().shape({

        //all_branch_inventory_data: yup.array().of(yup.object().shape({
        sale_price: yup.number().typeError(t('must be a number',{ name: t('Sale Price') })).required(t('name is required', { name: t('Sale Price') })),
        quantity:yup.number().typeError(t('must be a number',{ name: t('Quantity') }))
        .when({
            is: () => product.value.is_stockable,
            then: (schema) => schema.required(t('name is required', { name: t('Quantity') })),
            otherwise:(schema) => schema.nullable()
        })
//})),
    });

    const show_in_options = ref([
        {
            name: t('Everywhere'),
            value: '',
        },
        {
            name: 'POS', 
            value: 'POS', 
        },{
            name: 'INVOICE', 
            value: 'INVOICE', 
        }
    ]);
    const emits = defineEmits(['saveProductBranch']);
    const branches = ref([]);

    onMounted(() => {
        refreshData();        
    });

  
    watchEffect(() => {
        if(!_.isEmpty(product.value)){
            refreshData();     
        }
    })
    
    // const branches = computed(() => {
    //     return all_branches.value.filter(function(branch) {
    //         if(!_.isUndefined(product.value.all_branch_inventory)){
    //         form.all_branch_inventory_data = [];
    //         var all_branch_inventory = product.value.all_branch_inventory;
    //         return !all_branch_inventory.find(function(all_branch_inventory) {
    //             return branch.slack === all_branch_inventory.branch.slack
    //         })
    //         }
    //     })
    //});
    function refreshData(){
    
        if(product.value.this_branch_inventory){
            let inventory = product.value.this_branch_inventory; 
            form.branch_slack = inventory.branch.slack;
            form.branch_name = inventory.branch.name;
            form.quantity = inventory.quantity;
            form.sale_price = inventory.sale_price;
            form.sku = inventory.sku;
            form.alert_quantity = inventory.alert_quantity;
            form.show_in = (inventory.show_in != null && inventory.show_in!='') ? inventory.show_in : '';
            form.status = (inventory.status == '1') ? true : false;
            form.is_favorite = (inventory.is_favorite == '1') ? true : false;
        }
    
    }

    function addItem(){

        if(selected_branch.value != ''){
            
            let all_branch_inventory_template = reactive({
                branch_slack : selected_branch.value.slack,
                branch_name : selected_branch.value.name,
                quantity : product.value.quantity,
                sale_price : product.value.sale_price,
                sku : '',
                alert_quantity : product.value.alert_quantity,
                show_in : '',
                status : true   ,
                is_favorite : ''
            });
    
            form.all_branch_inventory_data.push(all_branch_inventory_template);
            branches.value.splice(branches.value.indexOf(selected_branch.value), 1);
            selected_branch.value = '';
            
        }
    }
    
    function removeItem(key_index,inventory){
        form.all_branch_inventory_data.splice(key_index, 1);
        //form.all_branch_inventory_data = [];
        let branch =  _.find(all_branches.value, (value) => {
            return value.slack == inventory.branch_slack
        });
        branches.value.push(branch);
        
        branches.value = _.sortBy(branches.value, (value) => { return value.name; });

    }


    async function update(){

        form.is_submitting = true;

        let all_branch_inventory_template = {
            branch_slack : form.branch_slack,
            branch_name : form.branch_name,
            quantity : form.quantity,
            sale_price : form.sale_price,
            sku : form.sku,
            alert_quantity : form.alert_quantity,
            show_in : (form.show_in != null) ? form.show_in : '',
            status : (form.status == '1') ? true : false,
            is_favorite : (form.is_favorite == '1') ? true : false
        };

        form.all_branch_inventory_data.push(all_branch_inventory_template);

        var form_data = new FormData();
        form_data.append('product_slack',product.value.slack);
        form_data.append('inventory',JSON.stringify(form.all_branch_inventory_data));

        await axios.post('/api/product/inventory/update', form_data).then( (response) => {
            
            form.is_submitting = false;
            
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);

                resetData();
                emits('saveProductBranch');

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
        selected_branch.value = '';
    }

</script>