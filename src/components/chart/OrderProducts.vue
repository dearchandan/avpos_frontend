<template>
    <ul class="nav nav-tabs nav-underline ds-nav-tabs px-0" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button :class="show_product_data == 'top_selling'?'nav-link active':'nav-link'" type="button" role="tab" aria-selected="false" tabindex="-1" @click="shiftTo('top_selling')">{{ $t("Top Selling") }}</button>
        </li>
        <li class="nav-item" role="presentation">
            <button :class="show_product_data == 'low_selling'?'nav-link active':'nav-link'" type="button" role="tab" aria-selected="false" tabindex="-1" @click="shiftTo('low_selling')">{{ $t("Low Selling") }}</button>
        </li>
    </ul>
    <div class="tab-content">
        <div class="ds-product-list">
            <div class="items" v-if="show_product_data == 'top_selling'">
                <div class="item" v-if="top_selling_products_data.length > 0" v-for="branch_product in top_selling_products_data">
                    <div class="row flex-nowrap align-items-center gx-3">
                        <div class="col-auto">
                            <img :src="branch_product.product.image_path" alt="" class="listing-p-image">
                        </div>
                        <div class="col">
                            <h3><a :href="'/product/'+branch_product.product?.slack">{{ branch_product.name }}</a></h3>
                            <!-- <h6>Category Name</h6> -->
                        </div>
                        <div class="col-auto">
                            <h5>{{ branch_product.total_quantity??0 }} <small>qty.</small></h5>
                        </div>
                    </div>
                </div>
                <div class="text-center" v-else>
                    <h6>{{ $t("No Data Found") }}</h6>
                </div>
                
                <!-- <div class="viewall-items">
                    <a href="/orders">{{ $t("View All") }}</a>
                </div> -->
            </div>
            <div class="items" v-else>
                <div class="item" v-if="low_selling_products_data.length > 0" v-for="branch_product in low_selling_products_data">
                    <div class="row flex-nowrap align-items-center gx-3">
                        <div class="col-auto">
                            <img :src="branch_product.product.image_path" alt="" class="listing-p-image ">
                        </div>
                        <div class="col">
                            <h3><a :href="'/product/'+branch_product.product?.slack">{{ branch_product.name }}</a></h3>
                            <!-- <h6>Category Name</h6> -->
                        </div>
                        <div class="col-auto">
                            <h5>{{ branch_product.total_quantity??0 }} <small>qty.</small> </h5>
                        </div>
                    </div>
                </div>
                <div class="text-center" v-else>
                    <h6>{{ $t("No Data Found") }}</h6>
                </div>
                <!-- <div class="viewall-items">
                    <a href="/orders">{{ $t("View All") }}</a>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script setup>

    import { useAuthStore } from '@/stores/auth';
    const authStore = useAuthStore();
    
    const currency_symbol = computed(() => {
        return authStore.user.currency.symbol;
    })
    
    const top_selling_products_data = ref([]);
    const low_selling_products_data = ref([]);
    const show_product_data = ref('top_selling');

    const props = defineProps(['top_selling_products','low_selling_products']);  
    top_selling_products_data.value = props.top_selling_products;
    low_selling_products_data.value = props.low_selling_products;
    function shiftTo(type)
    {
        show_product_data.value = type;
    }
    watch(() => 
        props.top_selling_products, (value) => {
            if(value){
               // console.log('aaa')
              top_selling_products_data.value = value;
            }
        },
    );
    watch(() => 
        props.low_selling_products, (value) => {
            if(value){
               // console.log('aaa')
              low_selling_products_data.value = value;
            }
        },
    );
</script>