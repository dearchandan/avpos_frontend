<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/roles"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Roles") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ role?.name }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content" v-if="is_loaded">
      <div class="page-heading">
        <div class="py-3" v-if="form.server_messages.messages != ''">
          <ServerMessage :server_messages="form.server_messages" />
        </div>
      </div>
      <Form @submit="savePermissions">
        <div class="row">
          <div class="col-lg-3 col-md-3" v-if="role?.name != null">
            <div class="card" data-select2-id="select2-data-14-jv1y">
              <div class="row">
                <div class="col-12 pb-3">
                  <span class="badge badge-success" v-if="role.status == 1">{{
                    $t("Active")
                  }}</span>
                  <span class="badge badge-danger" v-else>{{
                    $t("Inactive")
                  }}</span>
                </div>

                <!-- <div class="col-md-4 clearfix">
                            <div class="data-view-box mb-3">
                                <div class="item">
                                    <span>{{ $t('Role') }}:</span>
                                    <strong>{{ role.name }}</strong> 
                                </div>
                            </div>
                        </div> -->

                <div class="col-md-12 clearfix">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <span>{{ $t("Created At") }}</span>
                      <strong>{{ role.created_at_label }} </strong>
                    </div>
                    <div class="item">
                      <span>{{ $t("Updated At") }}</span>
                      <strong>{{ role.updated_at_label }}</strong>
                    </div>
                  </div>
                </div>

                <div
                  class="col-md-12 clearfix"
                  v-if="role.created_by != null || role.updated_by != null"
                >
                  <div class="data-view-box mb-3">
                    <div class="item" v-if="role.created_by">
                      <span>{{ $t("Created By") }}</span>
                      <strong>{{ role.created_by?.name }} </strong>
                    </div>
                    <div class="item" v-if="role.updated_by">
                      <span>{{ $t("Updated By") }}</span>
                      <strong>{{ role.updated_by?.name }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-9 col-md-9">
            <!-- <div class="row justify-content-between align-items-center mb-3">
                    <div class="col-auto">
                      <h3 class="m-0">{{ $t('Access Permissions') }}</h3>
                    </div>
                  </div> -->
            <div class="row">
              <div
                v-for="(menu, index) in menus"
                v-bind:key="index"
                class="card"
              >
                <div class="form-check mt-2 mb-2">
                  <label class="form-check-label mb-0">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="menu_selected"
                      v-bind:value="menu.menu_key"
                      v-bind:id="menu.menu_key"
                      @click="
                        menu_checker({
                          type: menu.type,
                          current: menu.menu_key,
                          parent: '',
                          grand_parent: '',
                          children: menu.childs,
                          siblings: menu.siblings,
                          event: $event,
                        })
                      "
                    />
                    <h5 class="text-primary text-uppercase">
                      {{ menu?.name }}
                    </h5>
                  </label>
                </div>
                <div class="table-responsive">
                  <table class="table">
                    <tbody>
                      <tr
                        v-for="(submenu_item, index) in menu.sub_menu"
                        v-bind:key="index"
                      >
                        <td class="td-head-data pt-0 pb-0 mb-0" width="40%">
                          <div class="form-check mb-0">
                            <label class="form-check-label mb-0">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="menu_selected"
                                v-bind:value="submenu_item.menu_key"
                                v-bind:id="submenu_item.menu_key"
                                @click="
                                  menu_checker({
                                    type: submenu_item.type,
                                    current: submenu_item.menu_key,
                                    parent: menu.menu_key,
                                    grand_parent: '',
                                    children: submenu_item.childs,
                                    siblings: submenu_item.siblings,
                                    event: $event,
                                  })
                                "
                              />
                              <span class="fw-bold text-dark">{{
                                submenu_item?.name
                              }}</span>
                            </label>
                          </div>
                        </td>
                        <td width="60%" class="">
                          <div class="userrole_sub_table" v-if="submenu_item.actions">
                            <div class="row g-3">
                                <div class="col-6 col-md-4"
                                  v-for="(
                                    action_item, index
                                  ) in submenu_item.actions"
                                  v-bind:key="index"
                                >
                                  <div class="form-check mb-0">
                                    <label class="form-check-label mb-0">
                                      <input
                                        class="form-check-input"
                                        type="checkbox"
                                        v-model="menu_selected"
                                        v-bind:value="action_item.menu_key"
                                        v-bind:id="action_item.menu_key"
                                        @click="
                                          menu_checker({
                                            type: action_item.type,
                                            current: action_item.menu_key,
                                            parent: submenu_item.menu_key,
                                            grand_parent: menu.menu_key,
                                            children: '',
                                            siblings: action_item.siblings,
                                            event: $event,
                                          })
                                        "
                                      />
                                      {{ action_item?.name }}
                                    </label>
                                  </div>
                                </div>
                                <div class="col-6 col-md-4"
                                  v-if="
                                    Object(submenu_item.actions).length == 2
                                  "
                                ></div>
                              </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
            <span class="pt-0" v-if="form.is_submitting">{{
              $t("Saving...")
            }}</span>
            <span class="pt-0" v-else>{{ $t("Save") }}</span>
          </button>
        </div>
      </Form>
    </div>

    <RoleSkeleton v-else />

  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { ref, reactive, onMounted } from "vue";
import { Form } from "vee-validate";
import * as yup from "yup";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import VTextInput from "@/components/common/VTextInput.vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const slack = route.params.slack;
const is_loaded = ref(false);
const role = ref([]);
const menus = ref([]);
const menu_selected = ref([]);

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
};

const form = reactive({ ...initialState });

getRole();

async function getRole() {
 
  await axios
    .get("/api/role", {
      params: {
        slack: slack,
      },
    })
    .then((response) => {
      role.value = response.data.data.role;
      menus.value = response.data.data.access_menus;
      menu_selected.value = response.data.data.role.role_menus;
      is_loaded.value = true;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      is_loaded.value = true;
      console.log(error);
    });
}

function array_remove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

function menu_checker(payload) {
  if (payload.event.target.checked == true) {
    if (payload.type == "ACTIONS") {
      menu_selected.value.push(payload.current);
      menu_selected.value.push(payload.parent);
      menu_selected.value.push(payload.grand_parent);
    }
    if (payload.type == "SUB_MENU") {
      menu_selected.value.push(payload.current);
      menu_selected.value.push(payload.parent);
      menu_selected.value = menu_selected.value.concat(payload.children);
    }
    if (payload.type == "MAIN_MENU") {
      menu_selected.value.push(payload.current);
      menu_selected.value = menu_selected.value.concat(payload.children);
    }
  } else {
    if (payload.type == "ACTIONS") {
      menu_selected.value = array_remove(
        menu_selected.value,
        payload.current
      );

      var sibling_count = 0;
      for (var i = 0; i < payload.siblings.length; i++) {
        if (menu_selected.value.includes(payload.siblings[i])) {
          sibling_count++;
        }
      }
      if (sibling_count == 0) {
        menu_selected.value = array_remove(
          menu_selected.value,
          payload.parent
        );
      }
      var grand_parent_key = '_'+payload.grand_parent
      if (typeof menus.value[grand_parent_key] != "undefined") {
        var children_selected_check_count = 0;
        var children = menus.value[grand_parent_key]["childs"];
        for (var i = 0; i < children.length; i++) {
          if (menu_selected.value.includes(children[i])) {
            children_selected_check_count++;
          }
        }
        if (children_selected_check_count == 0) {
          menu_selected.value = array_remove(
            menu_selected.value,
            payload?.grand_parent
          );
        }
      }
    }
    if (payload.type == "SUB_MENU") {
      menu_selected.value = array_remove(
        menu_selected.value,
        payload.current
      );
      for (var i = 0; i < payload.children.length; i++) {
        menu_selected.value = array_remove(
          menu_selected.value,
          payload.children[i]
        );
      }
      var sibling_count = 0;
      for (var i = 0; i < payload.siblings.length; i++) {
        if (menu_selected.value.includes(payload.siblings[i])) {
          sibling_count++;
        }
      }
      if (sibling_count == 0) {
        menu_selected.value = array_remove(
          menu_selected.value,
          payload.parent
        );
      }
    }
    if (payload.type == "MAIN_MENU") {
      menu_selected.value = array_remove(
        menu_selected.value,
        payload.current
      );
      for (var i = 0; i < payload.children.length; i++) {
        menu_selected.value = array_remove(
          menu_selected.value,
          payload.children[i]
        );
      }
    }
  }
}

async function savePermissions() {
  form.is_submitting = true;

  var form_data = new FormData();
  form_data.append("role_slack", slack);
  form_data.append("role_menus", menu_selected.value);

  await axios
    .post("/api/role/update_permission", form_data)
    .then((response) => {
      if (response.data.status_code == 200) {
        toast.success(response.data.msg);
        form.is_submitting = false;

        authStore.refresh();

        router.push("/roles");
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
</script>
