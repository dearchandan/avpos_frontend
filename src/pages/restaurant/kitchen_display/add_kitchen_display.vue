<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/kitchen_displays">
                <Icon icon="fa6-solid:chevron-left" />
                {{ $t("KDSs") }}
              </router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == '' || slack == undefined">
              {{ $t("Add KDS") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit KDS") }}</h5>
          </div>
        </div>
      </div>
    </template>
    <div
      class="content"
      v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)"
    >
      <Form
        :validation-schema="schema"
        @submit="saveKitchenDisplay"
        enctype="multipart/form-data"
        :initial-values="form"
      >
        <div class="row card-strash">
          <div class="py-3" v-if="form.server_messages.messages != ''">
            <ServerMessage :server_messages="form.server_messages" />
          </div>
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12 ">
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
                        type="text"
                        name="activation_code"
                        v-model="form.activation_code"
                        :label="labels.activation_code"
                        :required="true"
                        :aria-disabled="true"
                        :readonly="true"
                      />
                    </div>
                    <div class="col-md-3 pt-md-2">
                      <div class="form-field pt-md-2">
                        <div class="form-check form-switch pt-md-4">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            id="status"
                            checked
                            v-model="form.status"
                          />
                          <label class="form-check-label" for="status">{{
                            $t("Active")
                          }}</label>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-field">
                        <label>{{ $t("Category Selection") }}</label>
                        <div class="row">
                          <div
                            class="col-auto"
                            v-for="(category, index) in categories"
                            v-bind:key="index"
                          >
                            <div class=" pt-2">
                              <ul class="chekbox-group-list">
                                <li>
                                  <div class="form-check">
                                    <label class="form-check-label mb-0">
                                      <input
                                        class="form-check-input"
                                        type="checkbox"
                                        v-model="category_selected"
                                        v-bind:value="category.category_key"
                                        v-bind:id="category.category_key"
                                        @click="
                                          category_checker({
                                            type: category.type,
                                            current: category.category_key,
                                            parent: '',
                                            grand_parent: '',
                                            children: category.childs,
                                            siblings: category.siblings,
                                            event: $event,
                                          })
                                        "
                                        :checked="
                                          category_selected.includes(category.id)
                                        "
                                      />
                                      {{ category.name }}
                                    </label>
                                  </div>
                                  <ul>
                                    <li
                                      v-for="(
                                        subcategory_item, index
                                      ) in category.sub_category"
                                      v-bind:key="index"
                                    >
                                      <div class="form-check">
                                        <label class="form-check-label mb-0">
                                          <input
                                            class="form-check-input"
                                            type="checkbox"
                                            v-model="category_selected"
                                            v-bind:value="
                                              subcategory_item.category_key
                                            "
                                            v-bind:id="
                                              subcategory_item.category_key
                                            "
                                            @click="
                                              category_checker({
                                                type: subcategory_item.type,
                                                current:
                                                  subcategory_item.category_key,
                                                parent: category.category_key,
                                                grand_parent: '',
                                                children: subcategory_item.childs,
                                                siblings:
                                                  subcategory_item.siblings,
                                                event: $event,
                                              })
                                            "
                                          />
                                          {{ subcategory_item.name }}
                                        </label>
                                      </div>
                                    </li>
                                  </ul>
                                </li>
                              </ul>
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
            :disabled="form.is_submitting || categories.length <= 0"
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
    <EditFormSmallSkeleton v-else />
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
import { useCashierStore } from "@/stores/cashierStore";
const cashierStore = useCashierStore();

import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const slack = route.params.slack;
const labels = ref({
  name: t("KDS Name"),
  activation_code: t("Activation Code"),
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  is_submitting: false,
  // form data
  name: "",
  activation_code: "",
  status: true,
  kds_slack: "",
};

const form = reactive({ ...initialState });

const schema = yup.object({
  name: yup
    .string()
    .required(t("name is required", { name: t("KDS Name") }))
    .min(
      3,
      t("name must be at least n characters", {
        name: t("CDS Name"),
        number: 3,
      })
    ),
});

const categories = ref([]);
const category_selected = ref([]);
const kitchen_display = ref([]);

onMounted(() => {
  getKitchenDispalyAddData();
  if (slack != "" && slack != undefined) getKitchenDisplay();
});

const is_loaded = ref(false);
async function getKitchenDispalyAddData() {
  let url =
    slack != "" && slack != undefined
      ? "api/kitchen_display/add/" + slack
      : "api/kitchen_display/add";
  let add_data = await axios.get(url);
  form.activation_code = add_data.data.data.activation_code;
  categories.value = add_data.data.data.access_categories;
  is_loaded.value = true;
}

function array_remove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

function category_checker(payload) {
  if (payload.event.target.checked == true) {
    if (payload.type > 0) {
      category_selected.value.push(payload.current);
      /*category_selected.value.push(payload.parent);*/

      var sibling_count = 0;
      for (var i = 0; i < payload.siblings.length; i++) {
        if (category_selected.value.includes(payload.siblings[i])) {
          sibling_count++;
        }
      }
      if (payload.siblings.length == sibling_count) {
        category_selected.value.push(payload.parent);
      }
      if (typeof payload.children != "undefined") {
        category_selected.value = category_selected.value.concat(
          payload.children
        );
      }
    } else {
      category_selected.value.push(payload.current);
      category_selected.value = category_selected.value.concat(
        payload.children
      );
    }
  } else {
    if (payload.type > 0) {
      category_selected.value = this.array_remove(
        category_selected.value,
        payload.current
      );

      var sibling_count = 0;
      for (var i = 0; i < payload.siblings.length; i++) {
        if (category_selected.value.includes(payload.siblings[i])) {
          sibling_count++;
        }
      }
      /*if (sibling_count == 0) {
        category_selected.value = this.array_remove(
            category_selected.value,
            payload.parent
        );
      }*/

      category_selected.value = this.array_remove(
        category_selected.value,
        payload.parent
      );

      if (typeof this.categories[payload.parent] != "undefined") {
        var children_selected_check_count = 0;
        var children = this.categories[payload.parent]["childs"];
        for (var i = 0; i < children.length; i++) {
          if (category_selected.value.includes(children[i])) {
            children_selected_check_count++;
          }
        }
        if (children_selected_check_count == 0) {
          category_selected.value = this.array_remove(
            category_selected.value,
            payload.parent
          );
        }
      }
    } else {
      category_selected.value = this.array_remove(
        category_selected.value,
        payload.current
      );
      for (var i = 0; i < payload.children.length; i++) {
        category_selected.value = this.array_remove(
          category_selected.value,
          payload.children[i]
        );
      }
    }
  }
}

async function saveKitchenDisplay() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("name", form.name);
  form_data.append("activation_code", form.activation_code);
  form_data.append("status", form.status);
  form_data.append("categories", category_selected.value);
  form_data.append("kds_slack", form.kds_slack);
  var submit_url =
    form.kds_slack != "" && form.kds_slack != undefined
      ? "/api/kitchen_display/update"
      : "/api/kitchen_display/save";

  await axios
    .post(submit_url, form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;
        cashierStore.refreshTerminals();
        // resetData();
        router.push("/kitchen_displays");
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

async function getKitchenDisplay() {
  await axios
    .get("/api/kitchen_display", {
      params: {
        slack: slack,
      },
    })
    .then((response) => {
      kitchen_display.value = response.data.data.kitchen_display;
      if (response.data.data.kitchen_display) {
        form.kds_slack = response.data.data.kitchen_display.slack;
        form.name = response.data.data.kitchen_display.name;
        form.activation_code =
          response.data.data.kitchen_display.activation_code;
        if (response.data.data.kitchen_display.categories) {
          _.forEach(response.data.data.kitchen_display.categories, (item) => {
            category_selected.value.push(item.category.id);
          });
        }
      }
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      console.log(error);
    });
}
</script>
