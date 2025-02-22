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
                    <h5 class="fw-bold">{{ $t('App Setting') }}</h5>
                </div>
            </div>
        </div>
    </template>

    <div class="content py-5">
      <div class="py-3" v-if="form.server_messages.messages != ''">
        <ServerMessage :server_messages="form.server_messages" />
      </div>

      <div class="row">
        <div class="col-4 offset-4" >
          <div class="card" v-if="is_loaded">
            
            <Form :validation-schema="schema" enctype="multipart/form-data" :initial-values="form" @submit="update">

              
            <div class="form-field">
              <div class="col-12">
                <VTextInput
                    type="text"
                    name="display_name"
                    v-model="form.display_name"
                    :label="labels.display_name"
                    :required="true"
                />
              </div>
            </div>

            <div class="form-field">
              <div class="col-12">
                <VTextArea
                    :label="labels.headoffice_address"
                    name="headoffice_address"
                    v-model="form.headoffice_address"
                    rows="1"
                    :required="true"
                />
              </div>
            </div>

            <div class="form-field">
                <div class="row">
                  <div :class="[ form.logo == '' || form.logo == null ? 'col-md-12' : 'col-md-8' ]">
                    <label class="label" for="">{{ $t("Logo") }}</label>
                    <div class="showupload-field">
                        <label>
                        <input
                            type="file"
                            name="logo"
                            id="logo"
                            accept="image/jpg, image/jpeg, image/png"
                            @change="selectLogo"
                            ref="logo"
                            
                        />

                        <span class="py-3 ps-0">
                            <div class="row align-items-center justify-content-center">
                            <div class="col-auto">
                                <svg
                                width="35"
                                height="20"
                                viewBox="0 0 35 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    d="M12.65 39.25C5.93966 39.25 0.5 33.707 0.5 26.875C0.5 21.4781 3.88934 16.8891 8.61687 15.1961C8.60591 14.9641 8.6 14.732 8.6 14.5C8.6 6.90312 14.6412 0.75 22.1 0.75C27.1034 0.75 31.4656 3.52148 33.8028 7.64219C35.0853 6.68828 36.6378 6.25 38.3 6.25C42.7719 6.25 46.4 9.86797 46.4 14.5C46.4 15.5484 46.2059 16.5453 45.86 17.4734C50.7875 18.4875 54.5 22.9305 54.5 28.25C54.5 34.3258 49.6653 39.25 43.7 39.25H12.65ZM19.3156 20.6016C18.5309 21.4094 18.5309 22.7156 19.3156 23.4461C20.1087 24.3227 21.3913 24.3227 22.1084 23.4461L25.475 20.1633V31.6875C25.475 32.8305 26.3778 33.75 27.5 33.75C28.6222 33.75 29.525 32.8305 29.525 31.6875V20.1633L32.8156 23.4461C33.6087 24.3227 34.8913 24.3227 35.6084 23.4461C36.4691 22.7156 36.4691 21.4094 35.6084 20.6016L28.8584 13.7266C28.1413 12.9273 26.8588 12.9273 26.0656 13.7266L19.3156 20.6016Z"
                                    fill="#1E40AF"
                                />
                                </svg>
                            </div>
                            <div class="col-auto">
                                <h5>{{ $t("Upload File") }}</h5>
                                <h6>{{ $t("Max File Size") }} : 1MB</h6>
                            </div>
                            </div>
                        </span>
                        </label>
                    </div>

                </div>
                <div v-if="form.logo != '' || form.logo != null" class="col-4">
                  <img :src="form.logo" alt="" class="w-100 mt-3 img img-thumbnail">
                </div>
                </div>
             
            </div>

            <div class="form-field">
              <div class="row">
                <div :class="[ form.dark_logo == '' || form.dark_logo == null ? 'col-md-12' : 'col-md-8' ]">
                    <label class="label" for="">{{ $t("Dark Logo") }}</label>
                    <div class="showupload-field">
                        <label>
                        <input
                            type="file"
                            name="dark_logo"
                            id="dark_logo"
                            accept="image/jpg, image/jpeg, image/png"
                            @change="selectDarkLogo"
                            ref="dark_logo"
                        />
                        <span class="py-3 ps-0">
                            <div class="row align-items-center justify-content-center">
                            <div class="col-auto">
                                <svg
                                width="35"
                                height="20"
                                viewBox="0 0 35 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    d="M12.65 39.25C5.93966 39.25 0.5 33.707 0.5 26.875C0.5 21.4781 3.88934 16.8891 8.61687 15.1961C8.60591 14.9641 8.6 14.732 8.6 14.5C8.6 6.90312 14.6412 0.75 22.1 0.75C27.1034 0.75 31.4656 3.52148 33.8028 7.64219C35.0853 6.68828 36.6378 6.25 38.3 6.25C42.7719 6.25 46.4 9.86797 46.4 14.5C46.4 15.5484 46.2059 16.5453 45.86 17.4734C50.7875 18.4875 54.5 22.9305 54.5 28.25C54.5 34.3258 49.6653 39.25 43.7 39.25H12.65ZM19.3156 20.6016C18.5309 21.4094 18.5309 22.7156 19.3156 23.4461C20.1087 24.3227 21.3913 24.3227 22.1084 23.4461L25.475 20.1633V31.6875C25.475 32.8305 26.3778 33.75 27.5 33.75C28.6222 33.75 29.525 32.8305 29.525 31.6875V20.1633L32.8156 23.4461C33.6087 24.3227 34.8913 24.3227 35.6084 23.4461C36.4691 22.7156 36.4691 21.4094 35.6084 20.6016L28.8584 13.7266C28.1413 12.9273 26.8588 12.9273 26.0656 13.7266L19.3156 20.6016Z"
                                    fill="#1E40AF"
                                />
                                </svg>
                            </div>
                            <div class="col-auto">
                                <h5>{{ $t("Upload File") }}</h5>
                                <h6>{{ $t("Max File Size") }} : 1MB</h6>
                            </div>
                            </div>
                        </span>
                        </label>
                    </div>

                </div>
                
                <div v-if="form.dark_logo != '' || form.dark_logo != null" class="col-4">
                  <img :src="form.dark_logo" alt="" class="w-100 mt-3 img img-thumbnail">
                </div>
              </div>
             
            </div>
            <div class="form-field">
              <div class="row">
                <div :class="[ form.favicon_icn == '' || form.favicon_icn == null ? 'col-md-12' : 'col-md-8' ]">
                    <label class="label" for="">{{ $t("Favicon Icon") }}</label>
                    <div class="showupload-field">
                        <label>
                        <input
                            type="file"
                            name="favicon_icn"
                            id="favicon_icn"
                            accept=".ico, image/jpg, image/jpeg, image/png"
                            @change="selectFaviconIcn"
                            ref="favicon_icn"
                        />
                        <span class="py-3 ps-0">
                            <div class="row align-items-center justify-content-center">
                            <div class="col-auto">
                                <svg
                                width="35"
                                height="20"
                                viewBox="0 0 35 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    d="M12.65 39.25C5.93966 39.25 0.5 33.707 0.5 26.875C0.5 21.4781 3.88934 16.8891 8.61687 15.1961C8.60591 14.9641 8.6 14.732 8.6 14.5C8.6 6.90312 14.6412 0.75 22.1 0.75C27.1034 0.75 31.4656 3.52148 33.8028 7.64219C35.0853 6.68828 36.6378 6.25 38.3 6.25C42.7719 6.25 46.4 9.86797 46.4 14.5C46.4 15.5484 46.2059 16.5453 45.86 17.4734C50.7875 18.4875 54.5 22.9305 54.5 28.25C54.5 34.3258 49.6653 39.25 43.7 39.25H12.65ZM19.3156 20.6016C18.5309 21.4094 18.5309 22.7156 19.3156 23.4461C20.1087 24.3227 21.3913 24.3227 22.1084 23.4461L25.475 20.1633V31.6875C25.475 32.8305 26.3778 33.75 27.5 33.75C28.6222 33.75 29.525 32.8305 29.525 31.6875V20.1633L32.8156 23.4461C33.6087 24.3227 34.8913 24.3227 35.6084 23.4461C36.4691 22.7156 36.4691 21.4094 35.6084 20.6016L28.8584 13.7266C28.1413 12.9273 26.8588 12.9273 26.0656 13.7266L19.3156 20.6016Z"
                                    fill="#1E40AF"
                                />
                                </svg>
                            </div>
                            <div class="col-auto">
                                <h5>{{ $t("Upload File") }}</h5>
                                <h6>{{ $t("Max File Size") }} : 1MB</h6>
                            </div>
                            </div>
                        </span>
                        </label>
                    </div>

                </div>

                <div v-if="form.favicon_icn != '' || form.favicon_icn != null" class="col-4">
                  <img :src="form.favicon_icn" alt="" class="w-100 mt-3 img img-thumbnail">
                </div>
              </div>

            </div>

            <div class="form-field pt-4">
              <div class="col-12 text-center">
                <!-- <button
                  type="button"
                  class="btn btn-primary btn-md"
                  @click="update()"
                >
                  {{ $t("Save") }}
                </button> -->

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
            </div>
            
          </Form>

          </div>
          <DataResetSkeleton v-else />
        </div>
        
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { Form } from 'vee-validate'

import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import * as yup from "yup";
const { t } = useI18n();
onMounted(() => {
  get();
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  display_name: "",
  headoffice_address: "",
  logo: "",
  dark_logo: "",
  favicon_icn: "",
  is_submitting: false,
};
const labels = ref({
  "display_name": t('Display Name'),
  "headoffice_address": t('Head Office Address'),
})
const form = reactive({ ...initialState });

const schema = yup.object().shape({
  display_name: yup.string().required(t('name is required', { name: t('Display Name') })),
  headoffice_address: yup.string().required(t('name is required', { name: t('Head Office Address') })),
});

const is_loaded = ref(false);
async function get() {
  await axios
    .get("/api/app_settings")
    .then((response) => {
      if (response.data != "") {
        form.display_name = extractKeyValue(response.data,'DISPLAY_NAME');
        form.headoffice_address = extractKeyValue(response.data,'HEADOFFICE_ADDRESS');
        form.logo = extractKeyValue(response.data,'LOGO');
        form.dark_logo = extractKeyValue(response.data,'DARK_LOGO');
        form.favicon_icn = extractKeyValue(response.data,'FAVICON_ICN');
      }
      is_loaded.value = true;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}

async function update() {
  var form_data = new FormData();
  form_data.append("display_name", form.display_name);
  form_data.append("headoffice_address", form.headoffice_address);
  form_data.append("logo", form.logo);
  form_data.append("dark_logo", form.dark_logo);
  form_data.append("favicon_icn", form.favicon_icn);

  await axios
    .post("/api/app_settings/update", form_data,{
      headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then((response) => {

      toast.success(response.data.msg);
      is_loaded.value = false;

    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}

async function selectLogo(e){
    form.logo = e.target.files[0];
}

async function selectDarkLogo(e){
    form.dark_logo = e.target.files[0];
}

async function selectFaviconIcn(e){
    form.favicon_icn = e.target.files[0];
}

function extractKeyValue(data,key){
  if(data != '' || data.length){
    let temp = _.filter(data, (val) => {
      return val.key == key;
    });
    if(temp.length){
      return temp[0].value;
    }else{
      return '';
    }
  }
}

</script>
