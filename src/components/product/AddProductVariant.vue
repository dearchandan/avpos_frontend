<template>

    <div v-if="product != ''">
       
        <div class=" my-2">
            <div class="tab-content-head">
                <div class="row justify-content-between">
                    <div class="col-auto">
                        <h3>{{ $t('Variants') }}</h3>
                    </div>
                    <div class="col-auto">
                        <div class="mb-2">
                        <select class="form-control form-control-solid form-control-sm w-100" v-model="selected_variant" @change="selectVariant">
                            <option value="" :selected="selected_variant == ''">-- {{ $t('Select Variant') }} --</option>
                            <option v-for="(variant,index) in all_variants" :value="variant"> {{  variant.name  }} </option>
                        </select>
                        </div>
                        <AsyncProductSearch
                            @select-product="saveProductVariant"
                            :placeholder="labels.search_placeholder"
                            :button_placeholder="labels.search_product"
                            :selected_products="selected_products"
                            :product_type="'1'"
                            :show_variants="false"
                        />
                        <!-- <div class="form-field mb-0">
                            <select class="form-control form-control-solid form-control-sm w-100" v-model="selected_modifier" @change="saveProductModifier">
                                <option value="">-- {{ $t('Select modifier') }} --</option>
                                <option v-for="(modifier,index) in all_modifiers" :value="modifier"> {{  modifier.name  }} </option>
                            </select>
                        </div>-->
                    </div> 
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                      <thead class="bg-light">
                            <tr>
                                <th>{{ $t('Variant Name') }}</th>
                                <th>{{ $t('Linked Product') }}</th>
                                <th>{{ $t('Sale Price') }}</th>
                                <th>{{ $t('Remove') }}</th>
                            </tr>
                      </thead>
                      <tbody>
                        <tr  v-for="item in product_variants">
                            <td>{{  item.variant.name  }}</td>  
                            <td class="text-bold fw-bold">
                                <a class="col-auto" target="_BLANK" :href="'/product/'+item.variant_product.slack">
                                    <img :src="item.product.image_path" class="img img-thumbnail" style="width: 50px;" alt=""> 
                                    <span class="ms-2 fw-bold">{{  item.variant_product.name  }}</span>
                                    <span v-if="item.variant_product.name_ar != null"> ({{ item.variant_product.name_ar  }}) </span>
                                </a>
                            </td>   
                            <td><div class="form-field mb-0">
                                {{ item.variant_product_inventory?.sale_price  }} {{  currency_symbol  }}
                                </div> 
                            </td> 
                            <td class="text-end">
                                <button class="btn-close-icon"  @click="deleteVariant(item.slack)">✖</button>
                            </td>
                        </tr>
                      </tbody>
                </table>
            </div>
        </div>
             
    </div>

    

</template> 

<script setup>

    import { useAuthStore } from '@/stores/auth';   
    import { useI18n } from 'vue-i18n'

     const { t } = useI18n();
     const labels = ref({
        search_placeholder: t("Search and Add Product"),
        search_product: t("Search Product"),
     });
    const AsyncProductSearch = defineAsyncComponent(() => import('@/components/common/ProductSearch.vue'));

    const auth = useAuthStore();
    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })

    const props = defineProps({
        product : {
            type: Object
        }
    });
    const product = toRef(props,'product');
    const product_slack = product.value.slack;

    const product_variants = ref([]);
    const all_variants = ref([]);
    const selected_variant = ref('');

    const selected_products = ref([]);

    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
        is_submitting: false,
    };

    const form = reactive({ ...initialState });

    onMounted(() => {
        refreshData();   
    });

    function refreshData(){
        selected_products.value = [];
        selected_products.value.push(product.value.slack);
        getProductVariants();
    }
    
    
    function selectVariant(){
        if(product_variants.value && product_variants.value.length){
            _.forEach(product_variants.value, (item) => {
                if(item.variant_id === selected_variant.value.id){
                    selected_products.value.push(item.variant_product.slack);
                }
            });
        }
    }

    async function getProductVariants(){
        
        await axios.get('/api/product/variants', { params : {
                slack : product_slack,
            } }).then( (response) => {
                
            all_variants.value = response.data.data.all_variants;
            product_variants.value = response.data.data.product_variants;

        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            console.log(error);
        });
    }

    
    async function deleteVariant(slack){

        var is_confirmed = false;

        await Swal.fire({
            title: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d33',
        }).then( (result) => {
            if(result.isConfirmed){
                is_confirmed = true;        
            }
        });

        if(is_confirmed){

            await axios.post('/api/product/variant/delete',{
                slack : slack,
            }).then( (response) => {
                
            if(response.data.status_code == 200) {
                
                toast.success(response.data.msg);
                refreshData();

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

    async function saveProductVariant(variant_product){

        let form_data = new FormData();
        form_data.append('product_slack',product.value.slack);
        form_data.append('variant_slack',selected_variant.value.slack);
        form_data.append('variant_product_slack',variant_product.slack);

        await axios.post('/api/product/variant/save',form_data).then( (response) => {
        
        if(response.data.status_code == 200) {
            
            toast.success(response.data.msg);
            refreshData();

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

    function resetData(){
        selected_variant.value = '';
        selected_product.value = '';
    }


</script>

<style scoped>

    .no-border{
        border:0px !important;
    }
    .variant-item{
        height: 0px;
        padding:0px 0px 3px 0px;
    }

</style>