<template>

    <div v-if="product != ''">
        <div class="" >
            <div class="tab-content-head">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <h3>{{ $t('Add Supplier') }}</h3>
                    </div>
                    <div class="col-auto">
                        <div class="form-field mb-0 d-flex flex-column align-items-end">
                            <a href="javascript:;" data-bs-toggle="modal" :data-bs-target="'#addSupplierModal'" class="label_add_btn"> + Add</a>
                            <!-- <select class="form-control form-control-solid form-control-sm w-100" v-model="selected_supplier" @change="addItem()">
                                <option value="" :selected="selected_supplier == ''">-- {{ $t('Select Supplier') }} --</option>
                                <option v-for="(supplier,index) in select_suppliers" :value="supplier"> {{  supplier.name  }} </option>
                            </select> -->

                            <AsyncSupplierSearch
                                @select-supplier="addItem"
                                :selected_suppliers="selected_supplier_slack"
                             />

                            <!-- <VMultiSelect
                                name="select_suppliers"
                                :placeholder="'Select Supplier'"
                                :text="'name'"
                                :value="'slack'"
                                :options="select_suppliers"
                                v-model="selected_supplier"
                                mode="single"
                                required
                                :addModalShow="true"
                                :addModalId="'#addSupplierModal'"
                                :change="addItem()"
                            /> -->
                        </div>
                    </div>
                </div>
            </div>
      
            <Form
                @submit="update"
            >
                <div class="col-12 py-3">
                    <div class="table-responsive" v-if="is_suppliers_listed">
                        <table class="table table-condensed" >
                            <thead>
                                <tr>
                                    <th width="15%">{{ $t('Supplier') }} <em class="text-danger">*</em> </th>
                                    <th v-if="product.is_stockable" width="15%">{{ $t('Default Purchase Qty') }} </th>
                                    <th width="20%">{{ $t('Default Purchase Price') }}</th>
                                    <th width="5%">{{ $t('Default Measurement') }}</th>
                                    <th width="5%" class="text-end">{{ $t('Remove') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                            
                                    <tr v-if="supplier_list != ''" v-for="(supplier,index) in supplier_list" :key="index">
                                        <td> <strong>{{  supplier.supplier_name }}</strong> </td>
                                        <td v-if="product.is_stockable">
                                                <input
                                                    type="number" 
                                                    name="quantity"
                                                    v-model="supplier.default_purchase_quantity"
                                                    class="form-control form-control-sm form-control-solid"
                                                    @keydown="$event.key === '-' ? $event.preventDefault() : null"
                                                />
                                                <!-- :input_group_text="product.stock_measurement_unit_id ? product.stock_measurement_unit.abbreviation : 'Per Unit'" -->
                                        </td>
                                        <td>
                                            <div class="form-field mb-0 field-end-label">
                                                <input
                                                    type="number" 
                                                    name="sale_price"
                                                    class="form-control form-control-sm form-control-solid"
                                                    v-model="supplier.default_purchase_price"
                                                    :input_group_text="currency_symbol"
                                                    @keydown="$event.key === '-' ? $event.preventDefault() : null"
                                                />
                                                <small >{{ currency_symbol }}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <select name="stock_measurement_unit_id" v-model="supplier.default_measurement_unit_id" class="form-control form-control-sm form-control-solid">
                                                <option v-if="supplier.stock_measurement_unit_id == '' || product.stock_measurement_unit_id == null " value="">{{ $t('Per Unit') }}</option>
                                                <option v-else v-for="(unit,unit_index) in measurement_units" :key="unit_index" :value="unit.id" >{{ unit.unit_name }}</option>
                                            </select>
                                        </td>
                                        <td class="text-end">
                                            <a role="button" class="btn btn-icon btn-xs btn-light-danger" @click="removeItem(supplier)">
                                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg>
                                            </a>
                                        </td> 
                                    </tr>
                                    <tr v-else>
                                        <td colspan="9" class="text-center">{{ $t('No Suppliers Linked') }}</td>
                                    </tr>
                                
                            </tbody>
                            
                        </table>
                    </div>
                    <ListingSkeleton v-else />
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


  <div class="modal hide" id="addSupplierModal" tabindex="-1" aria-labelledby="Add Customer" aria-modal="true"
       role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fs-5">{{ $t('Add Supplier') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
        </div>
        <div class="modal-body">
          <AddSupplier  @closeAddSupplierModal="closeAddSupplierModal" :popupWindow="true"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { Form } from 'vee-validate'
    import { useAuthStore } from '@/stores/auth';

    const AsyncSupplierSearch = defineAsyncComponent(() => import('@/components/common/SupplierSearch.vue'));

    const props = defineProps({
        product : {
            type: Object
        },
    });

    const selected_supplier_slack = ref([]);
    const product = props.product;
    const all_suppliers = ref('');
    const product_suppliers = props.product.product_suppliers;
    const selected_supplier = ref('');
        
    const auth = useAuthStore();
    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })

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

        getProductMeasurementUnits();

        getAllSuppliers();
        
        listExistingSuppliers();
        
    }

    const measurement_units = ref([]);
    async function getProductMeasurementUnits(){
        let form_data = new FormData();
        form_data.append('product_slack',product.slack);
        await axios.post('/api/v2/product/measurements',form_data).then( (response) => {
            measurement_units.value = response.data.data;
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
        });
    }

    async function getAllSuppliers(){
      await axios.get('/api/v2/suppliers/all').then( (response) => {
        all_suppliers.value = response.data.data;
        populateSelectSupplierDropdown();

      }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
      });
    }

    const select_suppliers = ref([]);
    function populateSelectSupplierDropdown(){
        select_suppliers.value = all_suppliers.filter(function(all_supplier_item) {
            return !product_suppliers.find(function(product_supplier) {
                return all_supplier_item.slack == product_supplier.supplier.slack
            })
        });
    }
    
    const supplier_list = ref([]);
    const is_suppliers_listed = ref(false);
    function listExistingSuppliers(){
        _.forEach(product_suppliers, (value) => {
           let product_supplier_template = {
                product_supplier_slack : value.slack,
                supplier_id : value.supplier.id,
                supplier_name : value.supplier.name,
                default_purchase_quantity : value.default_purchase_quantity,
                default_purchase_price : value.default_purchase_price,
                default_measurement_unit_id : value.default_measurement_unit_id,
            };
            supplier_list.value.push(product_supplier_template);
            selected_supplier_slack.value.push(value.supplier.id);
        })
        is_suppliers_listed.value = true;
    }
    
    function addItem(clicked_supplier){
        selected_supplier.value = clicked_supplier;
        if(selected_supplier.value != ''){
            
            let product_supplier_template = reactive({
                product_supplier_slack : '',
                supplier_id : selected_supplier.value.id,
                supplier_name : selected_supplier.value.name,
                default_purchase_quantity : '',
                default_purchase_price : product.sale_price,
                default_measurement_unit_id : product.stock_measurement_unit_id,
            });
            selected_supplier_slack.value.push(selected_supplier.value.id);
            supplier_list.value.push(product_supplier_template);
            select_suppliers.value.splice(select_suppliers.value.indexOf(selected_supplier.value), 1);
            selected_supplier.value = '';
            
        }
    }
    
    function removeItem(item){
        
        supplier_list.value.splice(supplier_list.value.indexOf(item), 1);
        let supplier =  _.find(all_suppliers, (value) => {
            return value.id == item.supplier_id
        });
        selected_supplier_slack.value.splice(selected_supplier_slack.value.indexOf(supplier.id), 1);
        select_suppliers.value.push(supplier);
        select_suppliers.value = _.sortBy(select_suppliers.value, (value) => { return value.name; });

    }

    async function update(){

        form.is_submitting = true;

        var form_data = new FormData();
        form_data.append('product_slack',product.slack);
        form_data.append('suppliers',JSON.stringify(supplier_list.value));

        await axios.post('/api/product/supplier/update', form_data).then( (response) => {
            
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
        selected_supplier.value = '';
    }

    async  function closeAddSupplierModal() {
        document.getElementById('close_btn').click();
        refreshSuppliers();
    }

    async function refreshSuppliers(){
        await axios.get('/api/v2/suppliers/all').then( (response) => {
            select_suppliers.value = response.data.data;
            select_suppliers.value = select_suppliers.value.filter(function(all_supplier_item) {
                return !product_suppliers.find(function(product_supplier) {
                    return all_supplier_item.slack == product_supplier.supplier.slack
                })
            });
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
        });
    }

</script>