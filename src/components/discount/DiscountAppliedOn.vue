<template>
    
    <div class="row" v-if="form.discount.slack!=''">

        <div class="col-md-4" v-if="form.discount.applies_to == 2" ></div>

        <div class="col-md-4">
            <div class="card">
                <div class="row">
                    <div class="col-12">
                        <h5>{{ $t('Applicable Branches') }}</h5>
                    </div>
                </div>
                <div class="row">

                    <div class="col-12 pt-3">

                        <div class="form-field me-3">
                            <label v-for="(option,index) in apply_on_options" class="label me-3 mb-2">
                                <Field class="form-check-input me-1" name="applies_to_all_branch" type="radio" :id="index" :value="option.value" v-model="form.discount.applies_to_all_branch" @change="selectBranch" /> 
                                {{ option.name }}
                            </label>
                            <ErrorMessage name="applies_to_all_branch" as="div" class="error"></ErrorMessage>
                        </div>

                    </div>

                </div>

                <div class="row" v-if="form.discount.applies_to_all_branch == 0">
                    <div class="col-12">
                        <select class="form-control form-control-solid form-control-sm w-100" v-model="selected_branch" @change="addBranch" >
                            <option value="">--{{ $t('Select Branch') }}--</option>
                            <option v-for="(branch,index) in form.branches" :value="branch.slack"> {{  branch.name  }} </option>
                        </select>
                    </div>
                    <div class="col-12 py-3">
                        <table class="table table-condensed">
                            <tbody>
                                <tr v-if="form.discount != '' && form.discount.branches != ''" v-for="(discount_branch,index) in form.discount.branches" :key="index">
                                    <td>{{  discount_branch.branch.name }}</td>
                                    <td class="text-end">
                                        <a class="btn btn-icon btn-xs btn-light-danger" href="#" @click="removeBranch(discount_branch.slack)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg></a>
                                        <!--<a class="dropdown-item text-danger" href="#" @click="removeBranch(discount_branch.slack)">{{ $t('Remove') }}</a>-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-8" v-if="form.discount.applies_to == 1">
            <div class="card">
                <div class="row">
                    <div class="col-12">
                        <h5>{{ $t('Applicable Inventory') }}</h5>
                    </div>
                </div>
                <div class="row">

                    <div class="col-12 pt-3">
                     
                        <div class="form-field me-3">
                            <label v-for="(option,index) in applies_to_inventory_options" class="label me-3 mb-2">
                                <Field class="form-check-input me-1" name="applies_to_all_products" type="radio" :id="index" :value="option.value" v-model="form.discount.inventory_type" @change="changeInventoryType" /> 
                                {{ option.name }}
                            </label>
                            <ErrorMessage name="applies_to_all_products" as="div" class="error"></ErrorMessage>
                        </div>

                    </div>

                </div>

                <div class="row" v-if="form.discount.inventory_type == 2">
                    <div class="col-md-5">
                        
                        <!-- <label for="">Search By Category</label> -->
                        <multiselect 
                            v-model="selected_category"
                            name="category"
                            :options="form.categories" 
                            label="name" 
                            valueProp="slack" 
                            mode="single"
                            :searchable="true" 
                            class="form-control form-control-sm form-control-solid"
                            :placeholder="search_by_category_placeholder"
                            @select="fetchProducts(selected_category)"
                        />

                    </div>

                    <div class="col-md-7">

                        <beat-loader v-if="is_product_listing" :color="'black'" :size="'10px'" class="pt-4 mt-2 text-start">  </beat-loader>
                        
                        <div v-else>
                            <div v-if="all_products != ''"> 
                                <!-- <label for="">Select Product</label> -->
                                <multiselect 
                                    v-model="selected_product"
                                    name="product"
                                    :options="all_products" 
                                    label="name" 
                                    valueProp="slack" 
                                    mode="single"
                                    :searchable="true" 
                                    :placeholder="select_product_placeholder"
                                    @select="addInventory"
                                    class="form-control form-control-sm form-control-solid"
                                />
                            </div>
                            <div v-else class="pt-2 text-danger">{{ $t('No Products Found!') }}</div>
                        </div>

                    </div>
       
                    <div class="col-12 py-3">
                        <table class="table table-condensed table-bordered">
                            <thead >
                                <tr>
                                    <th class="text-muted">{{ $t('Applicable Items') }}</th>
                                    <th class="text-end" v-if="form.discount.inventory != ''">
                                        <a class="dropdown-item text-danger fw-bold" href="#" @click="removeInventory()">{{ $t('Remove All') }}</a>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="form.discount.inventory != ''" v-for="(inventory,index) in form.discount.inventory" :key="index">
                                    <td width="80%">{{  inventory.product.name }}</td>
                                    <td class="text-end">
                                        <a class="btn btn-icon btn-xs btn-light-danger" href="#" @click="removeInventory(inventory.product.id)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="0.88em" height="1em" viewBox="0 0 448 512" class="iconify iconify--fa6-regular"><path fill="currentColor" d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16m80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16"></path></svg></a>

                                        <!--<a class="dropdown-item text-warning" href="#" @click="removeInventory(inventory.product.id)">{{ $t('Remove') }}</a>-->
                                    </td>
                                </tr>
                            </tbody>
                            
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

    import { Form, Field, ErrorMessage } from 'vee-validate';
    import { useI18n } from 'vue-i18n'
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    import { useAuthStore } from '@/stores/auth';

    const { t } = useI18n();

    const authStore = useAuthStore();
    const multiselect = defineComponent(
        Multiselect
    )

    const apply_on_options = [
        {
            name : t("All Branches"),
            value: 1
        },
        {
            name :  t("Specific Branches"),
            value: 0
        }
    ];

    const props = defineProps(['form']);
    
    const data = toRef(props, 'form'); 
    const form = reactive(data.value);
    
    const emit = defineEmits(['refreshDiscount']);

    const search_by_category_placeholder = t('Search By Category');
    const select_product_placeholder = t('Select Product');

    function refreshDiscount(){
        emit('refreshDiscount');
    }

    const selected_branch = ref('');

    async function addBranch(){

        if(selected_branch.value != ''){
            
            var form_data = new FormData();
            form_data.append('discount_slack',form.discount.slack);
            form_data.append('branch_slack',selected_branch.value);

            await axios.post('/api/discount/branch/add',form_data).then( (response) => {

                toast.success(response.data.msg);
                refreshDiscount();
                
            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                console.log(error);
            });

        }

    }
    

    async function removeBranch(slack){

        var is_confirmed = false;

        await Swal.fire({
            title: t('Do you want to remove discount from this branch?'),
            showCancelButton: true,
            confirmButtonText: t('Yes, Delete'),
            confirmButtonColor: '#d33',
            }).then( (result) => {
            if(result.isConfirmed){
                is_confirmed = true;        
            }
        });

        if(is_confirmed){

        await axios.post('/api/discount/branch/remove',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            refreshDiscount();

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
                console.log(error);
            });
        }

    }

    async function selectBranch(){
    
            var form_data = new FormData();
            form_data.append('discount_slack',form.discount.slack);
            form_data.append('applies_to_all_branch',form.discount.applies_to_all_branch);
    
            await axios.post('/api/discount/branch/apply_to_all_branch',form_data).then( (response) => {
                
            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                console.log(error);
            });

    }

    /* 
    --------------------------------
    Applicable Inventory Section 
    --------------------------------
    */

    const applies_to_inventory_options = [
        {
            name : "All Products",
            value: 1
        },
        {
            name :  "Specific Product",
            value: 2
        }
    ];
    
    
    const selected_category = ref('');
    const all_products = ref([]);
    const selected_product = ref('');
    const is_product_listing = ref(false);

    async function changeInventoryType(){
        
        await updateInventoryType();

        await fetchProducts();

    }

    async function updateInventoryType(){
        
        var form_data = new FormData();
        form_data.append('discount_slack',form.discount.slack);
        form_data.append('inventory_type',form.discount.inventory_type);

        await axios.post('/api/discount/update_inventory_type',form_data).then( (response) => {
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            console.log(error);
        });

    }
    
    watch(selected_category, function(newValue){
        fetchProducts(newValue);
    });

    async function fetchProducts(category_slack = ''){

        // if(form.discount.inventory_type == 2){
            
            is_product_listing.value = true;
    
            await axios.get('/api/discount/inventory',{
                params : {
                    discount_slack : form.discount.slack,
                    category_slack : category_slack
                }
            }).then( (response) => {
                    
                all_products.value = response.data.data.products;
                is_product_listing.value = false;
                refreshDiscount();
                
            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                form.is_product_listing = false;
                console.log(error);
            });

        // }

    }

    async function addInventory(){

        if(selected_product.value != ''){
            
            var form_data = new FormData();
            form_data.append('discount_slack',form.discount.slack);
            form_data.append('product_slack',selected_product.value);

            await axios.post('/api/discount/inventory/add',form_data).then( (response) => {

                toast.success(response.data.msg);
                fetchProducts();
                
            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                console.log(error);
            });

        }

    }
    
    async function removeInventory(model_id = ''){

        var is_confirmed = false;

        await Swal.fire({
            title: (model_id != '') ? 'Remove Item From Discount?' : 'Remove All Items From Discount?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d33',
            }).then( (result) => {
            if(result.isConfirmed){
                is_confirmed = true;        
            }
        });

        if(is_confirmed){
        
            var form_data = new FormData();
            form_data.append('discount_slack',form.discount.slack);
            form_data.append('model_id',model_id);

            await axios.post('/api/discount/inventory/remove',form_data).then( (response) => {

                toast.success(response.data.msg);
                fetchProducts();
                
            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                console.log(error);
            });
       
        }
        

    }

    fetchProducts();

</script>