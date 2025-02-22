<template>
     <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/admin/users" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Sub Admins') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ user.name  }} </h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <div class="page-heading">
                <div class="py-3" v-if="form.server_messages.messages != ''">
                    <ServerMessage :server_messages="form.server_messages"  />
                </div>
            </div>
            <div class="row">
                <div class="col-2">
                    <div class="card">
                        <div v-if="user == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else class="text-center">
                        <img v-if="user.profile_pic != ''" :src="user.profile_pic" class="rounded-circle" alt="">
                        <Icon v-else icon="ic:baseline-person" style="font-size: 125px;" />
                        </div>
                    </div>
                </div>
                <div class="col-md-10">
                <div class="card">
                    <div v-if="user == ''">
                    <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                    </div>
                    <div v-else>
                    <div class="row">

                        <div class="col-md-4">
                        <div class="data-view-box mb-3">
                            <div class="item">
                            <b>{{ $t('User Name') }}:</b>
                            {{ user.name }}
                            </div>
                        </div>
                        </div>
                        <div class="col-md-4">
                        <div class="data-view-box mb-3">
                            <div class="item">
                            <b>{{ $t('Email') }}</b>
                            {{ user.email }}
                            </div>
                        </div>
                        </div>
                        <div class="col-md-4">
                        <div class="data-view-box mb-3">
                            <div class="item">
                            <b>{{ $t('Phone') }}</b>
                            {{ user.phone }}
                            </div>
                        </div>
                        </div>
                        <div class="col-md-4" v-if="user.login_code != ''">
                        <div class="data-view-box mb-3">
                            <div class="item">
                            <b>{{ $t('Login Code') }}</b>
                            {{ user.login_code }}
                            </div>
                        </div>
                        </div>
                        <div class="col-md-4">
                        <div class="data-view-box mb-3">
                            <div class="item">
                            <b>{{ $t('Date of Birth') }}</b>
                            {{ user.date_of_birth }}
                            </div>
                        </div>
                        </div>
                        <div class="col-md-4">
                        <div class="data-view-box mb-3">
                            <div class="item">
                            <b>{{ $t('Date of Anniversary') }}</b>
                            {{ user.date_of_anniversary }}
                            </div>
                        </div>
                        </div>
                        <div class="col-md-4">
                        <div class="data-view-box mb-3">
                            <div class="item">
                            <b>{{ $t('Date of Joining') }}</b>
                            {{ user.joining_date }}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <!-- <div class="row">
                <div class="col-md-12">
                <div class="card shadow-none">
                    <div class="row justify-content-between align-items-center mb-2">
                    <div class="col-auto">
                        <h2 class="mb-3">{{ $t('Branch Access') }}</h2>
                    </div>
                    </div>

                    <div>
                    <ul style="list-style-type: none;">
                        <div class="row">
                        <div class="col-3" v-for="(branch,branch_index) in branches" :key="branch_index">
                            <li >
                                <label class="fs-5 p-3" >
                                
                                <input type="checkbox" @click="updateBranch(branch.key)" :checked="user_branches.indexOf(branch.key) !== -1">
                                
                                <span class="text-start ps-3">
                                    <b>
                                    {{ branch.value }}
                                    <br>
                                    <small class="text-muted">{{ branch.email }}</small>
                                </b></span>
                                </label>
                            </li>

                        </div>
                        </div>
                        </ul>
                    </div>

                </div>
                </div>
            </div> -->
    
        </div>
    </DefaultLayout>  
</template>

<script setup>

import {ref, reactive, onMounted, watch} from 'vue';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import AddUserCustomField from '@/components/user/AddUserCustomField.vue';

import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();

const { t } = useI18n();

const route = useRoute();
const slack = route.params.slack;


const is_loading = ref(false);
const user = ref([]);
const user_branches = ref([]);

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
};

const form = reactive({ ...initialState });

getUser();

async function getUser(){

  is_loading.value = true;

  await axios.get('/api/sub_admin', { params : {
      slack : slack,
    } }).then( (response) => {
    user.value = response.data.data;

    is_loading.value = false;

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    is_loading.value = false;
    console.log(error);
  });

}

/*Branch Selection*/
const branches = ref([]);

getBranches();

async function getBranches(){
  let branch_data = await axios.get('api/branches/all');
  branch_data = branch_data.data.data;
  _.forEach(branch_data, (item) => {
    let template = {
      'key': item.slack,
      'value': item.name,
      'email': item.email,
    };
    branches.value.push(template);
  })
}

async function updateBranch(branch_slack){
  var form_data = new FormData();
  form_data.append('user_slack',slack);
  form_data.append('branch_slack',branch_slack);
  await axios.post('/api/user/update_branch', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      //if(slack == authStore.user.slack)
        authStore.refresh();

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




</script>