<template>
  <!--View Payment Method Modal -->
  <div class="modal hide modal-lg" id="viewPaymentMethodModal"  tabindex="-1" aria-labelledby="View Payment Method" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered" v-if="payment_method != null">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ payment_method.name }} </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="data-view-box mb-4">
                <h5 class="pb-3">{{ $t('Payment Method') }}</h5>
                <b>{{ payment_method.name }}</b>
              </div>
            </div>
            <div class="col-md-6">
              <div class="data-view-box mb-4">
                <div class="item">
                  <b>{{ $t('Status') }}</b>
                  <span class="badge badge-success" v-if="payment_method.status == 1">{{ $t('Active') }}</span>
                  <span class="badge badge-danger" v-else>{{ $t('Inactive') }}</span>
                </div>
                <div class="item" v-if="payment_method.created_by != null">
                  <b>{{ $t('Created By') }}</b>
                  {{ payment_method.created_by.name }}
                </div>
                <div class="item" v-if="payment_method.updated_by != null">
                  <b>{{ $t('Updated By') }}</b>
                  {{ payment_method.updated_by.name }}
                </div>
                <div class="item">
                  <b>{{ $t('Created On') }}</b>
                  {{ payment_method.created_at_label }}
                </div>
                <div class="item">
                  <b>{{ $t('Updated On') }}</b>
                  {{ payment_method.updated_at_label }}
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

const emit = defineEmits(['closeViewPaymentMethodModal'])

const props = defineProps(['show_view_payment_method_modal','payment_method']);

function closeModal(){
  emit('closeViewPaymentMethodModal');
}

</script>