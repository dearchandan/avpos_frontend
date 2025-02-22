<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/admin/users"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Sub Admins") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == '' || slack == undefined">
              {{ $t("Add Sub Admin") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Sub Admin") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content" v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)">
      <Form
        :validation-schema="schema"
        :initial-values="form"
        @submit="saveUser"
        enctype="multipart/form-data"
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
                      <div class="form-field">
                        <label class="form-label">{{ $t("Country") }} </label>
                        <select
                          class="form-control form-control-sm form-control-solid"
                          name="country"
                          v-model="form.country"
                        >
                          <option
                            v-for="(country, index) in countries"
                            :value="country.slack"
                            :key="index"
                          >
                            {{ country.name }}
                          </option>
                        </select>
                      </div>
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
                        type="password"
                        name="password"
                        v-model="form.password"
                        :label="labels.password"
                        :required="true"
                        @generate_code="generatePassword"
                        v-if="slack == undefined || slack == ''"
                      />
                      <VTextInput
                        type="password"
                        name="password_dummy"
                        v-model="form.password_dummy"
                        :label="
                          t('Password') +
                          ' (' +
                          t('Can be updated from Reset Password') +
                          ')'
                        "
                        :readonly="true"
                        disabled
                        v-else
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
                  </div>
                </div>
              </div>
              <div class="col-md-12 mb-4">
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
                        type="number"
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
            >
            </clip-loader>
            <span class="pt-0" v-if="form.is_submitting">
              {{ $t("Saving...") }}
            </span>
            <span class="pt-0" v-else> {{ $t("Save") }} </span>
          </button>
        </div>
      </Form>
    </div>
    <EditFormSkeleton v-else />

  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { ref, reactive, onMounted } from "vue";
import { Form } from "vee-validate";
import * as yup from "yup";
import VTextInput from "@/components/common/VTextInput.vue";

import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import VSelect from "@/components/common/VSelect.vue";

import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const slack = route.params.slack;
const labels = ref({
  name: t("Name"),
  email: t("Email"),
  password: t("Password"),
  phone: t("Phone"),
  status: t("Status"),
  select_status: t("Select Status"),
  date_of_birth: t("Date Of Birth"),
  date_of_anniversary: t("Date Of Anniversary"),
  joining_date: t("Date Of Joining"),
  login_code: t("Login Code"),
  role: t("Role"),
  select_role: t("Select Role"),
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
  status: "",
  login_code: "",
  phone: "",
  date_of_birth: "",
  date_of_anniversary: "",
  joining_date: "",
  image: "",
  user_slack: "",
  password_dummy: "123456789",
  country: "",
  role: ""
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
    // phone: yup.string().nullable().matches(/^[0-9]{10}$/, t('Mobile number must be 10 digits')).typeError(t('must be a number',{ name: t('Mobile Number') })).nullable(true).min(10).max(10),
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
const countries = ref([]);
onMounted(() => {
  getCountries();
  getRoles();
  if (!_.isUndefined(slack)) getUser();
});
watch(() => {
  if (user.value) {
    schema = yup.object({
      name: yup
        .string()
        .required(t("name is required", { name: t("Name") }))
        .min(
          3,
          t("name must be at least n characters", {
            name: t("Name"),
            number: 3,
          })
        ),
      email: yup
        .string()
        .required(t("name is required", { name: t("Email") }))
        .email(t("must be a valid email", { name: t("Email") })),
      role: yup.string().required(t("name is required", { name: t("Role") })),
      // phone: yup.string().nullable().matches(/^[0-9]{10}$/, t('Mobile number must be 10 digits')).typeError(t('must be a number',{ name: t('Mobile Number') })).nullable(true).min(10).max(10),
    });
  }
});
async function getRoles() {
  let role_data = await axios.get("api/admin/roles/all");
  role_data = role_data.data.data;
  _.forEach(role_data, (item) => {
    let template = {
      key: item.slack,
      value: item.name,
    };
    roles.value.push(template);
  });
}
async function getCountries() {
  await axios
    .get("/api/countries/all")
    .then((response) => {
      if (response.data.status_code == 200) {
        countries.value = response.data.data;
      } else {
        try {
          form.server_messages.type = "error";
          form.server_messages.messages = JSON.parse(response.data.msg);
        } catch (err) {
          form.server_messages.type = "error";
          form.server_messages.messages = response.data.msg;
        }
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}
const is_loaded = ref(false);
async function getUser() {
  let response = await axios.get("/api/sub_admin", {
    params: {
      slack: slack,
    },
  });
  user.value = response.data.data;
  if (response.data.data) {
    form.user_slack = response.data.data.slack;
    form.name = response.data.data.name;
    form.email = response.data.data.email;
    form.role = response.data.data.role ? response.data.data.role.slack : "";
    form.status = response.data.data.status;
    form.login_code = response.data.data.login_code;
    form.date_of_anniversary = response.data.data.date_of_anniversary;
    form.date_of_birth = response.data.data.date_of_birth;
    form.phone = response.data.data.phone;
    form.joining_date = response.data.data.joining_date;
    form.password_dummy = "123456789";
    form.country = response.data.data.country_slack;
  }
  is_loaded.value = true;
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
  let login_code = await axios.post("api/user/generate_login_code");
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
  form_data.append("country", form.country);
  form_data.append("role", form.role);
  form_data.append("status", form.status);
  form_data.append("login_code", form.login_code);
  form_data.append("phone", form.phone);
  form_data.append("date_of_birth", form.date_of_birth);
  form_data.append("date_of_anniversary", form.date_of_anniversary);
  form_data.append("joining_date", form.joining_date);
  form_data.append("image", form.image);
  form_data.append("user_slack", form.user_slack);
  var submit_url =
    form.user_slack != "" && form.user_slack != undefined
      ? "/api/sub_admin/update"
      : "/api/sub_admin/save";

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

        router.push("/admin/users");
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
</script>
