<template>
    <div>
      <div class="row pb-4 align-items-center justify-content-between">
        <div class="col-auto">
          <h5 class="pt-2">{{ $t('Custom Fields') }}</h5>
        </div>
        <div class="col-auto text-end">
          <a
              class="btn btn-light-primary2 btn-sm"
              href="#"
              data-bs-toggle="modal"
              @click="openAddSupplierCustomFieldModal()"
              data-bs-target="#addSupplierCustomFieldModal"
          >
            + {{ $t('Add Custom Field') }}</a>
        </div>
      </div>

        <ListingSkeleton v-if="is_custom_fields_listing" />
        <div v-else class="table-responsive">
            
            <table class="table table-list-data table-hover">
                <thead class="bg-light">
                <tr>
                  <th class="fw-bold">{{ $t('Name') }}</th>
                  <th class="fw-bold">{{ $t('Value') }}</th>
                  <th width="10%" class="fw-bold">{{ $t('Created At') }}</th>
                  <th width="5%" class="fw-bold">{{ $t('Status') }}</th>
                  <th width="5%" scope="col" class="text-end">{{ $t('Action') }}</th>
                </tr>
                </thead>
                <tbody> 
                    <tr v-if="supplier_custom_fields != ''" v-for="(custom_field,table_index) in supplier_custom_fields" :key="table_index" >
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
                      <td class="text-end" v-if="permissions.write || permissions.delete">
                        <ActionButtonGroup :permissions="permissions" @delete="deleteSupplierCustomField" @editModal="openAddSupplierCustomFieldModal" :slack="custom_field.slack" :edit_modal_data="custom_field" :edit_modal_target="'#addSupplierCustomFieldModal'" />
                      </td>
                    </tr>
                    <tr v-else>
                        <td class="text-center py-3" colspan="5">{{ $t('No Data Found') }}</td>
                    </tr>
                    
                </tbody>
            </table>
        </div>

        <AsyncAddSupplierCustomField :show_add_supplier_custom_field_modal="show_add_supplier_custom_field_modal" @closeAddSupplierCustomFieldModal="closeAddSupplierCustomFieldModal" :supplier_slack="supplier_slack" :edit_data="edit_data"/>

    </div>

</template>

<script setup>
import {computed, reactive, ref} from "vue";
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useAuthStore } from '@/stores/auth';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { useI18n } from 'vue-i18n'
import useGlobalFunctions from '@/composables/global_functions.js';


const { isAuthorized } = useGlobalFunctions();
const AsyncAddSupplierCustomField = defineAsyncComponent( () => import('@/components/supplier/AddSupplierCustomField.vue') );


const { t } = useI18n();

const authStore = useAuthStore();

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
})

onMounted(() => {

  checkPermissions();

  getSupplierCustomFields();

});


const permissions = ref({
  write : false,
  delete : false,
});

function checkPermissions(){
  permissions.value  = {
    write : isAuthorized('A_WRITE_CUSTOMER'),
    delete : isAuthorized('A_DELETE_CUSTOMER'),
  };
}

const initialState = {
    server_messages: {
    type: "",
    messages: "",
    },
    is_listing: false,

    // form data   
    search_query : ref("")
};
const search_placeholder = t("search orders by order no., amount")
const form = reactive({ ...initialState });
const props = defineProps(['supplier_slack']);



/* CustomField */
const show_add_supplier_custom_field_modal = ref(false);

const edit_data = ref([]);
function openAddSupplierCustomFieldModal(editdata = ""){
  edit_data.value = editdata;
  show_add_supplier_custom_field_modal.value = true;
}
function closeAddSupplierCustomFieldModal(){
  show_add_supplier_custom_field_modal.value = false;
  getSupplierCustomFields();
}

const is_custom_fields_listing = ref(false);
const supplier_custom_fields = ref([]);

async function getSupplierCustomFields(){

  is_custom_fields_listing.value = true;

  await axios.get('/api/supplier/custom_fields', { params : {
      supplier_slack : props.supplier_slack,
    } }).then( (response) => {

    supplier_custom_fields.value = response.data.data;
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

  await axios.post('/api/supplier/custom_field/update_status', form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      getSupplierCustomFields();

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

async function openCustomFieldModal(custom_field){
  openAddSupplierCustomFieldModal();
}

async function deleteSupplierCustomField(slack){

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

    await axios.post('/api/supplier/custom_field/delete',{
      slack : slack
    }).then( (response) => {

      if(response.data.status_code == 200) {

        Swal.fire(response.data.msg);
        getSupplierCustomFields();

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