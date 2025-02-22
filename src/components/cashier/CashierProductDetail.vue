<template>
    <teleport to="body" >
        <div class="modal hide" id="CashierProductDetail"  tabindex="-1" aria-labelledby="Add Category" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-w-470 modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title icon-title">
                            <div class="row gx-2">
                                <div class="col-auto">
                                    <div class="veg-icon" v-if="product.dietary==1">
                                        <img src="/src/assets/images/veg_icon.svg" alt=""/>
                                    </div>
                                    <div class="nonveg-icon " v-if="product.dietary==2">
                                        <img src="/src/assets/images/nonveg_icon.svg" alt=""/>
                                    </div>
                                </div>
                                <div class="col">
                                    <h2>{{  product.name  }}</h2>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <table class="table table-striped table-condensed table-bordered">
                                <tbody>
                                    <tr v-if="product.is_stockable">
                                        <td>{{ $t('Available Quantity') }}</td>
                                        <td class="text-primary">{{  product.this_branch_inventory.quantity }}</td>
                                    </tr>
                                    <tr v-if="product.is_stockable">
                                        <td>{{ $t('Alert Quantity') }}</td>
                                        <td>{{  product.this_branch_inventory.alert_quantity  }}</td>
                                    </tr>
                                    <tr v-if="product.preparation_time != ''">
                                        <td>{{ $t('Preparation Time') }}</td>
                                        <td>{{  product.preparation_time  }}</td>
                                    </tr>
                                    <tr v-if="product.this_branch_inventory.sku != ''">
                                        <td>{{ $t('SKU') }}</td>
                                        <td>{{  product.this_branch_inventory.sku  }}</td>
                                    </tr>
                                    <tr v-if="product.short_description != '' || product.short_description_ar != ''">
                                        <td>{{ $t('Short Description') }}</td>
                                        <td>
                                            {{  product.short_description  }}
                                            <br>
                                            {{  product.short_description_ar  }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>

    const { product } = defineProps(['product']);

</script>