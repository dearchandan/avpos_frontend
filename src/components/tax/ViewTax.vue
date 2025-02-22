<template>
  <!--View Tax Modal -->
  <div class="modal hide modal-lg" id="viewTaxModal"  tabindex="-1" aria-labelledby="View Tax" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered" v-if="tax != null">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ tax.name }} </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="data-view-box mb-4">
                <h5 class="pb-3">{{ $t('Tax Components') }}</h5>
                <div v-for="(component,index) in tax.tax_components" class="item">
                  <b>{{ component.name }}</b>
                  <span>{{ component.percentage }}%</span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="data-view-box mb-4">
                <div class="item">
                  <b>{{ $t('Status') }}</b>
                  <span class="badge badge-success" v-if="tax.status == 1">{{ $t('Active') }}</span>
                  <span class="badge badge-danger" v-else>{{ $t('Inactive') }}</span>
                </div>
                <div class="item" v-if="tax.created_by != null">
                  <b>Created By</b>
                  {{ tax.created_by.name }}
                </div>
                <div class="item" v-if="tax.updated_by != null">
                  <b>{{ $t('Updated By') }}</b>
                  {{ tax.updated_by.name }}
                </div>
                <div class="item">
                  <b>{{ $t('Created On') }}</b>
                  {{ tax.created_at_label }}
                </div>
                <div class="item">
                  <b>{{ $t('Updated On') }}</b>
                  {{ tax.updated_at_label }}
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

import {ref} from 'vue';

const is_loading = ref(false);

const emit = defineEmits(['closeViewTaxModal'])

const props = defineProps(['show_view_tax_modal','tax']);

function closeModal(){
  emit('closeViewTaxModal');
}

</script>