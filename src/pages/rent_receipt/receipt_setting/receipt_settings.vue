  <template>
   <DefaultLayout>

     <template v-slot:subheader>
       <RentReceiptMenu />
     </template>

     <div class="content">
       <Form
           :validation-schema="schema"
           @submit="saveRentReceiptSetting"
           enctype="multipart/form-data"
           :initial-values="form"
       >
         <div class="row card-strash">
           <div class="py-3" v-if="form.server_messages.messages != ''">
             <ServerMessage :server_messages="form.server_messages" />
           </div>

           <div class="col-md-12">
             <div class="row">

               <div class="col-md-12">
                 <div class="card">
                   <h5 class="pb-3">{{ $t("Select a branch for update rent receipt settings") }}</h5>
                   <div class="row">
                     <div class="col-md-3">
                       <VMultiSelect
                           name="branch"
                           :text="'name'"
                           :value="'id'"
                           :options="branches"
                           mode="single"
                           v-model="form.branch"
                           :placeholder="labels.select_branch"
                       />
                     </div>
                   </div>
                   <div class="row">
                     <div class="col-md-3" v-if="form.branch!=''">
                       <VTextInput
                           type="text"
                           name="pavilion_code"
                           v-model="form.pavilion_code"
                           :label="labels.pavilion_code"
                           :required="true"
                       />
                     </div>
                     <div class="col-md-3" v-if="form.branch!=''">
                       <VTextInput
                           type="text"
                           name="pavilion_name"
                           v-model="form.pavilion_name"
                           :label="labels.pavilion_name"
                           :required="true"
                       />
                     </div>
                     <div class="col-md-3" v-if="form.branch!=''">
                       <VTextInput
                           type="text"
                           name="shop_no"
                           v-model="form.shop_no"
                           :label="labels.shop_no"
                           :required="true"
                       />
                     </div>
                     <div class="col-md-3" v-if="form.branch!=''">
                       <VTextInput
                           type="text"
                           name="exhibitor_name"
                           v-model="form.exhibitor_name"
                           :label="labels.exhibitor_name"
                           :required="true"
                       />
                     </div>
                   </div>
                 </div>
               </div>

             </div>
           </div>
         </div>
         <div class="text-end" v-if="form.branch!=''">
           <button
               type="submit"
               class="btn btn-primary"
               :disabled="form.is_submitting"
           >
             <clip-loader
                 v-if="form.is_submitting"
                 :color="'white'"
                 :size="'20px'"
                 class="pt-2 pe-2"
             >
             </clip-loader>
             <span class="pt-0" v-if="form.is_submitting">
              {{ $t("Updating...") }}
            </span>
             <span class="pt-0" v-else>
              {{ $t("Update") }}
            </span>
           </button>
         </div>
       </Form>
     </div>


  </DefaultLayout>
</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
  import { Form } from "vee-validate";
  import * as yup from "yup";
  import ClipLoader from "vue-spinner/src/ClipLoader.vue";
  import { useRoute } from "vue-router";
  import { useI18n } from "vue-i18n";
  import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { t } = useI18n();
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  branch: "",
  pavilion_code: "",
  pavilion_name: "",
  shop_no: "",
  exhibitor_name: "",
};
const labels = ref({
  branch: t("Branch"),
  select_branch: t("Select Branch"),
  pavilion_code: t("Pavilion Code"),
  pavilion_name: t("Pavilion Name"),
  shop_no: t("Shop No."),
  exhibitor_name: t("Exhibitor Name"),
});

const form = reactive({ ...initialState });
const schema = yup.object({
  branch: yup.string().required(t("name is required", { name: t("Branch") })),
  pavilion_code: yup.string().required(t("name is required", { name: t("Pavilion Code") })),
  pavilion_name: yup.string().required(t("name is required", { name: t("Pavilion Name") })),
  shop_no: yup.string().required(t("name is required", { name: t("Shop No.") })),
  exhibitor_name: yup.string().required(t("name is required", { name: t("Exhibitor Name") })),
});

onMounted(() => {
  getBranches()
});

const branches = ref([]);
async function getBranches(){
  let branch_data = await axios.get('api/branches/all');
  branch_data = branch_data.data.data;
  _.forEach(branch_data, (item) => {
    if(item.status == 1){
      let template = {
        'id': item.slack,
        'name': item.name,
      };
      branches.value.push(template);
    }
  })
}

watch(() =>
   form.branch, (value) => {
      if(value!=''){
        getBranchDetail()
      }
    },
);

async function getBranchDetail(){
  await axios.get('/api/branch', { params : {
      slack : form.branch,
    } }).then( (response) => {

    form.pavilion_code = response.data.data.pavilion_code;
    form.pavilion_name = response.data.data.pavilion_name;
    form.shop_no = response.data.data.shop_no;
    form.exhibitor_name = response.data.data.exhibitor_name;

  }).catch((error) => {
    form.server_messages.type = "error";
    form.server_messages.messages = error;
    is_loading.value = false;
    // console.log(error);
  });
}

async function saveRentReceiptSetting() {

  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append('branch_slack',form.branch);
  form_data.append('pavilion_code',form.pavilion_code);
  form_data.append('pavilion_name',form.pavilion_name);
  form_data.append('shop_no',form.shop_no);
  form_data.append('exhibitor_name',form.exhibitor_name);

  var submit_url = '/api/branch/update_voucher_setting';

  await axios.post(submit_url, form_data).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      form.is_submitting = false;

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
    console.log(error);
  });
}
</script>