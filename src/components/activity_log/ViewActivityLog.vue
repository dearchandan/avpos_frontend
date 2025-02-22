<template>
  <teleport to="body">
    <div
      class="modal hide modal-lg"
      id="viewActivityLogModal"
      tabindex="-1"
      aria-labelledby="View ActivityLog"
      aria-modal="true"
      role="dialog"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div
        class="modal-dialog modal-dialog-centered"
        v-if="activity_log != null"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ activity_log.description }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div
                :class="[activity_log.properties.old ? 'col-6' : 'col-12']"
                v-if="
                  activity_log.properties && activity_log.properties.attributes
                "
              >
                <div class="data-view-box mb-4">
                  <h6 class="pb-2 text-muted">{{ $t("New Values") }}</h6>
                  <div class="item">
                    <code class="fs-5">
                      <pre>{{ activity_log.properties.attributes }}</pre>
                    </code>
                  </div>
                </div>
              </div>
              <div
                class="col-md-6"
                v-if="activity_log.properties && activity_log.properties.old"
              >
                <div class="data-view-box mb-4">
                  <h6 class="pb-2 text-muted">{{ $t("Old Values") }}</h6>
                  <div class="item">
                    <code class="fs-5">
                      <pre>{{ activity_log.properties.old }}</pre>
                    </code>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <p>{{ activity_log.time_ago }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from "vue";

const is_loading = ref(false);

const emit = defineEmits(["closeViewActivityLogModal"]);

const props = defineProps(["show_view_activity_log_modal", "activity_log"]);

function closeModal() {
  emit("closeViewActivityLogModal");
}
</script>
