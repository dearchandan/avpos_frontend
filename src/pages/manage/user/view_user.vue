<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
          <div class="row align-items-center">
              <div class="col-auto">
                  <div class="header-back-link">
                      <router-link class="text-primary" to="/users" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Users') }}</router-link>
                  </div>
              </div>
              <div class="col-auto">
                  <h5 class="fw-bold">{{ user.name  }} </h5>
              </div>
              <div class="col align-self-end">
                  <p class="fw-bold  text-end mb-3"><router-link class="text-primary" :to="'/user/edit/'+user.slack">{{ $t('Edit')  }} </router-link></p>
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
        <div class="col-6 col-md-2 mx-auto">
            <div class="card">
                <div v-if="user == ''">
                    <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                </div>
                <div v-else class="text-center">
                  <img v-if="user.profile_pic != ''" :src="user.profile_pic" class="" alt="">
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
      <div class="row">
        <div class="col-md-12">
          <div class="card shadow-none">
            <div class="row align-items-center mb-2">
              <div class="col-auto">
                <h2 class="mb-3">{{ $t('Branch Access') }}</h2>
              </div>
            </div>
            <div>
              
              <ul style="" v-if="is_loaded" >

                <div class="row g-3 mb-3">
                  <div class="col-3">
                    <VMultiSelect
                        name="account_type"
                        placeholder="Select branch to assign"
                        :text="'value'"
                        :value="'key'"
                        :options="branches"
                        mode="single"
                        required
                        v-model="form.added_branch_slack"
                      />
                  </div>
                  <div class="col-3">
                    <button type="button" class="ms-4 btn btn-success" @click="updateBranchAccess" :disabled="is_submitted">
                      {{ $t('Assign') }}</button>
                    <button type="button" class="ms-4 btn btn-danger" @click="unassign_all_branches" :disabled="is_submitted">
                      {{ $t('Unassign All') }}</button>
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-3" v-for="(branch,branch_index) in selected_branches" :key="branch_index">
                    <li >
                      <label class="label me-3">
                        <input class="form-check-input me-1" type="checkbox" @click="updateBranch(branch.key)" 
                          :disabled="(user_branches.length==1 && user_branches.indexOf(branch.key) !== -1) || (is_submitted == true && is_loading == true)"
                          :checked="user_branches.indexOf(branch.key) !== -1" >
                          <span class="text-start">
                            <b>
                              {{ branch.value }}
                              <br>
                              <small class="text-muted">{{ branch.email }}</small>
                            </b>
                          </span>
                      </label>
                    </li>

                  </div>
                </div>
              </ul>
              
              <UserBranchSkeleton  v-else />
             
            </div>

          </div>
        </div>
      </div>

      <!-- <div class="row d-none">
        <div class="col-12">
          <div class="card">
            <div class="row pb-4 align-items-center justify-content-between">
              <div class="col-auto">
                <h4>{{ $t('Custom Fields') }}</h4>
              </div>
              <div class="col-auto text-end">
                <a
                    class="btn btn-light-primary2 btn-sm"
                    href="#"
                    data-bs-toggle="modal"
                    @click="openAddUserCustomFieldModal()"
                    data-bs-target="#addUserCustomFieldModal"
                >
                  + {{ $t('Add Custom Field') }}
                </a>
              </div>
            </div>
            <div v-if="is_custom_fields_listing">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-condensed">
                <thead>
                <tr>
                  <th class="fw-bold">{{ $t('Name') }}</th>
                  <th class="fw-bold">{{ $t('Value') }}</th>
                  <th width="10%" class="fw-bold">{{ $t('Created At') }}</th>
                  <th width="5%" class="fw-bold">{{ $t('Status') }}</th>
                  <th width="5%" scope="col" class="text-end">{{ $t('Action') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="user_custom_fields != ''" v-for="(custom_field,custom_field_index) in user_custom_fields" :key="custom_field_index">
                  <td>{{  custom_field.field_name }}</td>
                  <td>{{  custom_field.field_value }}</td>
                  <td>{{  custom_field.created_at_label }}</td>
                  <td>
                    <div class="form-feild">
                      <div class="form-check form-switch form-switch-2">
                        <input class="form-check-input" type="checkbox" role="switch" id="Status_id" @change="changeStatus(custom_field.slack)" :checked="custom_field.status == 1">
                      </div>
                    </div>
                  </td>
                  <td class="text-end">
                    <div class="dropdown">
                      <button class="btn btn-icon btn-sm btn-light dropdown-toggle arrow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Icon icon="fa6-solid:ellipsis-vertical" />
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" data-bs-toggle="modal" @click="openCustomFieldModal(custom_field)" data-bs-target="#addCustomFieldModal">{{ $t('Edit') }}</a></li>
                        <li>
                          <a class="dropdown-item" href="#" @click="deleteUserCustomField(custom_field.slack)">{{ $t('Delete') }}</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr v-else>
                  <td class="text-center py-3" colspan="9">{{ $t('No Data Found') }}</td>
                </tr>
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div> -->

    </div>

    <!-- <AddUserCustomField :show_add_user_custom_field_modal="show_add_user_custom_field_modal" @closeAddUserCustomFieldModal="closeAddUserCustomFieldModal" :user_slack="slack" /> -->

  </DefaultLayout>
</template>

<script setup>

import {ref, reactive, onMounted, watch} from 'vue';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

// import AddUserCustomField from '@/components/user/AddUserCustomField.vue';

import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { event } from 'jquery';

const authStore = useAuthStore();

const { t } = useI18n();

const route = useRoute();
const slack = route.params.slack;

const is_loaded = ref(false);
const is_loading = ref(false);
const user = ref([]);
const user_branches = ref([]);
const is_submitted = ref(false);

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  added_branch_slack: "", 
};

const form = reactive({ ...initialState });

getUser();

async function getUser(){

  is_loading.value = true;

  await axios.get('/api/user', { params : {
      slack : slack,
    } }).then( (response) => {
    user.value = response.data.data;
    if(response.data.data.branches!=null){
      user_branches.value=[];
      _.forEach(response.data.data.branches, (item) => {
        user_branches.value.push(item.slack);
      })
    }

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
const selected_branches = ref([]);
const sliced_branched = ref([]);

getBranches();

async function getBranches(){
  let branch_data = await axios.get('api/v2/branches/dropdown');

  _.forEach(branch_data.data.data, (item) => {
    if(item.status == 1){
      let template = {
        'key': item.slack,
        'value': item.name,
        'email': item.email,
      };
      if(user_branches.value.indexOf(item.slack) !== -1){
        selected_branches.value.push(template);
      }else{
        branches.value.push(template);
      }
      is_loaded.value = true;
    }
    
  })
  if(branches.value.length > 0){
    let template = {
      'key': 'All',
      'value': 'All Branches',
      'email': '',
    };
    branches.value.unshift(template);
  }
}

// watch(() =>
//   form.added_branch_slack, _.debounce( () => {
//     updateBranchAccess(form.added_branch_slack);
//     },200),
// );

async function updateBranchAccess(){
  var branch_slack = form.added_branch_slack;
  if(branch_slack != '' && branch_slack != undefined && branch_slack != 'All'){
    updateBranch(branch_slack);
    _.forEach(branches.value, (item) => {
      if(item != undefined ){
          if(item.key == branch_slack){
            selected_branches.value.push(item);
            branches.value.splice(branches.value.findIndex(item => item.key === branch_slack), 1);
          }
        }
      });
  }
  if( branch_slack == 'All'){    
    updateBranch(branch_slack); 
  } 
}

async function unassign_all_branches(){
  var is_confirmed = false;
  await Swal.fire({
    icon: 'warning',
    title: t("Are sure do you want to unassign all branches?"),
    text: t("This action will unassign all branches except one branch."),
    showCancelButton: true,
    confirmButtonText: t("Yes, Unassign All"),
    confirmButtonColor: "#d33",
    cancelButtonText: t("Cancel"),
  }).then((result) => {
    if (result.isConfirmed) {
      is_confirmed = true;
    }
  });

  if (is_confirmed) {
    updateBranch('unassign_all');
  }

}

async function updateBranch(branch_slack){
  if(branch_slack != '' && branch_slack != undefined){
    is_submitted.value = true;
    var form_data = new FormData();
    form_data.append('user_slack',slack);
    form_data.append('branch_slack',branch_slack);
    await axios.post('/api/user/update_branch', form_data).then( (response) => {
  
      if(response.data.status_code == 200) {
  
        toast.success(response.data.msg);
        authStore.refresh();
        getUser();

        if( branch_slack == 'All'){    
          _.forEach(branches.value, (item) => {
            if(item != undefined ){
                if( item.key != 'All'){
                  selected_branches.value.push(item);
                }
                sliced_branched.value.push(item.key)
              }
            });
            _.forEach(sliced_branched.value, (item2) => {
              branches.value.splice(branches.value.findIndex(item => item.key === item2), 1);
            });
        } 
          
      }else{
        try{
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        }catch(err){
          form.server_messages.type = "error";
          form.server_messages.messages = response.data.msg;
        }
      }
      is_submitted.value = false;
    }).catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
      is_submitted.value = false;
    });
  }
}

/* CustomField */
const show_add_user_custom_field_modal = ref(false);

function openAddUserCustomFieldModal(){
  show_add_user_custom_field_modal.value = true;
}
function closeAddUserCustomFieldModal(){
  show_add_user_custom_field_modal.value = false;
  getUserCustomFields();
}

const is_custom_fields_listing = ref(false);
const user_custom_fields = ref([]);

// getUserCustomFields();

async function getUserCustomFields(){

  is_custom_fields_listing.value = true;

  await axios.get('/api/user/custom_fields', { params : {
      user_slack : slack,
    } }).then( (response) => {

    user_custom_fields.value = response.data.data;
    is_custom_fields_listing.value = false;

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    is_custom_fields_listing.value = false;
    console.log(error);
  });

}

async function changeStatus(slack){

  var form_data = new FormData();
  form_data.append('slack',slack);

  await axios.post('/api/user/custom_field/update_status', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      getUserCustomFields();

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

async function deleteUserCustomField(slack){

  var is_confirmed = false;

  await Swal.fire({
    title: t('Do you want to delete this item?'),
    showCancelButton: true,
    confirmButtonText: t('Yes, Delete'),
    confirmButtonColor: '#d33',
    cancelButtonText: t('Cancel'),
  }).then( (result) => {
    if(result.isConfirmed){
      is_confirmed = true;
    }
  });

  if(is_confirmed){

    await axios.post('/api/user/custom_field/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getUserCustomFields();

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
</script>