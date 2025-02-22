<template>
  <div class="content">

      <div class="row card-strash">
        <div class="col-md-12 mb-0">
        

          <div class="row">
            <div class="col-md-3 col-12 mb-4">
              <div class="card">
                <div class="row">
                  <div class="col-12">
                    <div class="form-field">
                      <div
                        class="skl-w"
                        style="
                          height: 12px;
                          width: 25%;
                          flex-grow: unset;
                          margin-bottom: 4px;
                        "
                      ></div>
                      <div class="skl-w" style="height: 38px"></div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-field">
                      <div
                        class="skl-w"
                        style="
                          height: 12px;
                          width: 25%;
                          flex-grow: unset;
                          margin-bottom: 4px;
                        "
                      ></div>
                      <div class="skl-w" style="height: 38px"></div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-field">
                      <div
                        class="skl-w"
                        style="
                          height: 12px;
                          width: 25%;
                          flex-grow: unset;
                          margin-bottom: 4px;
                        "
                      ></div>
                      <div class="selecttheme-box">
                        <div class="row">
                          <div class="col-6">
                            <div class="skl-w" style="height: 80px"></div>
                          </div>
                          <div class="col-6">
                            <div class="skl-w" style="height: 80px"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-9 col-12 mb-4">
              <div class="card carduploadshow">
                <div class="row g-0">
                  <div class="col-md-3">
                    <ul class="nav nav-pills" id="pills-tab" role="tablist">
                      <li class="nav-item" role="presentation">
                        <button
                          class="nav-link"
                          data-bs-toggle="pill"
                          data-bs-target="#PhotoSlideshow"
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                        >
                          <div
                            class="skl-w"
                            style="
                              height: 50px;
                              width: 70px;
                              flex-grow: unset;
                              margin-bottom: 10px;
                            "
                          ></div>
                          <div
                            class="skl-w"
                            style="height: 12px; width: 50%; flex-grow: unset"
                          ></div>
                        </button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button
                          class="nav-link"
                         
                        
                          data-bs-toggle="pill"
                          data-bs-target="#VideoShow"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          <div
                            class="skl-w"
                            style="
                              height: 50px;
                              width: 70px;
                              flex-grow: unset;
                              margin-bottom: 10px;
                            "
                          ></div>
                          <div
                            class="skl-w"
                            style="height: 12px; width: 50%; flex-grow: unset"
                          ></div>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div class="col-md-9">
                    <div class="tab-content" id="pills-tabContent">
                      <div
                        class="tab-pane fade"
                       
                        id="PhotoSlideshow"
                        role="tabpanel"
                        tabindex="0"
                      >
                        <div class="showupload-field">
                          <div
                            class="skl-w"
                            style="
                              height: 100px;
                              width: 100%;
                              flex-grow: unset;
                              margin-bottom: 10px;
                            "
                          ></div>
                        </div>
                        <div class="showupload-data">
                          <div class="row g-3">
                            <div
                              class="col-6 col-md-3"
                            >
                              <div class="showuploaddata-box">
                               
                                <button
                                  class="boxclose"
                                
                                  type="button"
                                >
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.00231 2.19527C9.33434 1.86324 9.33434 1.32402 9.00231 0.991989C8.67028 0.659958 8.13106 0.659958 7.79902 0.991989L5.00199 3.79168L2.2023 0.994645C1.87027 0.662614 1.33105 0.662614 0.999023 0.994645C0.666992 1.32668 0.666992 1.8659 0.999023 2.19793L3.79871 4.99496L1.00168 7.79465C0.669648 8.12668 0.669648 8.6659 1.00168 8.99793C1.33371 9.32996 1.87293 9.32996 2.20496 8.99793L5.00199 6.19824L7.80168 8.99527C8.13371 9.3273 8.67293 9.3273 9.00496 8.99527C9.33699 8.66324 9.33699 8.12402 9.00496 7.79199L6.20527 4.99496L9.00231 2.19527Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                      
                        id="VideoShow"
                        role="tabpanel"
                        tabindex="0"
                      >
                        <div class="showupload-field">
                          <div
                            class="skl-w"
                            style="
                              height: 100px;
                              width: 100%;
                              flex-grow: unset;
                              margin-bottom: 10px;
                            "
                          ></div>
                        </div>
                        <div class="showupload-data showupload-videodata">
                          <div class="row g-3">
                            <div class="col-12 col-md-5">
                              <div class="showuploaddata-box">
                                <video width="260" height="200" controls>
                                  <source type="video/mp4" />
                                </video>
                                <button
                                  class="boxclose"
                       
                                  type="button"
                                >
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.00231 2.19527C9.33434 1.86324 9.33434 1.32402 9.00231 0.991989C8.67028 0.659958 8.13106 0.659958 7.79902 0.991989L5.00199 3.79168L2.2023 0.994645C1.87027 0.662614 1.33105 0.662614 0.999023 0.994645C0.666992 1.32668 0.666992 1.8659 0.999023 2.19793L3.79871 4.99496L1.00168 7.79465C0.669648 8.12668 0.669648 8.6659 1.00168 8.99793C1.33371 9.32996 1.87293 9.32996 2.20496 8.99793L5.00199 6.19824L7.80168 8.99527C8.13371 9.3273 8.67293 9.3273 9.00496 8.99527C9.33699 8.66324 9.33699 8.12402 9.00496 7.79199L6.20527 4.99496L9.00231 2.19527Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </button>
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
