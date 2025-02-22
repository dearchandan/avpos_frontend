<template>
    <!--View Category Modal -->
    <div  class="modal hide modal-lg" id="viewCategoryModal"  tabindex="-1" aria-labelledby="View Category" aria-modal="true" role="dialog"  >
            <div  class="modal-dialog modal-dialog-centered">
                <div class="modal-content" v-if="category != ''">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ category.name }} <br> <span class="text-muted" v-if="category.name_ar != null">{{ category.name_ar }}</span> </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                    </div>
                    <div  class="modal-body">
                        <div class="row">
                            <div class="col-md-4 text-center pt-5">
                                <img v-lazy="category.image" alt="">
                            </div>
                            <div class="col-md-8">
                                <div class="col-12 pb-3 text-end">
                                    
                                    <span class="badge badge-success" v-if="category.status == 1">{{ $t('Active') }}</span>
                                    <span class="badge badge-danger" v-else>{{ $t('Inactive') }}</span>

                                    <span class="badge badge-success mx-2" v-if="category.is_favorite == 1">{{ $t('Favorite') }}</span>

                                </div>

                                <div class="data-view-box mb-4">
                                    <div class="item" v-if="category.parent != null">
                                        <b>{{ $t('Parent Category') }}</b>
                                        {{ category.parent?.name }}
                                    </div>
                                    <div class="item">
                                        <b>{{ $t('Created By') }}</b>
                                        {{ category.created_by?.name }}
                                    </div>
                                    <div class="item">
                                        <b>{{ $t('Updated By') }}</b>
                                        {{ category.updated_by?.name }}
                                    </div>
                                    <div class="item">
                                        <b>{{ $t('Created On') }}</b>
                                        {{ category.created_at_label }}
                                    </div>
                                    <div class="item">
                                        <b>{{ $t('Updated On') }}</b>
                                        {{ category.updated_at_label }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>            
        <!-- end modal -->
</template>

<script setup>

 const props = defineProps(['show_view_category_modal','category']);
 
 const emit = defineEmits(['closeViewCategoryModal'])
 function closeModal(){
    emit('closeViewCategoryModal');
 }
    
</script>