<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" :to="back_link"
              ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Users") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">
              {{ $t("Add User") }}
            </h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <Form
          :validation-schema="schema"
          @submit="saveUser"
          enctype="multipart/form-data"
          :initial-values="form"
      >
        <div class="row card-strash">
          <div class="py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage :server_messages="form.server_messages" />
          </div>

          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12 mb-4">
                <div class="card">
                  <div class="row">
                    <div class="col-md-3">
                      <VTextInput
                          type="text"
                          name="name"
                          v-model="form.name"
                          :label="labels.name"
                          :required="true"
                      />
                    </div>

                    <div class="col-md-3">
                      <VTextInput
                          type="email"
                          name="email"
                          v-model="form.email"
                          :label="labels.email"
                          :required="true"
                      />
                    </div>

                    <div class="col-md-3">
                      <VCodeGenerateTextInput
                          :type="form.passwordType"
                          name="password"
                          v-model="form.password"
                          :label="labels.password"
                          :required="true"
                          @generate_code="generatePassword"
                          @show_password_text="showPasswordSettings"
                          :is_show_password="true"
                          :showPassword="form.switchPasswordIcon"

                      />
                    </div>
                    <div class="col-md-3">
                      <VSelect
                          name="role"
                          :label="labels.role"
                          v-model="form.role"
                          :placeholder="labels.select_role"
                          :options="roles"
                          required
                      />
                    </div>
                    <div class="col-md-3">
                      <VSelect
                          name="status"
                          :label="labels.status"
                          v-model="form.status"
                          :placeholder="labels.select_status"
                          :options="status_data"
                          required
                          :disabled="user.user_type==2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="card">
                  <div class="row">
                    <div class="col-md-3">
                      <VCodeGenerateTextInput
                          type="text"
                          name="login_code"
                          v-model="form.login_code"
                          :label="labels.login_code"
                          @generate_code="generateLoginCode"
                          :readonly="true"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                          type="text"
                          name="phone"
                          v-model="form.phone"
                          :label="labels.phone"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                          type="date"
                          name="date_of_birth"
                          v-model="form.date_of_birth"
                          :label="labels.date_of_birth"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                          type="date"
                          name="date_of_anniversary"
                          v-model="form.date_of_anniversary"
                          :label="labels.date_of_anniversary"
                      />
                    </div>
                    <div class="col-md-3">
                      <VTextInput
                          type="date"
                          name="joining_date"
                          v-model="form.joining_date"
                          :label="labels.joining_date"
                      />
                    </div>
                    <div class="col-md-3">
                      <label class="label">{{
                          $t("Upload Profile Pic")
                        }}</label>
                      <div class="input-group input-file-group">
                        <input
                            class="form-control form-control-solid"
                            name="image"
                            type="file"
                            id="formFile"
                            accept="image/jpg, image/jpeg, image/png"
                            @change="selectFile"
                        />
                        <label
                            class="btn btn-light-primary min-width-0 mb-0"
                            for="formFile"
                        >{{ $t("Upload") }}</label
                        >
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
            <clip-loader
                v-if="form.is_submitting"
                :color="'white'"
                :size="'20px'"
                class="pt-2 pe-2"
            ></clip-loader>
            <span class="pt-0" v-if="form.is_submitting">{{
                $t("Saving...")
              }}</span>
            <span class="pt-0" v-else>{{ $t("Save") }}</span>
          </button>
        </div>
      </Form>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrmAddonStore } from '@/stores/crmAddonStore';
import * as yup from "yup";

const crmAddonStore = useCrmAddonStore();

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;

const back_link = ref("/merchant/"+slack);

const labels = ref({
  name: t("Name"),
  email: t("Email"),
  password: t("Password"),
  phone: t("Phone"),
  role: t("Role"),
  select_role: t("Select Role"),
  status: t("Status"),
  select_status: t("Select Status"),
  date_of_birth: t("Date Of Birth"),
  date_of_anniversary: t("Date Of Anniversary"),
  joining_date: t("Date Of Joining"),
  login_code: t("Login Code"),
});
const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,

  // form data
  name: "",
  email: "",
  password: "",
  role: "",
  status: "",
  login_code: "",
  phone: "",
  date_of_birth: "",
  date_of_anniversary: "",
  joining_date: "",
  image: "",
  user_slack: "",
  password_dummy: "123456789",
  passwordType: "password",
  switchPasswordIcon: true,
};

const form = reactive({ ...initialState });

let schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("Name") }))
    .min(
      3,
      t("name must be at least n characters", { name: t("Name"), number: 3 })
    ),
  email: yup
    .string()
    .required(t("name is required", { name: t("Email") }))
    .email(t("must be a valid email", { name: t("Email") })),
  password: yup
    .string()
    .required(t("name is required", { name: t("Password") }))
    .min(
      8,
      t("name must be at least n characters", {
        name: t("Password"),
        number: 8,
      })
    ),
  role: yup.string().required(t("name is required", { name: t("Role") })),
  status: yup.string().required(t("name is required", { name: t("Status") })),
  phone: yup.string().matches(/^(?:[0-9]{9,10})?$/, t('Mobile number must be number and should be 9 or 10 digits')),
});

const roles = ref([]);
const status_data = [
  {
    key: "0",
    value: t("Inactive"),
  },
  {
    key: "1",
    value: t("Active"),
  },
  {
    key: "2",
    value: t("Hold"),
  },
  {
    key: "3",
    value: t("Left"),
  },
];
const user = ref([]);

onMounted(() => {
  getRoles();
});

async function getRoles() {
  let role_data = await axios.get("api/roles/merchant_roles/"+ slack);
  role_data = role_data.data.data;
  _.forEach(role_data, (item) => {
    let template = {
      key: item.slack,
      value: item.name,
    };
    roles.value.push(template);
  });
}

function generatePassword() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$*";
  let charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  form.password = result;
}

async function generateLoginCode() {
  let login_code = await axios.get("api/user/generate_merchant_login_code/"+ slack);
  form.login_code = login_code.data.data.login_code;
}

async function selectFile(e) {
  form.image = e.target.files[0];
}

async function saveUser() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("name", form.name);
  form_data.append("email", form.email);
  form_data.append("password", form.password);
  form_data.append("role", form.role);
  form_data.append("status", form.status);
  form_data.append("login_code", form.login_code);
  form_data.append("phone", form.phone);
  form_data.append("date_of_birth", form.date_of_birth);
  form_data.append("date_of_anniversary", form.date_of_anniversary);
  form_data.append("joining_date", form.joining_date);
  form_data.append("image", form.image);
  form_data.append("merchant_slack", slack);
  var submit_url ="/api/user/save_merchant_user";

  await axios
    .post(submit_url, form_data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;

        router.push("/merchant/"+slack);
      } else {
        try {
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          form.server_messages.type = "error";
          form.server_messages.messages = response.data.msg;
        }
        form.is_submitting = false;
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      form.is_submitting = false;
      console.log(error);
    });
}

function resetData() {
  Object.assign(form, initialState);
}

function showPasswordSettings(){
  if(form.switchPasswordIcon == true){
    form.switchPasswordIcon = false;
    form.passwordType = 'text';
  }else{
    form.switchPasswordIcon = true;
    form.passwordType = 'password';
  }
}

</script>
