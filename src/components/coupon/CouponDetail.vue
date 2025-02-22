<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">

                <div v-if="coupon == ''">
                    <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                </div>
                <div v-else>
                    <div class="row">
                        
                        <div class="col-12 pb-3">
                            <span class="badge badge-success" v-if="coupon.status == 1">{{ $t('Active') }}</span>
                            <span class="badge badge-danger" v-else>{{ $t('Inactive') }}</span>
                            <span class="badge badge-success mx-2" v-if="coupon.is_taxable == 1">{{ $t('Taxable') }}</span>
                            <span class="badge badge-danger mx-2" v-if="coupon.is_taxable == 0">{{ $t('Non Taxable') }}</span>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Coupon') }}:</span>
                                    <strong>{{ coupon.name }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Amount/Percentage') }}</span>
                                    <strong>{{ coupon.value }} {{ coupon.type_text  }} </strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Applicable Branches') }}</span>
                                    <strong>
                                        <span v-if="coupon.applies_to_all_branch == 1">{{ $t('All Branches') }}</span>
                                        <span v-else>{{ $t('Specific Branches') }}</span>
                                    </strong> 
                                </div>
                               
                            </div>
                        </div>
                        <div class="col-md-4" v-if="coupon.available_coupon_quantity != null">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Total Quantity') }}</span>
                                    <strong>{{  coupon.available_coupon_quantity  }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Remaining Quantity') }}</span>
                                    <strong>{{  coupon.remaining_coupon_quantity  }}</strong> 
                                </div>
                            </div>
                        </div>
                    
                        
                        <div class="col-md-4" v-if="coupon.start_datetime_label != null">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Starts At') }}</span>
                                    <strong>{{ coupon.start_datetime_label }} </strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Ends At') }}</span>
                                    <strong>{{ coupon.end_datetime_label }} </strong> 
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4" v-if="coupon.minimum_order_amount != null || coupon.maximum_coupon_amount != null">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Min. Order Amount') }}</span>
                                    <strong>{{ coupon.minimum_order_amount }} </strong>
                                </div>
                                <div class="item">
                                    <span>{{ $t('Max Discount Amount') }}</span>
                                    <strong>{{ coupon.maximum_discount_amount }}</strong> 
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Created At') }}</span>
                                    <strong>{{ coupon.created_at_label }} </strong>
                                </div>
                                <div class="item">
                                    <span>{{ $t('Updated At') }}</span>
                                    <strong>{{ coupon.updated_at_label }}</strong> 
                                </div>
                            </div>
                        </div>
                    
                    
                    
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Created By') }}</span>
                                    <strong>{{ coupon.created_by.name }} </strong>
                                </div>
                                <div class="item">
                                    <span>{{ $t('Updated By') }}</span>
                                    <strong>{{ coupon.updated_by.name }}</strong> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="row">

                    <h5 class="text-muted pb-2">{{ $t('Applicable Customers') }}</h5>
                    
                    <div class="col-4">
                        <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Customer Type') }}:</span>
                                    <strong>{{ coupon.customer_type_text }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Usage Limit Per Customer') }}:</span>
                                    <strong>
                                        <span v-if="coupon.usage_limit_per_customer != ''">{{ coupon.usage_limit_per_customer }}</span>
                                        <span v-else>{{ $t('Unlimited') }}</span>
                                    </strong> 
                                </div>
                            </div>
                    </div>
                    <div class="col-8" v-if="coupon.customer_type == 3 && coupon.customers != ''">
                        <div class="data-view-box mb-3">
                            <div class="row">
                                <div class="col-auto" v-for="(customer,index) in coupon.customers" :key="index">
                                    <div class="badge badge-secondary me-2">
                                        <div class="">{{  customer.customer.name }}</div> 
                                        <div v-if="customer.customer.email != null" class="p-1" >{{  customer.customer.email }}</div>
                                        <div v-if="customer.customer.phone != null" class="p-1" >{{  customer.customer.phone }}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

    const props = defineProps({
        coupon : {
            type: Object
        }
    });

    const coupon = toRef(props,'coupon');

</script>