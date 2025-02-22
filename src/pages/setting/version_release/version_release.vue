<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/settings"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Settings") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Releases") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <div class="page-heading">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <div class="row align-items-center">
              <div class="col-auto">
                <router-link class="btn btn-sm btn-light-primary" to="/release/add" >+ {{ $t('New Release') }}</router-link>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div class="row align-items-center">
                <div class="col-auto">
                    <div class="form-field page-heading-search-field mb-0">
                        <div class="field-icon">
                        <input type="search" class="form-control form-control-sm form-control-shadow" :placeholder="search_placeholder" v-model="form.search_query">
                        <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
      <ListingSkeleton v-if="form.is_listing" />
        <div v-else class="table-responsive" >
        <table class="table table-list-data table-hover">
          <thead class="bg-light">
          <tr>
            <th scope="col" >{{ $t('Version') }}</th>
            <th scope="col">{{ $t('Highlights') }}</th>
            <th scope="col" width="10%">{{ $t('Released At') }}</th>
            <th scope="col" width="10%" class="text-end">{{ $t('Action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="realeases != ''" v-for="(realease,realease_index) in realeases" :key="realease_index">
            <td>
              <div>
                <span class="fw-bold highlighted-list-item">{{  realease.version  }}</span>
              </div>
            </td>
            <td>{{  realease.highlights  }}</td>
            <td>
              {{  realease.released_at  }}
            </td>
            <td class="text-end">
               <a class="mx-2" href="#" @click="editVersionReleases(realease.id)">
                    <Icon
                    icon="fa6-solid:pen"
                    class="fs-5 text-default"
                    />
                </a>
            </td>
          </tr>
          <tr v-else>
            <td class="text-center py-3" colspan="4">{{ $t('No Data Found') }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="data-footer">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto">
            <PaginateLimit @paginate_limit_update="paginate_limit_update" :pagination="pagination" />
          </div>
          <div class="col-auto">
            <Bootstrap5Pagination :data="pagination" :limit="5"  @pagination-change-page="getVersionReleases" />
          </div>
        </div>
      </div>
    </div>
 </DefaultLayout>
</template>
<script setup>
import { ref , onMounted, reactive, watch, computed, defineAsyncComponent } from 'vue';

import { Bootstrap5Pagination } from 'laravel-vue-pagination'
import { useAuthStore } from '@/stores/auth'
import PaginateLimit from '@/components/common/PaginateLimit.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { useI18n } from "vue-i18n";
import * as yup from "yup";

const { t } = useI18n();
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_listing: false,

  // form data
  search_query : ref("")
};

const search_placeholder = t("Search by version..")
const form = reactive({ ...initialState });

onMounted(() => {
  getVersionReleases()
});

watch(() =>
        form.search_query, _.debounce( () => {
      getVersionReleases();
    },500),
);

const realeases = ref([]);
const pagination = ref([]);

async function getVersionReleases(page = 1){

  form.is_listing = true;

  await axios.get('/api/version_releases', { params : {
      page : page,
      paginate_limit : paginate_limit.value,
      search_query : form.search_query,
    } }).then( (response) => {

    realeases.value = response.data.data;
    pagination.value = response.data.pagination;
    form.is_listing = false;

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    form.is_listing = false;
    console.log(error);
  });

}
const paginate_limit = ref();
async function paginate_limit_update(value){
  paginate_limit.value = value;
  await getVersionReleases();
}
function editVersionReleases(id) {
  router.push("/release/edit/" + id);
}
</script>
