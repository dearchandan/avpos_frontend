<template>
    <div class="row">
        <div class="col-2">
            <div class="card">
                <div v-if="product == ''">
                    <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                </div>
                <div v-else class="text-center">
                    <img :src="product.image">
                </div>
            </div>
        </div>
        <div class="col-md-10">
            <div class="card">
                <div v-if="product == ''">
                    <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                </div>
                <div v-else>
                    <div class="row">
                        <div class="col-12 pb-3" >
                            
                            <span class="badge badge-success mx-2" v-if="product.status == 1">{{ $t('Active') }}</span>
                            <span class="badge badge-danger mx-2" v-else>{{ $t('Inactive') }}</span>

                            <span class="badge badge-success mx-2" v-if="product.is_stockable == 1">{{ $t('Stockable') }}</span>
                            <span class="badge badge-danger mx-2" v-if="product.is_stockable == 0">{{ $t('Non Stockable') }}</span>
                        
                            <span class="badge badge-success mx-2" v-if="product.dietary == 1">{{ $t('Veg Dietary') }}</span>
                            <span class="badge badge-danger mx-2" v-if="product.dietary == 2">{{ $t('Non Veg Dietary') }}</span>
                            
                            <span class="badge badge-success mx-2" v-if="product.is_refundable == 1">{{ $t('Refundable') }}</span>
                            <span class="badge badge-danger mx-2" v-if="product.is_refundable == 0">{{ $t('Non Refundable') }}</span>
                        
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Product') }}:</span>
                                    <strong>{{ product.name }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Product (Arabic)') }}</span>
                                    <strong>{{ product.name_ar }}</strong> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Short Description') }}:</span>
                                    <strong>{{ product.short_description }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Short Description (Arabic)') }}:</span>
                                    <strong>{{ product.short_description_ar }}</strong> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Description') }}:</span>
                                    <strong>{{ product.description }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Description (Arabic)') }}:</span>
                                    <strong>{{ product.description_ar }}</strong> 
                                </div>
                            </div>
                        </div>
                    
                    </div>
                    
                    <div class="row">

                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Stock Measurement') }}:</span> 
                                    <span v-if="product.stock_measurement_unit"> {{ product.stock_measurement_unit.unit_name  }}</span> 
                                    <span v-else> {{ $t('Units') }} </span> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Sale Measurement') }}:</span> 
                                    <span v-if="product.sale_measurement_unit"> {{ product.sale_measurement_unit.unit_name  }}</span> 
                                    <span v-else> {{ $t('Units') }} </span> 
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Price Type') }}:</span>
                                    <strong> {{  product.price_type_text  }} </strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Purchase Price') }}:</span>
                                    <strong v-if="product.purchase_price">{{ product.purchase_price }} <span v-if="product.stock_measurement_unit">{{ $t('Per') }} {{ (language == 'ar' && product.stock_measurement_unit.abbreviation_ar != '' && product.stock_measurement_unit.abbreviation_ar != null)?product.stock_measurement_unit.abbreviation_ar:product.stock_measurement_unit.abbreviation  }}</span> <span v-else>{{ $t('Per Unit') }}</span> </strong> 
                                    <strong v-else>-</strong>
                                </div>
                                <div class="item">
                                    <span>{{ $t('Sale Price') }}:</span>
                                    <strong>{{ product.sale_price }} <span v-if="product.stock_measurement_unit">{{ $t('Per') }} {{ (language == 'ar' && product.stock_measurement_unit.abbreviation_ar != '' && product.stock_measurement_unit.abbreviation_ar != null)?product.stock_measurement_unit.abbreviation_ar:product.stock_measurement_unit.abbreviation  }}</span> <span v-else>{{ $t('Per Unit') }}</span>   </strong> 
                                </div>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Alert Quantity') }}:</span>
                                    <strong v-if="product.alert_quantity">{{ product.alert_quantity }} <span v-if="product.stock_measurement_unit"> {{ (language == 'ar' && product.stock_measurement_unit.abbreviation_ar != '' && product.stock_measurement_unit.abbreviation_ar != null)?product.stock_measurement_unit.abbreviation_ar:product.stock_measurement_unit.abbreviation  }}</span> <span v-else> {{ $t('Unit') }}</span> </strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Calories') }}:</span>
                                    <strong>{{ product.calories }} </strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Preparation Time') }}:</span>
                                    <strong v-if="product.preparation_time != ''"> {{ product.preparation_time  }} {{ $t('Mins') }} </strong> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Created At') }}:</span>
                                    <strong>{{ product.created_at_label }} </strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Updated At') }}:</span>
                                    <strong>{{ product.updated_at_label }} </strong> 
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
        product : {
            type: Object
        }
    });

    const product = toRef(props,'product');
    const language = localStorage.getItem('language');
</script>