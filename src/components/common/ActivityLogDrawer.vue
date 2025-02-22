<template>
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="activity_drawer"
    aria-labelledby="offcanvasRightLabel"
    ref="target"
  >
    <div class="offcanvas-header">
      <div class="row align-items-center gx-2">
        <div class="col-auto">
          <h5 class="offcanvas-title" id="offcanvasRightLabel">{{  t('Activity Logs') }}</h5>
        </div>
      </div>
        
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        @click="close()"
      ></button>
    </div>

    <div class="offcanvas-body">
      <div class="activitlist" v-if="!is_loaded">
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
        <div class="item">
          <div class="icon">
            <div class="skl-w" style="height: 28px;min-width: 28px;border-radius: 50%;"></div>
          </div>
          <div class="text">
            <div class="skl-w" style="height: 15px;margin-bottom: 8px;"></div>
            <div class="skl-w" style="height: 6px;width:100px;"></div>
          </div>
        </div>
      </div>


      <div class="activitlist" v-if="is_loaded">
        <div class="item" v-for="log in logs">
          <div class="icon" v-if="log.user"><img :src="log.user.profile_pic" alt=""></div>
          <div class="text">
            <h3>{{  log.description  }}</h3>
            <span>{{ log.time_ago  }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="offcanvas-footer p-4">
      <router-link to="/activity_logs" class="btn btn-primary w-100">View All Logs</router-link>
    </div>
    
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";
  import ClipLoader from "vue-spinner/src/ClipLoader.vue";
  import { onClickOutside } from '@vueuse/core'

  const { t } = useI18n();

  defineExpose({
      getActivityLogs,
  });

  const is_loaded = ref(false);
  const logs = ref([]);
  async function getActivityLogs(){
    await axios
      .get("/api/v2/activity_logs")
      .then((response) => {
        if (response.data.status_code == 200) {
          logs.value = response.data.data.data;
          is_loaded.value = true;
        }
    })
    .catch((error) => {
      console.log(error);
    });
    document.querySelector('#activity_drawer').classList.add('show');
  }

  function close(){
    document.querySelector('#activity_drawer').classList.remove('show');
  }
  
  const target = ref(null);
  onClickOutside(target, event => close());

</script>