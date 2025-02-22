<template>
  <!--View Measurement Modal -->
  <div class="modal hide modal-lg" id="viewMeasurementModal"  tabindex="-1" aria-labelledby="View Measurement" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered" v-if="measurement != null">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ measurement.name }} </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="data-view-box mb-4">
                <h5 class="pb-3">{{ $t('Measurement Units') }}</h5>
                <div v-for="(unit,index) in measurement.units" class="item">
                  <b>{{ unit.unit_name }}</b>
                  <span>{{ unit.abbreviation }}</span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="data-view-box mb-4">
                <div class="item">
                  <b>{{ $t('Status') }}</b>
                  <span class="badge badge-success" v-if="measurement.status == 1">{{ $t('Active') }}</span>
                  <span class="badge badge-danger" v-else>{{ $t('Inactive') }}</span>
                </div>
                <div class="item" v-if="measurement.created_by != null">
                  <b>{{ $t('Created By') }}</b>
                  {{ measurement.created_by.name }}
                </div>
                <div class="item" v-if="measurement.updated_by != null">
                  <b>{{ $t('Updated By') }}</b>
                  {{ measurement.updated_by.name }}
                </div>
                <div class="item">
                  <b>{{ $t('Created On') }}</b>
                  {{ measurement.created_at_label }}
                </div>
                <div class="item">
                  <b>{{ $t('Updated On') }}</b>
                  {{ measurement.updated_at_label }}
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

const emit = defineEmits(['closeViewMeasurementModal'])

const props = defineProps(['show_view_measurement_modal','measurement']);

function closeModal(){
  emit('closeViewMeasurementModal');
}

</script>