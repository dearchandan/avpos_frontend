<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" :to="back_link"
                           ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Subscriptions") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ subscription.name }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content">
      <Form
          :validation-schema="schema"
          @submit="renewAddon"
          enctype="multipart/form-data"
          :initial-values="form"
      >

      <div class="row" v-if="subscription!=null">
        <div :class="'col-md-12'">
          <div class="card">
            <div v-if="subscription == ''">
              <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-md-4">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Merchant Name') }}:</b>
                      {{ subscription.user.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Subscription Period') }}:</b>
                      {{ subscription.start_date_label }} - {{ subscription.end_date_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Days Left') }}:</b>
                      <span v-if="subscription.status == 1">{{ subscription.days_left }}  {{ $t('Days') }}</span>
                      <span v-else>-</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Amount') }}:</b>
                      <span v-if="subscription.subscription.is_trial" class="fw-bold text-primary">{{ $t('Free Trial') }}</span>
                      <span v-else>{{ subscription.payable_amount }} {{ $t('SAR') }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Payment Mode') }}:</b>
                      {{ subscription.payment_mode!=null?subscription.payment_mode.name:'-'}}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Payment Status') }}:</b>
                      <span class="badge badge-success" v-if="subscription.payment_status == 1">{{ $t('Paid') }}</span>
                      <span class="badge badge-danger" v-else>{{ $t('Unpaid') }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Running Status') }}:</b>
                      <span
                          v-if="subscription.running_status == 'Awaiting'"
                          class="badge badge-warning"
                      >
                      {{ subscription.running_status }}
                    </span>
                      <span
                          v-if="subscription.running_status == 'Running'"
                          class="badge badge-success"
                      >
                      {{ subscription.running_status }}
                    </span>
                      <span
                          v-if="subscription.running_status == 'Expired'"
                          class="badge badge-danger"
                      >
                      {{ subscription.running_status }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Purchased At') }}:</b>
                      {{ subscription.created_at_label }}
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="data-view-box mb-3">
                    <div class="item">
                      <b>{{ $t('Note') }}:</b>
                      {{ subscription.note!=null?subscription.note:'-'}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row" v-if="is_addon_show">
            <div class="col-md-12 col-lg-8">
              <div class="NewSubboxWpr">
                <div class="row g-3 g-md-4">
                  <div class="col-md-6 col-lg-4" v-for="(addon_master, index) in addon_masters">
                    <div class="box">
<!--                      <div class="planactive_label badge badge-success" v-if="(subscription.user_addons.find( (value) => value.addon_master_id == addon_master.id) && addon_master.value_type==2 && addon_master.type==2) ">Active</div>-->
                      <h5>{{addon_master.name}}</h5>
                      <div v-if="addon_master.type==1 || addon_master.value_type==1">
                        <div class="row align-items-center justify-content-between">
                          <div class="col-auto">
                            <h2 class="price">{{ addon_master.price }} SAR <span v-if="addon_master.type==1">/ Monthly</span><span v-else>/ Annually</span></h2>
                          </div>
                          <div class="col-6">
                            <div class="form-field mb-0" v-if="addon_master.value_type==1">
                              <label>Enter limit </label>
                              <input class="form-control form-control-solid form-control-sm" v-model="addon_master.quantity">
                            </div>
                            <div class="form-field mb-0" v-if="addon_master.value_type==2 && monthly_remain_months>0">
                              <label>Select Months</label>
                              <select class="form-control form-control-solid form-control-sm" v-model="addon_master.quantity">
                                <option v-for="index in monthly_max_month" :value="index">{{ index }}</option>
                                <option value="13">Till Subscription End Date ({{ subscription.end_date_label }})</option>
                              </select>
                            </div>

                          </div>
                        </div>
                      </div>
                      <h2 class="price" v-if="addon_master.type==2 && addon_master.value_type==2">{{ addon_master.price }} SAR <span v-if="addon_master.type==1">/ Monthly</span><span v-else>/ Annually</span></h2>
                      <hr>
                      <p>{{ addon_master.description}}</p>

                      <div class="mt-auto" v-if="subscription.user_addons.find( (value) => value.addon_master_id == addon_master.id ) && (addon_master.value_type==2 && addon_master.type==2)">
                        <a href="javascript:;" class="btn btn-success w-100 btn-rounded disabled">Active</a>
                      </div>
                      <div class="mt-auto" v-else-if="(crmAddonStore.cart.find( (value) => value.addon_id == addon_master.id ) && addon_master.type==2 && addon_master.value_type==2)">
                        <a href="javascript:;" class="btn btn-outline-primary w-100 btn-rounded disabled">Added</a>
                      </div>
                      <div class="mt-auto" v-else-if="addon_master.type==1 && monthly_max_month==0">
                        <a href="javascript:;" class="btn btn-success w-100 btn-rounded disabled">Active</a>
                      </div>
                      <div class="mt-auto" v-else>
                        <a href="javascript:;" class="btn btn-primary w-100 btn-rounded" @click="addToCart(addon_master)">Add To Cart<svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.5303 6.41705C16.8232 6.12416 16.8232 5.64928 16.5303 5.35639L11.7574 0.583418C11.4645 0.290525 10.9896 0.290525 10.6967 0.583418C10.4038 0.876311 10.4038 1.35118 10.6967 1.64408L14.9393 5.88672L10.6967 10.1294C10.4038 10.4223 10.4038 10.8971 10.6967 11.19C10.9896 11.4829 11.4645 11.4829 11.7574 11.19L16.5303 6.41705ZM0 6.63672H16V5.13672H0V6.63672Z" fill="currentColor"></path>
                        </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12 col-lg-4 mt-3 mt-lg-0">

              <div class="NewSubbox_cart">

                <div class="empty_NewSubbox_cart" v-if="crmAddonStore.cart.length==0">
                  <div class="icon">
                    <svg width="269" height="269" viewBox="0 0 269 269" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="269" height="269" rx="134.5" fill="#FCF5FF"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M88.8613 151.596L71.918 88.3247H158.525C158.525 88.3591 158.525 88.3591 158.525 88.3934C158.525 88.5996 158.559 88.7715 158.559 88.9433C158.559 89.0808 158.594 89.2526 158.594 89.4245C158.594 89.5276 158.594 89.665 158.628 89.8025C158.628 89.94 158.662 90.0775 158.662 90.2149C158.697 90.3524 158.697 90.5242 158.731 90.6617C158.765 90.8679 158.8 91.0398 158.834 91.246C158.868 91.4522 158.903 91.624 158.937 91.7959C158.937 91.7959 158.937 91.8302 158.937 91.8646C158.972 92.0364 159.006 92.2083 159.04 92.3801C159.109 92.5863 159.143 92.7581 159.178 92.93C159.178 92.9644 159.178 92.9644 159.178 92.9987C159.212 93.1706 159.281 93.3424 159.315 93.5142C159.418 93.9267 159.521 94.3047 159.659 94.6827C159.728 94.8546 159.762 94.9921 159.831 95.1639C159.934 95.5419 160.071 95.92 160.243 96.298C160.312 96.4355 160.381 96.6073 160.449 96.7448C160.518 96.9167 160.621 97.0885 160.69 97.2603C160.862 97.6384 161.034 97.9477 161.205 98.2914C161.309 98.4288 161.377 98.6007 161.48 98.7725C161.584 98.9444 161.652 99.0818 161.755 99.2537C161.927 99.563 162.133 99.9066 162.34 100.216C162.443 100.388 162.546 100.525 162.649 100.697C162.958 101.144 163.302 101.591 163.646 102.037C163.989 102.45 164.333 102.862 164.677 103.275C165.192 103.859 165.776 104.409 166.361 104.959C166.532 105.096 166.67 105.199 166.807 105.337C167.495 105.921 168.182 106.471 168.938 106.986C169.11 107.09 169.248 107.193 169.419 107.296C169.591 107.399 169.729 107.502 169.901 107.605C170.038 107.674 170.21 107.777 170.382 107.88C170.519 107.983 170.691 108.052 170.863 108.155C171.035 108.258 171.207 108.361 171.378 108.43C171.516 108.533 171.653 108.602 171.825 108.67C171.859 108.705 171.894 108.705 171.928 108.739C172.031 108.808 172.134 108.842 172.272 108.911C172.512 109.048 172.753 109.152 172.994 109.255C173.097 109.323 173.234 109.392 173.372 109.427C173.509 109.495 173.647 109.53 173.818 109.598C174.059 109.667 174.3 109.77 174.506 109.839C174.678 109.908 174.815 109.976 174.987 110.011C175.159 110.08 175.365 110.148 175.537 110.183C175.743 110.251 175.949 110.286 176.155 110.354C176.293 110.423 176.43 110.458 176.602 110.492C176.843 110.561 177.049 110.629 177.29 110.664C177.461 110.698 177.599 110.733 177.771 110.767C178.011 110.836 178.252 110.87 178.458 110.904C178.63 110.939 178.767 110.939 178.939 110.973C179.145 111.007 179.317 111.007 179.524 111.042C179.97 111.111 180.383 111.145 180.829 111.179C181.001 111.179 181.139 111.214 181.311 111.214C181.723 111.248 182.101 111.248 182.514 111.248C182.72 111.248 182.96 111.248 183.166 111.248C183.338 111.248 183.476 111.214 183.648 111.214C183.682 111.214 183.751 111.214 183.785 111.214C183.957 111.214 184.163 111.214 184.335 111.179C184.747 111.179 185.16 111.111 185.538 111.076H185.572C185.71 111.042 185.882 111.042 186.019 111.007C186.088 111.007 186.191 110.973 186.26 110.973C186.397 110.973 186.535 110.939 186.706 110.904C186.741 110.87 186.775 110.87 186.809 110.87C187.153 110.801 187.497 110.733 187.841 110.664C187.875 110.629 187.909 110.629 187.944 110.629C188.115 110.561 188.253 110.526 188.425 110.492C188.459 110.492 188.494 110.458 188.528 110.458C188.665 110.458 188.768 110.423 188.872 110.389L182.445 145.719C181.929 148.571 180.211 151.63 176.912 151.63L88.8613 151.596ZM145.74 144.619C145.946 144.654 146.118 144.688 146.324 144.688C147.355 144.688 148.249 144.001 148.524 143.004L159.865 100.731C160.209 99.5286 159.487 98.2914 158.284 97.9821C157.047 97.6727 155.844 98.3945 155.5 99.5973L144.159 141.87C143.85 143.073 144.571 144.31 145.74 144.619ZM127.422 142.007C127.422 143.244 128.453 144.275 129.69 144.275C130.927 144.275 131.958 143.244 131.958 142.007V94.9921C131.958 93.7204 130.927 92.7238 129.69 92.7238C128.453 92.7238 127.422 93.7548 127.422 94.9921V142.007ZM98.6561 97.6384L110.822 143.038C111.097 144.069 112.025 144.722 113.022 144.722C113.228 144.722 113.4 144.688 113.606 144.654C114.809 144.31 115.496 143.073 115.187 141.87L103.021 96.4699C102.677 95.2326 101.44 94.5453 100.237 94.8546C99.0342 95.1983 98.3124 96.4355 98.6561 97.6384Z" fill="#313131"/>
                      <path d="M197.463 178.816H86.6611C80.4062 178.816 75.3198 173.729 75.3198 167.474C75.3198 161.219 80.4062 156.133 86.6611 156.133C86.7299 156.133 86.7986 156.133 86.8673 156.133C85.9394 156.064 85.1489 155.377 84.9084 154.483L84.1866 151.837C76.5914 153.04 70.7832 159.604 70.7832 167.509C70.7832 176.272 77.8973 183.387 86.6611 183.387H197.429C198.666 183.387 199.697 182.356 199.697 181.118C199.697 179.847 198.7 178.816 197.463 178.816Z" fill="#313131"/>
                      <path d="M62.7067 60.522H56.5205C56.5892 60.8657 56.6236 61.2093 56.6236 61.553V64.0275C56.6236 64.3712 56.5892 64.7148 56.5205 65.0585H60.9883L66.7965 86.7102C66.6246 86.0229 66.7621 85.3011 67.1745 84.7513C67.5869 84.2014 68.2743 83.8577 68.9616 83.8577H70.7144L64.9062 62.206C64.5969 61.2093 63.7034 60.522 62.7067 60.522Z" fill="#313131"/>
                      <path d="M50.8158 60.2808H38.2372C37.5843 60.2808 37 60.8306 37 61.518V63.9925C37 64.6798 37.5499 65.2297 38.2372 65.2297H50.8158C51.4688 65.2297 52.0531 64.6798 52.0531 63.9925V61.518C52.0531 60.865 51.5032 60.2808 50.8158 60.2808Z" fill="#313131"/>
                      <path d="M106.285 192.631C113.347 192.631 119.07 198.353 119.07 205.416C119.07 212.478 113.347 218.2 106.285 218.2C99.2222 218.2 93.5 212.478 93.5 205.416C93.5 198.353 99.2222 192.631 106.285 192.631Z" fill="#793693"/>
                      <path d="M166.12 192.631C173.182 192.631 178.905 198.353 178.905 205.416C178.905 212.478 173.182 218.2 166.12 218.2C159.057 218.2 153.335 212.478 153.335 205.416C153.335 198.353 159.057 192.631 166.12 192.631Z" fill="#793693"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M163.165 87.294C163.165 87.0878 163.165 86.8816 163.165 86.6753C163.165 86.4691 163.2 86.2973 163.2 86.1255V86.0567C163.818 75.9182 172.273 67.8418 182.583 67.8418C193.306 67.8418 202.001 76.5368 202.001 87.2596C202.001 95.1298 197.292 101.9 190.556 104.959C190.384 105.028 190.247 105.096 190.109 105.165C189.972 105.234 189.8 105.268 189.663 105.337C189.525 105.406 189.353 105.44 189.216 105.509C189.078 105.578 188.907 105.646 188.769 105.681C188.494 105.784 188.185 105.887 187.876 105.956C187.841 105.956 187.841 105.956 187.841 105.956C187.566 106.059 187.223 106.093 186.948 106.196C186.673 106.299 186.363 106.334 186.054 106.402C186.02 106.437 185.985 106.437 185.951 106.437C185.848 106.471 185.71 106.471 185.607 106.506C185.401 106.506 185.195 106.54 184.989 106.574C184.817 106.574 184.679 106.609 184.542 106.609C184.404 106.609 184.301 106.643 184.164 106.643C184.026 106.643 183.923 106.677 183.786 106.677C183.373 106.712 182.961 106.712 182.549 106.712C171.86 106.712 163.131 97.9824 163.165 87.294ZM179.352 87.294L171.654 94.9924C170.76 95.8859 170.76 97.295 171.654 98.1886C172.101 98.6353 172.685 98.8415 173.269 98.8415C173.819 98.8415 174.403 98.6353 174.85 98.1886L182.549 90.4902L190.247 98.1886C190.694 98.6353 191.278 98.8415 191.862 98.8415C192.412 98.8415 192.996 98.6353 193.443 98.1886C194.337 97.295 194.337 95.8859 193.443 94.9924L185.745 87.294L193.443 79.5956C194.337 78.702 194.337 77.2929 193.443 76.3994C192.55 75.5058 191.141 75.5058 190.247 76.3994L182.549 84.0978L174.85 76.3994C173.957 75.5058 172.548 75.5058 171.654 76.3994C170.76 77.2929 170.76 78.702 171.654 79.5956L179.352 87.294Z" fill="#793693"/>
                    </svg>
                  </div>

                  <h2> Cart is Empty!</h2>
                </div>

                <div class="newsub_mincart" v-if="crmAddonStore.cart.length>0">
                  <div class="item" v-for="(item, index) in crmAddonStore.cart">
                    <div class="row justify-content-between">
                      <div class="col-auto">
                        <h4>{{ item.addon_name }} x {{ item.quantity }}</h4>
<!--                        <h6><span>2 POS</span><span>2 POS</span><span>2 POS</span></h6>-->
                      </div>
                      <div class="col-auto">
                        <h3>{{ item.price }} SAR <small><span v-if="item.type==1">/ Monthly</span><span v-else>/ Annually</span></small></h3>
                      </div>
                    </div>
                    <div class="subitem_close">
                      <a href="javascript:;" class="btn btn-icon btn-xs btn-light-danger" @click="removeFromCart(index)">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M1 1L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="form-field">
                      <label class="label d-flex align-items-center">{{ $t("Payment Receipt") }}<span class="text-danger">*</span></label>
                      <div class="input-group input-file-group">
                        <Field
                            class="form-control form-control-solid"
                            name="payment_receipt"
                            type="file"
                            id="formFile"
                            accept="image/jpg, image/jpeg, image/png, application/pdf"
                            @change="selectFile"
                        />
                        <label
                            class="btn btn-light-primary min-width-0 mb-0"
                            for="formFile"
                        >{{ $t("Upload") }}</label>

                      </div>
                      <ErrorMessage name="payment_receipt" as="div" class="error"></ErrorMessage>
                    </div>
                  </div>
                  <div class="col-12">
                    <VSelectInput
                        name="coupon"
                        :label="labels.coupon"
                        v-model="form.coupon_id"
                        :placeholder="labels.coupon"
                        :options="coupons"
                        @change="applyCoupon"
                    />
                  </div>
                  <div class="col-lg-6">
                    <VSelectInput
                        name="payment_mode_id"
                        :label="labels.payment_mode"
                        v-model="form.payment_mode_id"
                        :placeholder="labels.payment_mode"
                        :options="payment_modes"
                        required
                    />
                  </div>
                  <div class="col-lg-6">
                    <VSelectInput
                        name="payment_status"
                        :label="labels.payment_status"
                        v-model="form.payment_status"
                        :placeholder="labels.payment_mode"
                        :options="payment_statuses"
                        required
                    />
                  </div>
                  <div class="col-md-12">
                    <div class="form-field">
                      <label>{{ $t("Note") }}</label>
                      <textarea
                          class="form-control form-control-solid p-3"
                          name="description"
                          v-model="form.note"
                          :label="labels.note"
                          cols="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="checkout-data-table" v-if="crmAddonStore.grandTotal.grand_addon_amount>0">
                  <table class="table p-0">
                    <tbody>
                    <tr>
                      <td>Subscription</td>
                      <td align="right">{{ crmAddonStore.grandTotal.grand_addon_price_without_tax }} SAR</td>
                    </tr>
                    <tr v-if="crmAddonStore.grandTotal.discount_amount>0">
                      <td class="text-success">- Discount</td>
                      <td align="right" class="text-success">{{ crmAddonStore.grandTotal.discount_amount }} SAR</td>
                    </tr>
                    <tr>
                      <td>Tax 15%</td>
                      <td align="right">{{ crmAddonStore.grandTotal.grand_addon_tax }} SAR</td>
                    </tr>
                    <tr>
                      <td>Amount</td>
                      <td align="right"><b>{{ crmAddonStore.grandTotal.grand_addon_amount }} SAR</b></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-auto">
                  <button
                      type="submit"
                      class="btn btn-primary w-100 btn-lg"
                      :disabled="form.is_saving || crmAddonStore.grandTotal.grand_addon_amount==0"
                  >
                    <clip-loader
                        v-if="form.is_saving"
                        :color="'white'"
                        :size="'20px'"
                        class="pt-2 pe-2"
                    >
                    </clip-loader>
                    <span class="pt-0" v-if="form.is_saving">{{ $t("Saving...") }}</span>
                    <span class="pt-0" v-else> {{ $t("Renew") }} </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
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

const general_stats = ref("");
const is_loading = ref(false);
const is_addon_show = ref(false);
const pending_month = ref(0);
const subscription = ref([]);


const back_link = ref("/merchant/");
const yearly_remain_months = ref(0);
const monthly_remain_months = ref(0);
const monthly_max_month = ref(0);


const labels = ref({
  coupon: t("Apply Coupon"),
  payment_mode: t("Select Payment Mode"),
  payment_status: t("Select Payment Status"),
  note: t("Note"),
});

const initialState = {
  server_messages: {
    type: "",
    messages: "",
  },
  coupon_id: "",
  payment_mode_id: "",
  payment_status: 0,
  note: "",
  payment_receipt:null
};

const form = reactive({ ...initialState });

const schema = yup.object({
  payment_mode_id: yup
      .string()
      .required(t("name is required", { name: t("Payment Mode") })),
  payment_receipt: yup
      .mixed()
      .required(t("name is required", { name: t("Payment Receipt") })),
});

onMounted(() => {
  getSubscriptionDetail();
  getMasterData();
});

async function getSubscriptionDetail() {
  is_loading.value = true;
  await axios
    .get("/api/v2/user/subscription", { params: { slack: slack } })
    .then((response) => {
      subscription.value = response.data.data.subscription;
      back_link.value = '/merchant/'+subscription.value.user.slack;

      is_addon_show.value = subscription.value.subscription.is_trial==1?false:subscription.value.status==1?true:false;
      yearly_remain_months.value = response.data.data.yearly_remain_months;
      monthly_remain_months.value = response.data.data.monthly_remain_months;
      monthly_max_month.value = response.data.data.monthly_max_month;
      is_loading.value = false;
    })
    .catch((error) => {
      form.server_messages.type = "error";
      form.server_messages.messages = error;
      is_loading.value = false;
      console.log(error);
    });
}

const payment_statuses = ref([]);
const addon_masters = ref([]);
const coupons = ref([]);
const payment_modes = ref([]);

async function getMasterData() {
  await axios
      .get("api/v2/subscription/renewal_details")
      .then((response) => {
        if (response.data.status_code == 200) {
          coupons.value = response.data.data.coupons;
          payment_modes.value = response.data.data.payment_modes;
          payment_statuses.value = response.data.data.payment_statuses;
          addon_masters.value = response.data.data.addons;

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
      });
}

function addToCart(addon_master){
  crmAddonStore.addToCart(addon_master,yearly_remain_months.value,monthly_remain_months.value);
}

function removeFromCart(index){
  crmAddonStore.removeItemFromCart(index);
}

function applyCoupon(){
  let selected_coupon = _.find(coupons.value, (item) => {
    return item.id == form.coupon_id;
  });
  if(form.coupon_id==''){
    crmAddonStore.clearDiscount();
  }else{
    crmAddonStore.addDiscount(selected_coupon);
  }

}


async function renewAddon() {

  form.is_saving = true;

  var form_data = new FormData();
  form_data.append("user_id", subscription.value.user_id);
  form_data.append("user_subscription_slack", subscription.value.slack);
  form_data.append("selected_addons", JSON.stringify(crmAddonStore.cart));
  form_data.append("payment_receipt", form.payment_receipt);
  form_data.append("coupon_id", form.coupon_id);
  form_data.append("payment_mode_id", form.payment_mode_id);
  form_data.append("payment_status", form.payment_status);
  form_data.append("note", form.note);

  await axios
      .post('/api/v2/user/subscription/add_addons', form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {


        if (response.data.status_code == 200) {
          toast.success(response.data.msg);
          form.is_saving = false;
          crmAddonStore.clearCart();
          getSubscriptionDetail();
          getMasterData();
          resetData();
          $("#formFile").val('');
        } else {
          try {
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
          } catch (err) {
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
          }
          form.is_saving = false;
        }
      })
      .catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        form.is_saving = false;
        console.log(error);
      });
}

function resetData() {
  Object.assign(form, initialState);
}

async function selectFile(e) {
  form.payment_receipt = e.target.files[0];
}

</script>
