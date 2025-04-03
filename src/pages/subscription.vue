<template>
  <DefaultLayout>
    <!--  <template v-slot:subheader>
            <InventoryMenu /> -->
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/subscriptions">
                <Icon icon="fa6-solid:chevron-left" />
                {{ $t("Subscriptions") }}
              </router-link>
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold" v-if="slack == '' || slack == undefined">
              {{ $t("Add Subscription") }}
            </h5>
            <h5 class="fw-bold" v-else>{{ $t("Edit Subscription") }}</h5>
          </div>
        </div>
      </div>
    </template>
    <div class="content">
      <div class="row">
        <div class="col-lg-6">
          <div class="card">
            <h5 class="pb-3 text-muted">{{ $t("Basic Details") }}:</h5>
            <div class="row">
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label"
                    >{{ $t("Subscription Name") }} <em>*</em></label
                  >
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label"
                    >{{ $t("Subscription Name") }} ({{ $t("Arabic") }})
                    <em>*</em></label
                  >
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label"
                    >{{ $t("Device Type") }} <em>*</em></label
                  >
                  <select class="form-select form-select-solid">
                    <option>{{ $t("All") }}</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label"
                    >{{ $t("Subscription For") }} <em>*</em></label
                  >
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label"
                    >{{ $t("Select Country") }} <em>*</em></label
                  >
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-field">
                  <label class="label">{{ $t("Price Type") }} <em>*</em></label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-field">
                  <label class="label">{{ $t("Price") }} <em>*</em></label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-field">
                  <label class="label">{{ $t("Tax Name") }} <em>*</em></label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-field">
                  <label class="label">{{ $t("Tax") }}(%) <em>*</em></label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label">{{ $t("Discount Name") }}</label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label">{{ $t("Discount Type") }}</label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label">{{ $t("Discount") }}</label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-field">
                  <label class="label"
                    >{{ $t("Payable Amount") }} <em>*</em></label
                  >
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
              <div class="col-md-6 mt-auto mb-3">
                <div class="form-field">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input me-2"
                      type="checkbox"
                      role="switch"
                      id="status"
                      name="status"
                      value="true"
                      checked
                    />
                    <label class="form-check-label" for="status"
                      >{{ $t("Active") }} <em>*</em></label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="row card-strash">
            <div class="col-md-6">
              <div class="card">
                <h5 class="pb-3 text-muted">{{ $t("Addons") }}</h5>
                <div class="form-field">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Addons1"
                      name="status"
                      value="true"
                      checked
                    />
                    <label class="form-check-label" for="Addons1"
                      >AvPOS Pay</label
                    >
                  </div>
                </div>
                <div class="form-field">
                  <label class="label">User Limit</label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
                <div class="form-field">
                  <label class="label">Branch Limit</label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
                <div class="form-field">
                  <label class="label">Product Limit</label>
                  <input
                    class="form-control form-control-solid"
                    type="text"
                    name=""
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card">
                <h5 class="pb-3 text-muted">Opional Details</h5>
                <div class="form-field">
                  <label class="label">Description</label>
                  <textarea class="form-control form-control-solid"></textarea>
                </div>
                <div class="form-field">
                  <label class="label">Description(Arabic)</label>
                  <textarea class="form-control form-control-solid"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <h5 class="pb-3 text-muted">Features</h5>
            <div class="row">
              <div class="col-auto">
                <div class="form-field">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Features1"
                      name="status"
                      value="true"
                      checked
                    />
                    <label class="form-check-label" for="Features1"
                      >Inventory</label
                    >
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-field">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Features2"
                      name="status"
                      value="true"
                    />
                    <label class="form-check-label" for="Features2"
                      >Sales</label
                    >
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-field">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Features3"
                      name="status"
                      value="true"
                    />
                    <label class="form-check-label" for="Features3"
                      >Business</label
                    >
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-field">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Features4"
                      name="status"
                      value="true"
                    />
                    <label class="form-check-label" for="Features4"
                      >Manage</label
                    >
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-field">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Features5"
                      name="status"
                      value="true"
                    />
                    <label class="form-check-label" for="Features5"
                      >Restaurant</label
                    >
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-field">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Features6"
                      name="status"
                      value="true"
                    />
                    <label class="form-check-label" for="Features6"
                      >Reports</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  </template> -->
  </DefaultLayout>
</template>
<script setup>
import { Form, Field } from "vee-validate";

import * as yup from "yup";
import { useAuthStore } from "@/stores/auth";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useRoute } from "vue-router";
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const server_messages = reactive({
  type: "",
  messages: "",
});
</script>
