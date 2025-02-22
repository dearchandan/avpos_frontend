<template>
    <DefaultLayout>

      <template v-slot:subheader>
          <div class="header-nav-wrap">
              <div class="row align-items-center">
                  <div class="col-auto">
                      <div class="header-back-link">
                          <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                      </div>
                  </div>
                  <div class="col-auto">
                      <h5 class="fw-bold">{{ $t('CDS Setting') }}</h5>
                  </div>
              </div>
          </div>
      </template>

      <div class="content" v-if="is_loaded">

        <Form :validation-schema="schema" enctype="multipart/form-data" :initial-values="form" @submit="saveCDSSetting">
          <div class="row card-strash">
            <div class="col-md-12 mb-0">
              <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''" :server_messages="form.server_messages"  />

              <div class="row">

                <div class="col-md-3 col-12 mb-4">
                  <div class="card">
                    <div class="row">
                      <div class="col-12 ">
                        <VTextInput
                            type="text"
                            name="title"
                            v-model="form.title"
                            :label="labels.title"
                            :placeholder="labels.enter_title"
                            :required="true"
                        />
                      </div>
                      <div class="col-12 ">
                        <VTextInput
                            type="text"
                            name="description"
                            v-model="form.description"
                            :label="labels.description"
                            :placeholder="labels.enter_description"
                            :required="true"
                        />
                      </div>
                      <div class="col-12">
                        <div class="form-field">
                          <label class="label">{{ $t('Select Title Theme') }}</label>
                          <div class="selecttheme-box">
                            <div class="row">
                              <div class="col-6">
                                <div class="titletheme-toggle">
                                  <label>
                                    <input type="radio" name="theme_mode" :value="'2'" v-model="form.theme_mode" :checked="form.theme_mode==2"/>
                                    <span>
                                      <svg width="81" height="20" viewBox="0 0 81 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect x="15.5" width="50" height="5" rx="2.5" fill="currentColor"/>
                                      <rect x="0.5" y="10" width="80" height="10" rx="3" fill="currentColor"/>
                                      </svg>
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div class="col-6">
                                <div class="titletheme-toggle titletheme-toggle-light">
                                  <label>
                                    <input type="radio" name="theme_mode" :value="'1'" v-model="form.theme_mode" :checked="form.theme_mode==1"/>
                                    <span>
                                      <svg width="81" height="20" viewBox="0 0 81 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect x="15.5" width="50" height="5" rx="2.5" fill="currentColor"/>
                                      <rect x="0.5" y="10" width="80" height="10" rx="3" fill="currentColor"/>
                                      </svg>
                                  </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-9 col-12 mb-4">
                  <div class="card carduploadshow">
                    <div class="row g-0">
                      <div class="col-md-3">
                        <ul class="nav nav-pills" id="pills-tab" role="tablist">
                          <li class="nav-item" role="presentation">
                            <button class="nav-link" :class="[ active_tab.index == 1 || active_tab.index == ''  ? 'active' : '']" @click="setActive('images',1)" data-bs-toggle="pill" data-bs-target="#PhotoSlideshow" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                  <span class="icon">
                                      <svg width="66" height="47" viewBox="0 0 66 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M3.67872 1.17354C2.44695 1.6053 1.46915 2.5196 0.885008 3.75137L0.554842 4.4625L0.516746 23.3074C0.47865 44.2602 0.427855 42.9014 1.32946 44.2348C1.86281 45.0094 2.38345 45.4285 3.38665 45.8983L4.11048 46.2412H33H61.8895L62.6134 45.8983C63.6166 45.4285 64.1372 45.0094 64.6705 44.2348C65.5722 42.9014 65.5214 44.2602 65.4833 23.3074L65.4452 4.4625L65.1023 3.73867C64.6578 2.77357 63.7816 1.85927 62.88 1.40211L62.1435 1.03386L33.1905 1.00846C7.31054 0.983059 4.17397 1.00846 3.67872 1.17354ZM61.9657 3.80217C62.1943 3.95455 62.5245 4.31012 62.6768 4.58949L62.9689 5.09743V23.5359C62.9689 36.2346 62.9308 42.076 62.8292 42.33C62.6388 42.8633 61.9657 43.4983 61.4451 43.638C60.8228 43.8157 5.16447 43.8157 4.52953 43.638C3.95809 43.4729 3.19617 42.6602 3.09458 42.0887C3.05648 41.8601 3.04379 33.3774 3.05648 23.2566L3.09458 4.84346L3.39935 4.4244C3.56443 4.18313 3.8819 3.87836 4.09778 3.75137C4.47874 3.5228 5.22796 3.5101 33.0127 3.5101H61.534L61.9657 3.80217Z" fill="CurrentColor" stroke="white"/>
                                          <path d="M26.3205 9.66898C21.6982 10.6722 20.1235 16.3866 23.5522 19.6756C26.6379 22.6343 31.8571 21.2375 33.127 17.1104C34.1429 13.8215 32.0984 10.3801 28.6951 9.65628C27.6792 9.44041 27.3364 9.4531 26.3205 9.66898ZM28.8729 12.323C30.9428 13.1865 31.5015 16.0564 29.9142 17.7073C29.2285 18.4311 28.6189 18.6851 27.5395 18.6851C26.8157 18.6851 26.4729 18.6216 26.0792 18.4057C24.9363 17.7961 24.2506 16.666 24.2379 15.3834C24.2379 14.2151 24.7077 13.3516 25.7998 12.5262C26.4475 12.0436 27.9459 11.942 28.8729 12.323Z" fill="CurrentColor" stroke="white"/>
                                          <path d="M36.4795 18.9137C36.3271 19.0025 34.562 21.047 32.5556 23.4725C30.5619 25.9106 28.873 27.8916 28.8095 27.8916C28.746 27.8916 28.3397 27.4472 27.9079 26.9011C26.4475 25.0979 25.7237 24.3106 25.4063 24.1963C24.6443 23.9042 24.5935 23.955 19.3236 29.9615C16.568 33.1235 14.2568 35.841 14.1806 36.0061C14.0155 36.4632 14.1806 36.9839 14.6124 37.3521L14.9933 37.6696H33.0001H51.0068L51.3878 37.3521C51.8322 36.9839 51.9846 36.4632 51.8068 36.0061C51.6418 35.5743 38.1303 19.2438 37.724 18.9771C37.3303 18.7105 36.8605 18.6978 36.4795 18.9137ZM42.5114 28.5901L47.8575 35.0664L42.4606 35.1045C39.4891 35.1172 34.6382 35.1172 31.6667 35.1045L26.2825 35.0664L31.6413 28.5647C34.5874 24.9836 37.0383 22.0756 37.0764 22.0883C37.1271 22.101 39.5653 25.0217 42.5114 28.5901ZM26.1682 28.8059C26.6761 29.4409 27.0825 30.0123 27.0571 30.0758C27.0444 30.1266 26.1047 31.2949 24.9872 32.6536L22.93 35.1299H20.5935H18.2442L18.4855 34.8251C18.6125 34.6473 20.1109 32.9203 21.8252 30.9647C24.0983 28.3742 24.9745 27.4472 25.0888 27.5361C25.1777 27.5996 25.6602 28.1837 26.1682 28.8059Z" fill="CurrentColor" stroke="white"/>
                                          <path d="M8.79636 20.501C8.11063 21.009 6.38361 22.8503 6.26932 23.1932C6.06614 23.8535 6.29472 24.2471 7.71697 25.644C8.96145 26.8758 9.12653 27.0028 9.55828 27.0028C10.1678 27.0028 10.4726 26.8377 10.7139 26.3678C11.0694 25.6821 10.9678 25.39 10.0789 24.4757L9.25352 23.6249L9.90115 22.99C11.0313 21.8852 11.1837 21.2884 10.4726 20.5772C9.92655 20.0312 9.46939 20.0185 8.79636 20.501Z" fill="CurrentColor" stroke="white"/>
                                          <path d="M55.5275 20.5772C54.8163 21.2884 54.9687 21.8852 56.0989 22.99L56.7465 23.6249L55.9211 24.4757C55.0322 25.39 54.9306 25.6821 55.2862 26.3678C55.5275 26.8377 55.8322 27.0028 56.4418 27.0028C56.8735 27.0028 57.0386 26.8758 58.2831 25.644C60.2133 23.7519 60.2387 23.536 58.664 21.8852C56.8989 20.0312 56.3148 19.7899 55.5275 20.5772Z" fill="CurrentColor" stroke="white"/>
                                      </svg>
                                  </span>
                              {{ $t('Photos Slideshow') }} </button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button class="nav-link" :class="[ active_tab.index == 2 ? 'active' : '']" @click="setActive('video',2)" data-bs-toggle="pill" data-bs-target="#VideoShow" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                              <span class="icon">
                                  <svg width="66" height="47" viewBox="0 0 66 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M3.67872 1.17356C2.44695 1.60531 1.46915 2.51962 0.885008 3.75139L0.554842 4.46252L0.516746 23.3074C0.47865 44.2602 0.427855 42.9015 1.32946 44.2348C1.86281 45.0094 2.38345 45.4285 3.38665 45.8983L4.11048 46.2412H33H61.8895L62.6134 45.8983C63.6166 45.4285 64.1372 45.0094 64.6705 44.2348C65.5722 42.9015 65.5214 44.2602 65.4833 23.3074L65.4452 4.46252L65.1023 3.73869C64.6578 2.77359 63.7816 1.85928 62.88 1.40213L62.1435 1.03387L33.1905 1.00847C7.31054 0.983074 4.17397 1.00847 3.67872 1.17356ZM61.9657 3.80219C62.1943 3.95457 62.5245 4.31013 62.6768 4.5895L62.9689 5.09745V23.536C62.9689 36.2346 62.9308 42.076 62.8292 42.33C62.6388 42.8634 61.9657 43.4983 61.4451 43.638C60.8228 43.8158 5.16447 43.8158 4.52953 43.638C3.95809 43.4729 3.19617 42.6602 3.09458 42.0887C3.05648 41.8602 3.04379 33.3774 3.05648 23.2566L3.09458 4.84348L3.39935 4.42442C3.56443 4.18314 3.8819 3.87838 4.09778 3.75139C4.47874 3.52281 5.22796 3.51011 33.0127 3.51011H61.534L61.9657 3.80219Z" fill="currentColor" stroke="#fff"/>
                                      <path d="M40.175 23.6969C40.4083 23.8316 40.4083 24.1684 40.175 24.3031L28.175 31.2313C27.9417 31.366 27.65 31.1976 27.65 30.9282L27.65 17.0718C27.65 16.8024 27.9417 16.634 28.175 16.7687L40.175 23.6969Z" stroke="currentColor" stroke-width="1.3"/>
                                      </svg>
                              </span>
                              {{ $t('Video') }} </button>
                          </li>
                        </ul>
                      </div>
                      <div class="col-md-9">
                        <div class="tab-content" id="pills-tabContent">
                          <div class="tab-pane fade" :class="[ active_tab.index == 1 || active_tab.index == ''  ? 'active show' : '']" id="PhotoSlideshow" role="tabpanel" tabindex="0">
                            <div class="showupload-field">
                              <label>
                                <input type="file" name="images[]" id="images" accept="image/jpg, image/jpeg, image/png" @change="selectImages" ref="images" multiple/>
                                <span>
                                    <div class="row align-items-center justify-content-center">
                                        <div class="col-auto">
                                            <svg width="55" height="40" viewBox="0 0 55 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.65 39.25C5.93966 39.25 0.5 33.707 0.5 26.875C0.5 21.4781 3.88934 16.8891 8.61687 15.1961C8.60591 14.9641 8.6 14.732 8.6 14.5C8.6 6.90312 14.6412 0.75 22.1 0.75C27.1034 0.75 31.4656 3.52148 33.8028 7.64219C35.0853 6.68828 36.6378 6.25 38.3 6.25C42.7719 6.25 46.4 9.86797 46.4 14.5C46.4 15.5484 46.2059 16.5453 45.86 17.4734C50.7875 18.4875 54.5 22.9305 54.5 28.25C54.5 34.3258 49.6653 39.25 43.7 39.25H12.65ZM19.3156 20.6016C18.5309 21.4094 18.5309 22.7156 19.3156 23.4461C20.1087 24.3227 21.3913 24.3227 22.1084 23.4461L25.475 20.1633V31.6875C25.475 32.8305 26.3778 33.75 27.5 33.75C28.6222 33.75 29.525 32.8305 29.525 31.6875V20.1633L32.8156 23.4461C33.6087 24.3227 34.8913 24.3227 35.6084 23.4461C36.4691 22.7156 36.4691 21.4094 35.6084 20.6016L28.8584 13.7266C28.1413 12.9273 26.8588 12.9273 26.0656 13.7266L19.3156 20.6016Z" fill="#793693"/>
                                            </svg>
                                        </div>
                                        <div class="col-auto">
                                            <h5>{{ $t('Choose File') }}</h5>
                                            <h6>{{ $t('Max. File size') }} : 10MB</h6>
                                            <p v-if="imgCount!=''">{{ imgCount }} {{ $t('images selected') }}</p>
                                        </div>
                                    </div>
                                </span>
                              </label>
                            </div>
                            <div class="showupload-data">
                              <div class="row g-3">
                                <div class="col-6 col-md-3" v-for="(image, index) in saved_images">
                                  <div class="showuploaddata-box">
                                    <img :src="image.media"/>
                                    <button class="boxclose" @click="deleteMedia(1,image.id)" type="button">
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.00231 2.19527C9.33434 1.86324 9.33434 1.32402 9.00231 0.991989C8.67028 0.659958 8.13106 0.659958 7.79902 0.991989L5.00199 3.79168L2.2023 0.994645C1.87027 0.662614 1.33105 0.662614 0.999023 0.994645C0.666992 1.32668 0.666992 1.8659 0.999023 2.19793L3.79871 4.99496L1.00168 7.79465C0.669648 8.12668 0.669648 8.6659 1.00168 8.99793C1.33371 9.32996 1.87293 9.32996 2.20496 8.99793L5.00199 6.19824L7.80168 8.99527C8.13371 9.3273 8.67293 9.3273 9.00496 8.99527C9.33699 8.66324 9.33699 8.12402 9.00496 7.79199L6.20527 4.99496L9.00231 2.19527Z" fill="currentColor"/>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="tab-pane fade" :class="[ active_tab.index == 2 ? 'active show' : '']" id="VideoShow" role="tabpanel" tabindex="0">

                            <div class="showupload-field">
                              <label>
                                <input type="file" name="video" id="video" accept="video/*" @change="selectVideo" ref="video"/>
                                <span>
                                    <div class="row align-items-center justify-content-center">
                                        <div class="col-auto">
                                            <svg width="55" height="40" viewBox="0 0 55 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.65 39.25C5.93966 39.25 0.5 33.707 0.5 26.875C0.5 21.4781 3.88934 16.8891 8.61687 15.1961C8.60591 14.9641 8.6 14.732 8.6 14.5C8.6 6.90312 14.6412 0.75 22.1 0.75C27.1034 0.75 31.4656 3.52148 33.8028 7.64219C35.0853 6.68828 36.6378 6.25 38.3 6.25C42.7719 6.25 46.4 9.86797 46.4 14.5C46.4 15.5484 46.2059 16.5453 45.86 17.4734C50.7875 18.4875 54.5 22.9305 54.5 28.25C54.5 34.3258 49.6653 39.25 43.7 39.25H12.65ZM19.3156 20.6016C18.5309 21.4094 18.5309 22.7156 19.3156 23.4461C20.1087 24.3227 21.3913 24.3227 22.1084 23.4461L25.475 20.1633V31.6875C25.475 32.8305 26.3778 33.75 27.5 33.75C28.6222 33.75 29.525 32.8305 29.525 31.6875V20.1633L32.8156 23.4461C33.6087 24.3227 34.8913 24.3227 35.6084 23.4461C36.4691 22.7156 36.4691 21.4094 35.6084 20.6016L28.8584 13.7266C28.1413 12.9273 26.8588 12.9273 26.0656 13.7266L19.3156 20.6016Z" fill="#793693"/>
                                            </svg>
                                        </div>
                                        <div class="col-auto">
                                            <h5>{{ $t('Choose File') }}</h5>
                                            <h6>{{ $t('Max. File size') }} : 250MB</h6>
                                            <p v-if="videoName!=''">{{ videoName }} {{ $t('Selected') }}</p>
                                        </div>
                                    </div>
                                </span>

                              </label>
                            </div>
                            <div class="showupload-data showupload-videodata">
                              <div class="row g-3">
                                <div class="col-12 col-md-5" v-if="saved_video">
                                  <div class="showuploaddata-box">
                                    <video width="290" height="240" controls>
                                      <source :src="saved_video" type="video/mp4">
                                    </video>
                                    <button class="boxclose" @click="deleteMedia(2,0)" type="button">
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.00231 2.19527C9.33434 1.86324 9.33434 1.32402 9.00231 0.991989C8.67028 0.659958 8.13106 0.659958 7.79902 0.991989L5.00199 3.79168L2.2023 0.994645C1.87027 0.662614 1.33105 0.662614 0.999023 0.994645C0.666992 1.32668 0.666992 1.8659 0.999023 2.19793L3.79871 4.99496L1.00168 7.79465C0.669648 8.12668 0.669648 8.6659 1.00168 8.99793C1.33371 9.32996 1.87293 9.32996 2.20496 8.99793L5.00199 6.19824L7.80168 8.99527C8.13371 9.3273 8.67293 9.3273 9.00496 8.99527C9.33699 8.66324 9.33699 8.12402 9.00496 7.79199L6.20527 4.99496L9.00231 2.19527Z" fill="currentColor"/>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-end">
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="form.is_submitting"
            >
              <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
              <span class="pt-0" v-if="form.is_submitting">{{ $t('Updating...') }}</span>
              <span class="pt-0" v-else>{{ $t('Update') }}</span>
            </button>
          </div>
        </Form>

       

      </div>

      <CDSSettingSkeleton v-else />

</DefaultLayout>
</template>

<script setup>
import { Form } from 'vee-validate'
import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {ref, reactive} from "vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const labels = ref({
  title: t('Title'),
  enter_title: t("Enter title"),
  description: t("Description"),
  enter_description: t("Enter description"),
});
const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

const auth = useAuthStore();

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  title : "",
  description : "",
  theme_mode : 1,
  adds_type : 1,
  images: [],
  video: "",
};

const form = reactive({ ...initialState });

/*const schema = yup.object({
  title: yup.string().required().min(3).label('title'),
  description: yup.string().required().min(3).label('description'),
});*/

onMounted(() => {
  getCDSSettings();
});

const saved_images = ref([]);
const saved_video = ref("");

const is_loaded = ref(false);
async function getCDSSettings(){
  let add_data = await axios.get('api/cds_setting/add');
  add_data = add_data.data.data.setting;
  form.title = add_data.title!='undefined' && add_data.adds_type!=undefined?add_data.title:'';
  form.description = add_data.description!='undefined' && add_data.adds_type!=undefined?add_data.description:'';
  form.theme_mode = add_data.theme_mode!='undefined' && add_data.adds_type!=undefined?add_data.theme_mode:1;
  form.adds_type = add_data.adds_type!='undefined' && add_data.adds_type!=undefined?add_data.adds_type:1;
  active_tab.value = add_data.adds_type!='undefined' && add_data.adds_type!=undefined?{tab: 'tab', index: add_data.adds_type}:{tab: 'tab', index: 1};
  saved_images.value = [];
  saved_video.value = "";
  if(add_data.media?.length > 0){
    add_data.media.map(function(value, key) {
      if(value.type==1){
        saved_images.value.push(value);
      }else{
        saved_video.value =value.media;
      }
    });
  }
  is_loaded.value = true;
}
const videoName = ref("");
const imgCount = ref("");
async function selectVideo(e){
  form.video = e.target.files[0];
  videoName.value = e.target.files[0].name;
}

var form_data = new FormData();
const images = ref([]);
async function selectImages(e){
  var imgs = e.target.files;
  imgCount.value = imgs.length;
  for(var i = 0; i < imgs.length; i++){
    //images.value.push(imgs[i]);
  }
}

async function saveCDSSetting(){
  form.is_submitting = true;
  var form_data = new FormData();
  form_data.append('title',form.title);
  form_data.append('description',form.description);
  form_data.append('theme_mode',form.theme_mode);
  form_data.append('adds_type',form.adds_type);
  form_data.append('video',form.video);
  var images = $("input[name='images[]']")[0].files;
  if(images.length > 0){
    for(var i = 0;i < images.length;i++)
    {
      console.log(images[i])
      form_data.append('images['+i+']',images[i])
    }
  }
  await axios.post('/api/cds_setting/save', form_data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
      }).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      form.is_submitting = false;
      router.push('/cds_setting');
      location.reload();

    }else{
      try{
        form.server_messages.type = "error";
        form.server_messages.messages = JSON.parse(response.data.msg);
      }catch(err){
        form.server_messages.type = "error";
        form.server_messages.messages = response.data.msg;
      }
      form.is_submitting = false;
    }

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    form.is_submitting = false;
  });

}

const active_tab = ref({
  index : '',
  tab : ''
});

function setActive(tab,index){
  let template = {
    tab: tab,
    index: index,
  };
  active_tab.value = template;
  form.adds_type = index;
}

async function deleteMedia(type,id){
  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this Media?'),
    showCancelButton: true,
    confirmButtonText: t('Yes, Delete'),
    cancelButtonText: t('Cancel'),
    confirmButtonColor: '#d33',
  }).then( (result) => {
    if(result.isConfirmed){
      is_confirmed = true;
    }
  });

  if(is_confirmed){

    await axios.post('/api/cds_setting/delete',{
      type : type,
      id : id
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getCDSSettings();

      }else{
        try{
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        }catch(err){
          form.server_messages.type = "error";
          form.server_messages.messages = response.data.msg;
        }
      }

    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
  }
}
function resetData(){
    Object.assign(form, initialState);
}
</script>
