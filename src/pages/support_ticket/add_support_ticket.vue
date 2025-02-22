<template>
  <DefaultLayout>

    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/support_tickets">
                <Icon icon="fa6-solid:chevron-left"/>
                {{ $t('Support Ticket') }}
              </router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" >{{ $t('Support Ticket') }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <Form :validation-schema="schema" v-slot="{ values, search }" @submit="saveSupportTicket" enctype="multipart/form-data" :initial-values="form">
        <div class="row card-strash">
          <AsyncServerMessage class="py-3" v-if="server_messages.messages != ''" :server_messages="server_messages"  />
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">

                    <div class="col-3">
                      <VSelectInput
                          v-model="form.merchant_id"
                          name="merchant_id"
                          :label="labels.merchant_name"
                          :options="merchants_list"
                      />
                      <!-- <VMultiSelect
                        name="merchant_id"
                        :label="labels.merchant_name"
                        :text="'merchant_id'"
                        :value="'id'"
                        :options="merchants_list"
                        :searchable="true"
                        :internal-search="false"
                        :preserve-search="true"
                        mode="single"
                        required
                      /> -->
                    </div>                    
                    <div class="col-2">
                      <VSelectInput
                          v-model="form.ticket_type"
                          name="ticket_type"
                          :label="labels.ticket_type"
                          required
                          :options="ticket_types"
                      />
                    </div>
                    <div class="col-2">
                      <VSelectInput
                          v-model="form.priority"
                          name="priority"
                          :label="labels.priority"
                          required
                          :options="priorities"
                      />
                    </div>
                    <div class="col-2">
                      <VTextInput
                          type="text"
                          name="user_name"
                          :label="labels.user_name"
                          v-model="form.user_name"
                      />
                    </div>
                    
                    <div class="col-3">
                      <VTextInput
                          type="email"
                          name="email"
                          :label="labels.email"
                          v-model="form.email"
                      />
                    </div>
                    <div class="col-3" >
                      <VTextInput
                          type="text"
                          name="title"
                          :label="labels.title"
                          required
                          v-model="form.title"
                      />
                    </div>
                    <div class="col-9">
                      <!-- <label>{{ $t('Description') }}</label> -->
                      <VTextArea
                          name="description"
                          :label="labels.description"
                          v-model="form.description"
                          required
                      >
                      </VTextArea>
                    </div>                    
                    <div class="col-2 pt-4">
                      <VTextInput
                          type="date"
                          name="reporting_date"
                          :label="labels.reporting_date"
                          v-model="form.reporting_date"
                          required
                      />
                    </div>
                    <div class="col-2 pt-4">
                      <VSelectInput
                          v-model="form.reporting_platform"
                          name="reporting_platform"
                          :label="labels.reporting_platform"
                          required
                          :options="reporting_platforms"
                      />
                    </div>
                    
                    <div class="col-3 pt-4">
                      <label class="label">{{ $t("Attachment (jpeg, jpg, png)") }}</label>
                      <div class="input-group input-file-group">
                        <input class="form-control form-control-solid" name="attachment" type="file" id="formFile" @change="selectFile">
                        <label class="btn btn-light-primary min-width-0 mb-0" for="formFile">{{ $t('Upload') }}</label>
                      </div>
                      <small class="form-text text-muted mb-1">{{ $t("Allowed file size per file is 3 MB") }}</small> 
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
            <span class="pt-0" v-if="form.is_submitting">
                        {{ $t('Saving...') }}
                    </span>
            <span class="pt-0" v-else>
                        {{ $t('Save') }}
                    </span>
          </button>

        </div>
      </Form>
    </div>
  </DefaultLayout>
</template>

<script setup>
import {ref, reactive, onMounted, defineAsyncComponent,computed } from 'vue';
import {useRoute} from "vue-router";
import { Form,Field } from 'vee-validate'
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { useI18n } from 'vue-i18n'
import VTextArea from '@/components/common/VTextArea.vue'

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;

const labels = ref({
  merchant_name: t('Select Merchant'), 
  ticket_type: t('Ticket Type'),
  priority: t('Priority'),
  title: t('Title'),
  description: t('Description'),
  reporting_date: t('Reporting Date'),
  reporting_platform: t('Reporting Platform'),
  user_name: t('User Name'),
  email: t('Email'),
  attachment: t('Attachment (jpeg, jpg, png)'),
});
const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

const auth = useAuthStore();

const server_messages = reactive({
  type: "",
  messages: "",
});

const form = ref({
  is_submitting: false,
  // form data (field names must match with database table)
  title : "",
  ticket_type : 'INQUIRY',
  priority : 'MEDIUM',
  merchant_id : '',
  description : "",
  reporting_date : "",
  reporting_platform : "",
  user_name : "",
  email : '',
  attachment : '',

});


const reporting_platforms = ref([
  {
    id : 'WEB',
    name : 'Web',
  },
  {
    id: 'WOSUL_EASY',
    name: 'Wosul Easy',
  },
  {
    id : 'IPAD',
    name : 'IPad',
  }
]);

const ticket_types = ref([
  {
    id : 'INQUIRY', name : 'INQUIRY',
  },
  {
    id : 'SUGGESTION', name : 'SUGGESTION',
  },
  {
    id : 'COMPLAINT', name : 'COMPLAINT',
  },
  {
    id : 'TECHNICAL_PROBLEM', name : 'TECHNICAL_PROBLEM',
  },
  {
    id : 'TECHNICAL_SUPPORT', name : 'TECHNICAL_SUPPORT',
  }
]);

const priorities = ref([
  {
    id : 'LOW', name : 'LOW',
  },
  {
    id : 'MEDIUM', name : 'MEDIUM',
  },
  {
    id : 'HIGH', name : 'HIGH',
  },
]);

const multiselect = defineComponent(
    Multiselect
)

onMounted(() => {
  getMerchants();
  if(!_.isUndefined(slack)){
    getSupportTicket();
  }
});

let schema = yup.object({
  title: yup.string().required(t('name is required', { name: t('Title') }))
          .min(3,t('name must be at least n characters', { name: t('Title'), number: 3 })),
  description: yup.string().required(t('name is required', { name: t('Description') })),
  ticket_type: yup.string().required(t('name is required', { name: t('Ticket Type') })),
  priority: yup.string().required(t('name is required', { name: t('Priority') })),
  reporting_date: yup.string().required(t('name is required', { name: t('Reporting Date') })),
  reporting_platform: yup.string().required(t('name is required', { name: t('Reporting Platform') })),
  // tax_name: yup.string().nullable()
  //           .when('price_type',{
  //               is: price_type=> price_type == 2,
  //               then: (schema) => schema.required(t('name is required', { name: t('Tax Name') })),
  //               otherwise:(schema) => schema.nullable()
  //           }),
  // status: yup.bool().label('status'),
});

const merchants_list = ref([]);
async function getMerchants(){
  let response = await axios.get('/api/merchants/all_merchants_ids');
  merchants_list.value = response.data.data;
  console.log('merchants_list.value =', merchants_list.value);
  // return;
 
}

async function getSupportTicket(){
  let response = await axios.get('/api/support_ticket/'+slack);
  form.value = response.data.data;
  console.log(form.value)
  form.value.country_id = response.data.data.country.slack;
  form.value.description = response.data.data.description!=null?response.data.data.description:"";
  form.value.description_ar = response.data.data.description_ar!=null?response.data.data.description_ar:"";
  form.value.price_type = response.data.data.price_type!=null?response.data.data.price_type:1;
  if(response.data.data.features!=null){
    _.forEach( response.data.data.features , (item) => {
      feature_selected.value.push(item.feature_name);
    });
  }
  if(response.data.data.addons!=null){
    addon_selected.value = [];
    _.forEach( addons.value, (addon) => {
      var addon_value = '';
      _.forEach(response.data.data.addons , (saved_addon) => {
        if(saved_addon.addon_master_id == addon.id){
          addon_value = saved_addon.limit_value;
        }
      });
      let addon_template = {
        id : addon.id,
        constant_name:addon.constant_name,
        name:addon.name,
        name_ar : addon.name_ar,
        description : addon.description,
        type : addon.type,
        status : addon.status,
        value :addon_value
      };
      addon_selected.value.push(addon_template);
    });
  }
}

// const props = defineProps(['action']);
const clone_mode = computed(() => {
  return !_.isUndefined(props.action);
});

async function selectFile(e){
  form.value.attachment = e.target.files[0];
}

async function saveSupportTicket(){
  form.value.is_submitting = true;
  var form_data = new FormData();
  form_data.append('priority',form.value.priority);
  form_data.append('ticket_type',form.value.ticket_type);
  form_data.append('title',form.value.title);
  form_data.append('description', form.value.description);
  form_data.append('merchant_id',form.value.merchant_id);
  form_data.append('reporting_platform',form.value.reporting_platform);
  form_data.append('reporting_date',form.value.reporting_date);
  form_data.append('user_name',form.value.user_name);
  form_data.append('email',form.value.email);
  form_data.append('attachment',form.value.attachment);
  var submit_url = (slack != '' && slack != undefined) ? '/api/support_ticket/update' : '/api/support_ticket/save' ;
 
  await axios.post(submit_url, form_data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  }).then( (response) => {

    if(response.data.status_code == 200) {

      toast.success(response.data.msg);
      form.value.is_submitting = false;

      router.push('/support_tickets');

    }else{
      try{
        server_messages.type = "error";
        server_messages.messages = JSON.parse(response.data.msg);
      }catch(err){
        server_messages.type = "error";
        server_messages.messages = response.data.msg;
      }
      form.value.is_submitting = false;
    }

  }).catch((error) => {
    server_messages.type = "error";
    server_messages.messages = error;
    form.value.is_submitting = false;
  });

}

</script>