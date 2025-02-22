<template>
   <div class="row">
        <div class="col-2">
            <div class="card">
                <div v-if="ingredient == ''">
                    <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                </div>
                <div v-else class="text-center">
                    <img :src="ingredient.image">
                </div>
            </div>
        </div>
        <div class="col-md-10">
            <div class="card">
                <div v-if="ingredient == ''">
                    <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                </div>
                <div v-else>
                    <div class="row">

                        <div class="col-12 pb-3">
                            
                            <span class="badge badge-success mx-2" v-if="ingredient.status == 1">{{ $t('Active') }}</span>
                            <span class="badge badge-danger mx-2" v-else>{{ $t('Inactive') }}</span>

                            <span class="badge badge-success mx-2" v-if="ingredient.is_stockable == 1">{{ $t('Stockable') }}</span>
                            <span class="badge badge-danger mx-2" v-if="ingredient.is_stockable == 0">{{ $t('Non Stockable') }}</span>
                        
                            <span class="badge badge-success mx-2" v-if="ingredient.dietary == 1">{{ $t('Veg Dietary') }}</span>
                            <span class="badge badge-danger mx-2" v-if="ingredient.dietary == 2">{{ $t('Non Veg Dietary') }}</span>
                        
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Ingredient') }}:</span>
                                    <strong>{{ ingredient.name }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Ingredient (Arabic)') }}:</span>
                                    <strong>{{ ingredient.name_ar }}</strong> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Short Description') }}:</span>
                                    <strong>{{ ingredient.short_description }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Short Description (Arabic)') }}:</span>
                                    <strong>{{ ingredient.short_description_ar }}</strong> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Description') }}:</span>
                                    <strong>{{ ingredient.description }}</strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Description (Arabic)') }}:</span>
                                    <strong>{{ ingredient.description_ar }}</strong> 
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div class="row">

                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Stock Measurement') }}:</span> 
                                    <span v-if="ingredient.stock_measurement_unit"> {{ ingredient.stock_measurement_unit.unit_name  }}</span> 
                                    <span v-else> {{ $t('Units') }} </span> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Sale Measurement') }}:</span> 
                                    <span v-if="ingredient.sale_measurement_unit"> {{ ingredient.sale_measurement_unit.unit_name  }}</span> 
                                    <span v-else> {{ $t('Units') }} </span> 
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Purchase Price') }}:</span>
                                    <strong v-if="ingredient.purchase_price">{{ ingredient.purchase_price }} <span v-if="ingredient.stock_measurement_unit">Per {{ ingredient.stock_measurement_unit.abbreviation  }}</span> <span v-else>{{ $t('Per Unit') }}</span> </strong> 
                                    <strong v-else>-</strong>
                                </div>
                                <div class="item">
                                    <span>{{ $t('Sale Price') }}:</span>
                                    <strong v-if="ingredient.sale_price">{{ ingredient.sale_price }} <span v-if="ingredient.sale_measurement_unit">Per {{ ingredient.sale_measurement_unit.abbreviation  }}</span> <span v-else>{{ $t('Per Unit') }}</span>   </strong> 
                                    <strong v-else>-</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Alert Quantity') }}:</span>
                                    <strong v-if="ingredient.alert_quantity">{{ ingredient.alert_quantity }} <span v-if="ingredient.stock_measurement_unit"> {{ ingredient.stock_measurement_unit.abbreviation  }}</span> <span v-else> {{ $t('Unit') }}</span> </strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Calories') }}:</span>
                                    <strong>{{ ingredient.calories }} </strong> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Created By') }}:</span>
                                    <strong>{{ ingredient.created_by.name }} </strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Updated By') }}:</span>
                                    <strong v-if="ingredient.updated_by!=null">{{ ingredient.updated_by.name }} </strong>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Created At') }}:</span>
                                    <strong>{{ ingredient.created_at_label }} </strong> 
                                </div>
                                <div class="item">
                                    <span>{{ $t('Updated At') }}:</span>
                                    <strong>{{ ingredient.updated_at_label }} </strong> 
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
        ingredient : {
            type: Object
        }
    });

    const ingredient = toRef(props,'ingredient');

</script>