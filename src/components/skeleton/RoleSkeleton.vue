<template>
  <div class="content">
    <div class="row">
      <div class="col-lg-3 col-md-3">
        <div class="card" data-select2-id="select2-data-14-jv1y">
          <div class="row" >
            <div class="col-12 pb-3">
              <div class="skl-w" style="height: 24px; width: 60px"></div>
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
                  <span><div class="skl-w" style="width: 60px"></div></span>
                  <strong
                    ><div class="skl-w" style="height: 14px; width: 100px"></div
                  ></strong>
                </div>
                <div class="item">
                  <span><div class="skl-w" style="width: 60px"></div></span>
                  <strong
                    ><div class="skl-w" style="height: 14px; width: 100px"></div
                  ></strong>
                </div>
              </div>
            </div>

            <div
              class="col-md-12 clearfix"
              
            >
              <div class="data-view-box mb-3">
                <div class="item">
                  <span><div class="skl-w" style="width: 60px"></div></span>
                  <strong
                    ><div class="skl-w" style="height: 14px; width: 100px"></div
                  ></strong>
                </div>
                <div class="item">
                  <span><div class="skl-w" style="width: 60px"></div></span>
                  <strong
                    ><div class="skl-w" style="height: 14px; width: 100px"></div
                  ></strong>
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
        <div class="row" v-for="i in 2">
          <div class="card">
            <div class="mt-2 mb-2">
              <label class="form-check-label mb-0 d-flex align-items-center">
                <div
                  class="skl-w"
                  style="height: 18px; width: 18px; flex-grow: unset"
                ></div>
                <div
                  class="skl-w"
                  style="
                    height: 14px;
                    width: 100px;
                    margin-left: 6px;
                    flex-grow: unset;
                  "
                ></div>
              </label>
            </div>
            <div class="table-responsive">
              <table class="table">
                <tbody>
                  <tr v-for="i in 5"
                    
                  >
                    <td class="td-head-data pt-0 pb-0 mb-0" width="40%">
                      <div class="mb-0">
                        <label
                          class="form-check-label mb-0 d-flex align-items-center"
                        >
                          <div
                            class="skl-w"
                            style="
                              height: 18px;
                              width: 18px;
                              flex-grow: unset;
                              margin: 0;
                            "
                          ></div>
                          <div
                            class="skl-w"
                            style="
                              height: 14px;
                              width: 100px;
                              margin-left: 6px;
                              margin-right: 0;
                              flex-grow: unset;
                            "
                          ></div>
                        </label>
                      </div>
                    </td>
                    <td width="60%" class="">
                      <table class="userrole_sub_table table" width="100%">
                        <tbody>
                          <tr>
                            <td
                              width="33%"
                             
                            >
                              <div class="mb-0">
                                <label
                                  class="form-check-label mb-0 d-flex align-items-center"
                                >
                                  <div
                                    class="skl-w"
                                    style="
                                      height: 18px;
                                      width: 18px;
                                      flex-grow: unset;
                                      margin: 0;
                                    "
                                  ></div>
                                  <div
                                    class="skl-w"
                                    style="
                                      height: 14px;
                                      width: 100px;
                                      margin-left: 6px;
                                      margin-right: 0;
                                      flex-grow: unset;
                                    "
                                  ></div>
                                </label>
                              </div>
                            </td>
                            <td
                              width="33%"
                             
                            ></td>
                          </tr>
                        </tbody>
                      </table>
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
      <div
        class="skl-w"
        style="height: 38px; width: 90px; margin-left: auto"
      ></div>
    </div>
  </div>
</template>
