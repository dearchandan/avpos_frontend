<template>
  <CashierLayout>

    <CashierHeader @closeRegister="closeRegister()" />

    <RestroCashierSidebar v-if="layout == 1" />

    <div class="main-content-wrap">
      <div class="content">
        <div
          class="alert alert-danger"
          v-if="
            authStore.user.logged_in_terminal != null && 
            terminal_closing_time != '' &&
            terminal_closing_time <= 15 &&
            terminal_closing_time > 0
          "
        >
         <Icon icon="fa6-regular:clock" class="me-1" /> Terminal closes in {{ terminal_closing_time }} minutes
        </div>

        <div class="cashier-header-search">
          <div
            v-if="layout == 1"
            class="row align-items-center justify-content-between g-2 g-md-3"
          >
            <div class="col-auto d-xl-none">
              <div class="categorietoggle">
                <svg width="26" height="14" viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="1.5" y1="1" x2="14.5" y2="1" stroke="#313131" stroke-width="2" stroke-linecap="round"/>
                <line x1="1.5" y1="7" x2="24.5" y2="7" stroke="#313131" stroke-width="2" stroke-linecap="round"/>
                <line x1="1.5" y1="13" x2="19.5" y2="13" stroke="#313131" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            <div
              class="col"
              v-if="
                cashier_settings.length == 0 ||
                (cashier_settings && cashier_settings.show_search)
              "
            >
              <div class="form-search-feild position-relative mb-0">
                <input
                  class="form-control form-control-lg"
                  type="search"
                  :placeholder="search_placeholder"
                  v-model="search_term"
                  id="search"
                />
                <div class="icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M6.77721 12.5582C9.96787 12.5582 12.5544 9.97031 12.5544 6.778C12.5544 3.58568 9.96787 0.997803 6.77721 0.997803C3.58654 0.997803 1 3.58568 1 6.778C1 9.97031 3.58654 12.5582 6.77721 12.5582Z"
                        stroke="#767F8F"
                        stroke-width="1.75071"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.0025 15.0021L11.0027 11.0005"
                        stroke="#767F8F"
                        stroke-width="1.75071"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="col-md-auto d-none d-md-block">
              <ul class="popup-btns">
                <li
                  :class="{ active: order_type != null && order_type == 1 }"
                  @click="changeOrderType(1)"
                >
                  <a href="#"
                    ><Icon
                      icon="material-symbols:box-outline-rounded"
                      class="pe-1 pb-1 align-middle top-0"
                      style="font-size: 1.75rem"
                    />
                    {{ $t("Take Away") }}</a
                  >
                </li>
                <li :class="{ active: order_type != null && order_type == 2 }">
                  <a
                    class="dropdown-item"
                    href="#"
                    data-bs-toggle="modal"
                    data-backdrop="static"
                    data-keyboard="false"
                    @click="openDineInModal()"
                    data-bs-target="#dineInModal"
                  >
                    <Icon
                      icon="ic:twotone-table-bar"
                      class="pe-1 pb-1 align-middle top-0"
                      style="font-size: 1.75rem"
                    />
                    {{ $t("Dine In") }}
                    <span
                      v-if="selected_table && selected_seats"
                      class="bg-white text-primary"
                    >
                      {{ selected_table.name }}
                      <Icon icon="fa6-solid:users" class="ps-3" />
                      {{ selected_seats }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="col-auto dropdown d-md-none">
              <a class="dropdown-toggle btn btn-icon" data-bs-toggle="dropdown"
                href="#" type="button">
                <span class="active-lang">EN</span>
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item active" href="#">EN</a></li>
                <li><a class="dropdown-item" href="#">AR</a></li>
              </ul>
            </div>


          </div>
        </div>


        <div v-if="layout == 2" class="row mb-3 mb-md-4">
          <div class="col-lg-8">
            <div class="form-search-feild position-relative mb-0">
              <input
                class="form-control form-control-lg"
                type="search"
                v-model="search_term"
                :placeholder="search_placeholder"
              />
              <div class="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M6.77721 12.5582C9.96787 12.5582 12.5544 9.97031 12.5544 6.778C12.5544 3.58568 9.96787 0.997803 6.77721 0.997803C3.58654 0.997803 1 3.58568 1 6.778C1 9.97031 3.58654 12.5582 6.77721 12.5582Z"
                      stroke="#767F8F"
                      stroke-width="1.75071"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15.0025 15.0021L11.0027 11.0005"
                      stroke="#767F8F"
                      stroke-width="1.75071"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="col-lg-4 mt-2 mt-md-3 mt-lg-0">
            <RetailCashierCategoryList />
          </div>
        </div>
        <div class="page-heading">
          <div class="row align-items-center justify-content-between">
            <div class="col-auto">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb align-items-center mb-0">
                  <!-- <li class="breadcrumb-item text-muted" aria-current="page"> {{ filtered_products.length }} products found </li> -->
                </ol>
              </nav>
            </div>
            <div class="col-auto">
              <div class="row align-items-center">
                <div
                  class="col-auto"
                  v-if="
                    cashier_settings.length == 0 ||
                    (cashier_settings && cashier_settings.show_filter_by_veg)
                  "
                >
                  <!-- <div class="form-check switch_label_right form-switch">
                    <label
                      >{{ $t("Veg") }}
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        v-model="filters.dietary"
                      />
                    </label>
                  </div> -->
                </div>
                <div
                  class="col-auto"
                  v-if="
                    cashier_settings.length == 0 ||
                    (cashier_settings &&
                      cashier_settings.show_filter_by_in_stock)
                  "
                >
                  <!-- <div class="form-check switch_label_right form-switch">
                    <label
                      >{{ $t("In Stock") }}
                      <input
                        class="form-check-input"
                        checked
                        type="checkbox"
                        role="switch"
                        v-model="filters.in_stock"
                      />
                    </label>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <CashierProductList
          @openTerminal="openTerminal()"
          @getProductsOnScroll="getProductsOnScroll"
          :page="page_no"
          :is_shift_available="is_shift_available"
        />
      </div>
    </div>

    <div class="rightbar" :class="{ 'p-0': layout == 2 }">
      <div
        class="select-customer-wrap"
        v-if="
          cashier_settings &&
          cashier_settings.enable_customer_selection &&
          layout == 1
        "
      >
        <div class="selectcustomer_data" v-if="customer.mobile_number != ''">
          <div class="row align-items-center justify-content-between">
            <div class="col-auto">
              <h6>{{ customer.name }}</h6>
              <h4>{{ customer.mobile_number }}</h4>
            </div>

            <div class="col-auto">
              <button @click="clearCustomer()">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.3486 6.60718L6.23691 16.2898C5.83802 16.6718 5.75717 17.2137 6.05635 17.5002C6.35552 17.7866 6.92141 17.7092 7.32031 17.3273L17.432 7.64461C17.8309 7.26264 17.9117 6.72075 17.6126 6.43427C17.3134 6.1478 16.7475 6.22521 16.3486 6.60718Z"
                    fill="#4B5B73"
                  />
                  <path
                    d="M17.7629 16.3557L7.65122 6.67306C7.25232 6.29109 6.68643 6.21368 6.38726 6.50016C6.08809 6.78664 6.16893 7.32852 6.56782 7.71049L16.6795 17.3931C17.0784 17.7751 17.6443 17.8525 17.9435 17.566C18.2426 17.2796 18.1618 16.7377 17.7629 16.3557Z"
                    fill="#4B5B73"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
          <div class="collapse show" v-else>
            <a href="#" @click="selectCustomer()">{{ $t("Select Customer") }}</a>
          </div>

        <div class="cartsidebarclose d-xl-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 1L1 11" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 1L11 11" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </div>

      </div>

      <div class="spm-rightbar-header" v-if="layout == 2">
        <div class="spm-header-topbar">
          <div class="row gx-2 align-items-center">
            <div class="col">
              <h3>{{ $t("Cart") }}</h3>
            </div>
            <div class="col-auto">
              <button class="btn btn-light" @click="clearCart()">
                <svg
                  width="25"
                  height="26"
                  viewBox="0 0 25 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.75624 19.2957C6.65228 19.2958 6.55239 19.2553 6.47774 19.183L6.40849 19.1145L6.38999 19.096C6.09474 18.8 5.79999 18.493 5.51624 18.182C5.44545 18.1036 5.40853 18.0004 5.41354 17.8949C5.41854 17.7894 5.46506 17.6902 5.54295 17.6189C5.62085 17.5476 5.72378 17.5099 5.82931 17.5142C5.93484 17.5185 6.03438 17.5643 6.10624 17.6417C6.38299 17.9442 6.66899 18.2432 6.95624 18.5305L6.97424 18.5485C6.99424 18.5685 7.01449 18.5887 7.03474 18.6085C7.09193 18.6639 7.13127 18.7351 7.14774 18.8131C7.1642 18.891 7.15702 18.972 7.12714 19.0459C7.09725 19.1197 7.04601 19.1829 6.97998 19.2274C6.91395 19.2719 6.83613 19.2957 6.75649 19.2957H6.75624Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M11.9602 23.4C11.8855 23.4 11.8122 23.379 11.7487 23.3395C11.2957 23.0573 10.8462 22.7613 10.413 22.459C10.3691 22.4293 10.3315 22.3912 10.3025 22.3468C10.2735 22.3025 10.2536 22.2528 10.2439 22.2007C10.2342 22.1485 10.235 22.095 10.2462 22.0432C10.2574 21.9914 10.2788 21.9423 10.3092 21.8989C10.3395 21.8554 10.3782 21.8184 10.4229 21.79C10.4677 21.7616 10.5176 21.7424 10.5699 21.7335C10.6221 21.7245 10.6756 21.7261 10.7273 21.738C10.7789 21.75 10.8277 21.7721 10.8707 21.803C11.131 21.9845 11.3972 22.1638 11.6667 22.339C11.8691 21.2526 12.1857 20.1905 12.611 19.1705C13.0912 18.0308 13.7099 16.9546 14.4532 15.9663C14.5477 15.8407 14.6334 15.7088 14.71 15.5715C15.472 14.2113 15.235 12.4858 14.1362 11.375L14.1322 11.3708L14.1292 11.3678L14.1252 11.3638C13.0142 10.2638 11.2887 10.028 9.92898 10.7888C9.7916 10.8655 9.65955 10.9515 9.53373 11.046C8.54534 11.7893 7.46916 12.4081 6.32948 12.8883C5.30947 13.3136 4.24742 13.6301 3.16098 13.8325C3.65798 14.5963 4.18798 15.3358 4.74173 16.0368C4.80747 16.12 4.83744 16.226 4.82504 16.3314C4.81263 16.4368 4.75888 16.5329 4.6756 16.5986C4.59233 16.6644 4.48634 16.6943 4.38097 16.6819C4.2756 16.6695 4.17947 16.6158 4.11373 16.5325C3.41175 15.6422 2.75966 14.7137 2.16048 13.7513C2.12545 13.695 2.10493 13.631 2.10077 13.5649C2.0966 13.4987 2.10893 13.4326 2.13664 13.3724C2.16435 13.3123 2.20658 13.2599 2.25952 13.2201C2.31247 13.1802 2.37448 13.1542 2.43998 13.1443C4.93998 12.7658 7.10423 11.8693 9.05348 10.407C9.88309 9.78519 10.9086 9.48229 11.9429 9.55357C12.9772 9.62484 13.9515 10.0655 14.688 10.7953L14.705 10.812C15.3699 11.4801 15.7964 12.3484 15.9187 13.283C16.0407 14.2077 15.8617 15.147 15.4082 15.962C15.3141 16.1305 15.2087 16.2925 15.0927 16.4468C13.6297 18.3968 12.7342 20.559 12.3557 23.06C12.3414 23.1546 12.2936 23.241 12.221 23.3033C12.1484 23.3657 12.0559 23.4 11.9602 23.4Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M8.97723 21.2832C8.8862 21.2831 8.79797 21.2518 8.72723 21.1945C8.49273 21.0052 8.25848 20.8102 8.03048 20.6145C7.95608 20.5439 7.91163 20.4475 7.9063 20.3451C7.90098 20.2427 7.93519 20.1421 8.00186 20.0642C8.06854 19.9863 8.1626 19.937 8.2646 19.9264C8.36661 19.9159 8.46877 19.9449 8.54998 20.0075C8.77173 20.198 8.99998 20.3877 9.22824 20.572C9.29263 20.624 9.33932 20.6947 9.36186 20.7743C9.38441 20.8539 9.3817 20.9386 9.35411 21.0166C9.32652 21.0946 9.27541 21.1622 9.20782 21.2099C9.14023 21.2577 9.05949 21.2833 8.97673 21.2832H8.97723Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M15.0595 16.1663C14.9535 16.1665 14.8517 16.1247 14.7765 16.05L9.45152 10.725C9.3765 10.65 9.33435 10.5482 9.33435 10.4421C9.33435 10.336 9.3765 10.2343 9.45152 10.1593C9.52654 10.0842 9.6283 10.0421 9.7344 10.0421C9.8405 10.0421 9.94225 10.0842 10.0173 10.1593L15.3423 15.4843C15.3982 15.5402 15.4362 15.6115 15.4517 15.689C15.4671 15.7666 15.4592 15.847 15.4289 15.9201C15.3986 15.9931 15.3474 16.0556 15.2817 16.0995C15.2159 16.1435 15.1386 16.167 15.0595 16.167V16.1663Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M15.1722 12.5595C15.0931 12.5595 15.0158 12.536 14.9501 12.492C14.8843 12.4481 14.8331 12.3856 14.8028 12.3126C14.7726 12.2395 14.7646 12.1591 14.7801 12.0815C14.7955 12.004 14.8335 11.9327 14.8895 11.8768L21.8377 4.92826C21.9223 4.84547 21.9897 4.74671 22.0359 4.63771C22.0821 4.52871 22.1062 4.41163 22.1068 4.29325C22.1075 4.17487 22.0846 4.05753 22.0396 3.94804C21.9946 3.83854 21.9283 3.73906 21.8446 3.65535C21.7609 3.57164 21.6614 3.50536 21.5519 3.46036C21.4424 3.41535 21.3251 3.39251 21.2067 3.39315C21.0883 3.39379 20.9713 3.41791 20.8623 3.4641C20.7533 3.5103 20.6545 3.57765 20.5717 3.66226L13.6232 10.6105C13.5478 10.6837 13.4467 10.7244 13.3416 10.7236C13.2366 10.7229 13.136 10.6808 13.0617 10.6065C12.9874 10.5323 12.9453 10.4317 12.9445 10.3266C12.9437 10.2216 12.9843 10.1204 13.0575 10.045L20.006 3.09651C20.1634 2.93909 20.3503 2.81422 20.5559 2.72902C20.7616 2.64383 20.9821 2.59998 21.2047 2.59998C21.4273 2.59998 21.6478 2.64383 21.8535 2.72902C22.0591 2.81422 22.246 2.93909 22.4035 3.09651C22.5609 3.25394 22.6858 3.44082 22.7709 3.64651C22.8561 3.85219 22.9 4.07264 22.9 4.29526C22.9 4.51789 22.8561 4.73834 22.7709 4.94402C22.6858 5.14971 22.5609 5.33659 22.4035 5.49401L15.455 12.4425C15.3799 12.5175 15.2782 12.5595 15.1722 12.5595Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M8.28955 20.7113C8.19488 20.7111 8.10334 20.6774 8.0312 20.6161C7.95906 20.5548 7.91099 20.4699 7.89555 20.3765L7.6523 18.9108L6.9288 19.2568C6.83305 19.3025 6.72306 19.3084 6.62301 19.273C6.52296 19.2376 6.44105 19.164 6.3953 19.0683C6.34955 18.9725 6.34371 18.8625 6.37906 18.7625C6.41441 18.6624 6.48805 18.5805 6.5838 18.5348L7.7873 17.9598C7.84324 17.933 7.90462 17.9197 7.96661 17.9207C8.02859 17.9218 8.08948 17.9373 8.14447 17.9659C8.19946 17.9945 8.24703 18.0356 8.28345 18.0857C8.31986 18.1359 8.34412 18.1939 8.3543 18.255L8.6848 20.2458C8.69342 20.2976 8.69174 20.3506 8.67986 20.4018C8.66797 20.453 8.64612 20.5014 8.61554 20.5441C8.58497 20.5869 8.54627 20.6231 8.50166 20.6509C8.45704 20.6787 8.4074 20.6974 8.35555 20.706C8.33372 20.7095 8.31165 20.7112 8.28955 20.7113Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M5.81102 18.312C5.74457 18.312 5.67917 18.2954 5.62073 18.2638C5.56229 18.2321 5.51265 18.1864 5.47631 18.1308C5.43996 18.0752 5.41804 18.0114 5.41253 17.9451C5.40703 17.8789 5.4181 17.8124 5.44477 17.7515L6.12502 16.1982L4.54127 16.6687C4.43956 16.6989 4.33002 16.6875 4.23674 16.6369C4.14346 16.5864 4.0741 16.5008 4.04389 16.3991C4.01369 16.2974 4.02513 16.1879 4.0757 16.0946C4.12626 16.0013 4.21181 15.9319 4.31352 15.9017L6.72502 15.1857C6.79813 15.164 6.87592 15.1637 6.94923 15.1847C7.02253 15.2057 7.0883 15.2473 7.13877 15.3045C7.18925 15.3616 7.22232 15.432 7.2341 15.5074C7.24589 15.5827 7.23588 15.6599 7.20527 15.7297L6.17752 18.0725C6.14632 18.1437 6.09504 18.2043 6.02995 18.2468C5.96485 18.2894 5.88878 18.312 5.81102 18.312Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M10.642 22.531H10.6297C10.5237 22.5278 10.4233 22.4826 10.3506 22.4054C10.2779 22.3282 10.2388 22.2253 10.242 22.1193C10.2562 21.6485 10.2707 21.1395 10.2815 20.7538L9.1367 21.25C9.08851 21.2709 9.03667 21.2821 8.98414 21.283C8.93161 21.2839 8.87942 21.2744 8.83055 21.2551C8.78169 21.2358 8.7371 21.2071 8.69933 21.1706C8.66157 21.1341 8.63137 21.0904 8.61045 21.0423C8.58954 20.9941 8.57833 20.9422 8.57745 20.8897C8.57657 20.8372 8.58605 20.785 8.60534 20.7361C8.62463 20.6872 8.65336 20.6426 8.68988 20.6049C8.72641 20.5671 8.77001 20.5369 8.8182 20.516L10.5395 19.7693C10.6012 19.7422 10.6689 19.7311 10.7361 19.7372C10.8033 19.7432 10.8678 19.7662 10.9238 19.8039C10.9797 19.8417 11.0252 19.8929 11.056 19.9529C11.0868 20.013 11.1019 20.0798 11.1 20.1473C11.1 20.1578 11.0707 21.2223 11.043 22.143C11.0398 22.2472 10.9962 22.346 10.9213 22.4185C10.8464 22.4909 10.7462 22.5313 10.642 22.531Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M6.72105 10.2152C6.64943 10.2151 6.57917 10.1957 6.51761 10.1591C6.45604 10.1225 6.40543 10.0701 6.37105 10.0072L5.7658 8.9025L4.66105 8.29825C4.59804 8.26381 4.54547 8.21305 4.50884 8.15129C4.47221 8.08953 4.45288 8.01905 4.45288 7.94725C4.45288 7.87544 4.47221 7.80496 4.50884 7.7432C4.54547 7.68144 4.59804 7.63068 4.66105 7.59625L5.7658 6.992L6.37005 5.88725C6.40449 5.82424 6.45525 5.77166 6.51701 5.73503C6.57877 5.69841 6.64925 5.67908 6.72105 5.67908C6.79285 5.67908 6.86333 5.69841 6.92509 5.73503C6.98685 5.77166 7.03761 5.82424 7.07205 5.88725L7.6763 6.992L8.78105 7.59625C8.84406 7.63068 8.89664 7.68144 8.93326 7.7432C8.96989 7.80496 8.98922 7.87544 8.98922 7.94725C8.98922 8.01905 8.96989 8.08953 8.93326 8.15129C8.89664 8.21305 8.84406 8.26381 8.78105 8.29825L7.6763 8.9025L7.07205 10.0072C7.03759 10.0702 6.98682 10.1228 6.92506 10.1594C6.86331 10.196 6.79284 10.2153 6.72105 10.2152ZM5.68655 7.94725L6.25255 8.25675C6.3196 8.29354 6.37475 8.3487 6.41155 8.41575L6.72105 8.98175L7.03055 8.41575C7.06735 8.3487 7.1225 8.29354 7.18955 8.25675L7.75555 7.94725L7.18955 7.63775C7.1225 7.60095 7.06735 7.54579 7.03055 7.47875L6.72105 6.91275L6.41155 7.47875C6.37475 7.54579 6.3196 7.60095 6.25255 7.63775L5.68655 7.94725Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M12.2945 8.34726C12.2229 8.3471 12.1527 8.32771 12.0911 8.29112C12.0295 8.25453 11.9789 8.20209 11.9445 8.13926L11.3403 7.03426L10.2353 6.43001C10.1723 6.39555 10.1198 6.3448 10.0832 6.28306C10.0466 6.22133 10.0273 6.15089 10.0273 6.07913C10.0273 6.00737 10.0466 5.93693 10.0832 5.8752C10.1198 5.81347 10.1723 5.76271 10.2353 5.72826L11.3393 5.12501L11.9435 4.02026C11.978 3.95731 12.0287 3.90479 12.0905 3.86821C12.1522 3.83162 12.2226 3.81232 12.2944 3.81232C12.3662 3.81232 12.4366 3.83162 12.4983 3.86821C12.5601 3.90479 12.6108 3.95731 12.6453 4.02026L13.25 5.12501L14.3548 5.72951C14.4177 5.76396 14.4703 5.81472 14.5068 5.87645C14.5434 5.93818 14.5627 6.00862 14.5627 6.08038C14.5627 6.15214 14.5434 6.22258 14.5068 6.28431C14.4703 6.34605 14.4177 6.3968 14.3548 6.43126L13.25 7.03426L12.6455 8.13926C12.6111 8.20223 12.5603 8.25478 12.4985 8.29137C12.4368 8.32797 12.3663 8.34728 12.2945 8.34726ZM11.26 6.07901L11.825 6.38851C11.8921 6.4253 11.9472 6.48046 11.984 6.54751L12.2935 7.11351L12.603 6.54751C12.6397 6.48039 12.6949 6.42521 12.762 6.38851L13.328 6.07901L12.762 5.76951C12.6949 5.7328 12.6397 5.67762 12.603 5.61051L12.2935 5.04451L11.985 5.61051C11.9483 5.67762 11.8931 5.7328 11.826 5.76951L11.26 6.07901Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M19.4343 15.3715C19.3627 15.3713 19.2924 15.3519 19.2308 15.3153C19.1693 15.2788 19.1187 15.2263 19.0843 15.1635L18.48 14.0587L17.375 13.4545C17.312 13.4201 17.2595 13.3693 17.2228 13.3075C17.1862 13.2458 17.1669 13.1753 17.1669 13.1035C17.1669 13.0317 17.1862 12.9612 17.2228 12.8994C17.2595 12.8377 17.312 12.7869 17.375 12.7525L18.4798 12.1482L19.084 11.0435C19.1184 10.9806 19.169 10.9281 19.2306 10.8915C19.2921 10.8548 19.3624 10.8354 19.434 10.8352C19.5057 10.8354 19.576 10.8548 19.6375 10.8915C19.6991 10.9281 19.7497 10.9806 19.784 11.0435L20.3883 12.1482L21.493 12.7525C21.556 12.7869 21.6086 12.8377 21.6453 12.8994C21.6819 12.9612 21.7012 13.0317 21.7012 13.1035C21.7012 13.1753 21.6819 13.2458 21.6453 13.3075C21.6086 13.3693 21.556 13.4201 21.493 13.4545L20.3883 14.0587L19.784 15.1635C19.7497 15.2263 19.6991 15.2787 19.6376 15.3153C19.5761 15.3519 19.5059 15.3713 19.4343 15.3715ZM18.4 13.1035L18.966 13.413C19.0331 13.4498 19.0882 13.5049 19.125 13.572L19.4345 14.138L19.744 13.572C19.7808 13.5049 19.836 13.4498 19.903 13.413L20.469 13.1035L19.903 12.794C19.836 12.7572 19.7808 12.702 19.744 12.635L19.4345 12.069L19.125 12.635C19.0882 12.702 19.0331 12.7572 18.966 12.794L18.4 13.1035Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                  <path
                    d="M16.8897 20.7317C16.8181 20.7316 16.7479 20.7122 16.6863 20.6756C16.6247 20.639 16.5741 20.5866 16.5397 20.5237L15.9352 19.4187L14.8305 18.8145C14.7675 18.7801 14.7149 18.7293 14.6783 18.6675C14.6416 18.6058 14.6223 18.5353 14.6223 18.4635C14.6223 18.3917 14.6416 18.3212 14.6783 18.2595C14.7149 18.1977 14.7675 18.1469 14.8305 18.1125L15.9352 17.5082L16.5397 16.4035C16.5741 16.3407 16.6247 16.2882 16.6863 16.2516C16.7479 16.215 16.8181 16.1957 16.8897 16.1955C16.9614 16.1957 17.0316 16.215 17.0932 16.2516C17.1547 16.2882 17.2054 16.3407 17.2397 16.4035L17.844 17.5082L18.95 18.1125C19.013 18.1469 19.0656 18.1977 19.1022 18.2595C19.1388 18.3212 19.1582 18.3917 19.1582 18.4635C19.1582 18.5353 19.1388 18.6058 19.1022 18.6675C19.0656 18.7293 19.013 18.7801 18.95 18.8145L17.845 19.4187L17.2407 20.525C17.2061 20.5877 17.1553 20.64 17.0935 20.6764C17.0318 20.7128 16.9614 20.7319 16.8897 20.7317ZM15.8552 18.4635L16.4212 18.773C16.4883 18.8097 16.5435 18.8649 16.5802 18.932L16.8897 19.498L17.2 18.932C17.2368 18.865 17.2919 18.8098 17.359 18.773L17.925 18.4635L17.359 18.154C17.2919 18.1172 17.2368 18.062 17.2 17.995L16.8905 17.429L16.5802 17.995C16.5435 18.0621 16.4883 18.1173 16.4212 18.154L15.8552 18.4635Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.3"
                  />
                </svg>
                {{ $t("Clear Cart") }}
              </button>
            </div>

            <div class="col-auto d-md-none">
              <button
                class="btn btn-light-danger btn-sm btn-icon btn-rounded rightbar-close"
              >
                <svg
                  class="m-0"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 5L4.5 14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.5 5L13.5 14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          class="spm-header-customer"
          v-if="cashier_settings && cashier_settings.enable_customer_selection"
        >
          <div class="row gx-2 align-items-center">
            <div class="col" v-if="customer.mobile_number != ''">
              <h5>
                <a href="#customerDATA" data-bs-toggle="modal"
                  ><u>{{ customer.name }}</u></a
                >
                | {{ customer.mobile_number }}
              </h5>
            </div>
            <div
              class="col-auto"
              v-if="customer.mobile_number != ''"
              @click="clearCustomer()"
            >
              <button class="btn btn-white btn-sm btn-icon btn-rounded">
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 5L4.5 14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.5 5L13.5 14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div class="col" v-else>
              <a href="#" @click="selectCustomer()">{{
                $t("Select Customer")
              }}</a>
            </div>
          </div>
        </div>
      </div>

      <Cart @payNow="payNow()" />
    </div>

    <AsyncCloseRegister
      @openTerminal="openTerminal()"
      @closeRegister="closeRegisterModal()"
      :terminal_closing_time="terminal_closing_time"
      :force_closing="force_closing"
      :cash_in_hand_remain="cash_in_hand_remain"
      :is_shift_available="is_shift_available_close"
    />

    <AsyncSelectTerminal />

    <AsyncSelectDineIn
      :show_dine_in_modal="show_dine_in_modal"
      @closeDineInModal="closeDineInModal"
      v-if="layout == 1"
    />

    <AsyncSelectPayment />

    <AsyncSelectCustomer @payNow="payNow()" @close="closeCustomerModal" />

    <AsyncHoldOrdersModal />

    <AsyncSearchOrdersModal />

    <AsyncSwitchMultiplePriceModal />

    <AsyncProfileModal />

    <AsyncBookTableModal
      @refreshDineInTables="refreshDineInTables"
      v-if="layout == 1"
    />

    <AsyncNoShiftModal @closeRegister="closeRegister()" />
  </CashierLayout>

 
</template>


<script setup>
import { useCashierStore } from "@/stores/cashierStore";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useI18n } from "vue-i18n";
import { computed, onMounted, watchEffect } from "vue";
import { useSettingStore } from "@/stores/settingStore";
import { useAuthStore } from "@/stores/auth";
import { useMagicKeys, whenever } from "@vueuse/core";

const settingStore = useSettingStore();
const authStore = useAuthStore();
const logo = computed(() => {
  return settingStore.logo;
});

const { t } = useI18n();

const cashierStore = useCashierStore();

const { placeOrder } = useGlobalFunctions();
const search_placeholder = t("Search by name, barcode, upc...");
const page_no = ref(1);
const terminal_closing_time = ref("");
const is_closing_terminal_open = ref(false);
const force_closing = ref(false);
const is_shift_available = ref(true);
const is_shift_available_close = ref(true);
const cash_in_hand_remain = ref(0);
onMounted(() => {
  cashierStore.refreshTerminals();
  cashierStore.getMultiplePrices();
  cashierStore.getPaymentMethods();
  cashierStore.setPage(1);
  setInterval(() => {
    checkTimingShifts();
  }, 1000);
});

/* Dine In */
const show_dine_in_modal = ref(false);
function openDineInModal() {
  cashierStore.setBookingType(1); // Dine In
  show_dine_in_modal.value = true;
}

function closeDineInModal() {
  show_dine_in_modal.value = false;
}

const cashier_settings = computed(() => {
  return cashierStore.settings;
});

const selected_table = computed(() => {
  return cashierStore.table;
});

const selected_seats = computed(() => {
  return cashierStore.seats;
});

const order_type = computed(() => {
  return cashierStore.order_type;
});

function changeOrderType(order_type) {
  cashierStore.setOrderType(order_type);
}
function clearCart() {
  cashierStore.clearCart();
}
/* fetching products from database */

// const filtered_products = computed(() => {
//   return cashierStore.filtered_products;
// });
function checkTimingShifts() {
  //if (authStore.user.logged_in_terminal != null) {
    if (localStorage.getItem("auth") && localStorage.getItem("timings")) {

      var timings = JSON.parse(localStorage.getItem("timings"));

      //var timings = authStore.user.login_branch.timings;

      const d = new Date();
      let day = d.getDay();
      let timing = "";
      if (timings.find((e) => e.weekday === day)) {
        if (
          timings[timings.findIndex((e) => e.weekday === day)]
            .is_allday_running == false
        )
          timing = timings[timings.findIndex((e) => e.weekday === day)];
      }
      if (timing != "" && timing.shifts!='' && timing.shifts!=null) {
        var shifts = JSON.parse(timing.shifts);
        var nowDate = new Date();
        var current_shift =
          shifts[
            shifts.findIndex(
              (e) =>
                nowDate <=
                  new Date(
                    nowDate.getFullYear() +
                      "-" +
                      (nowDate.getMonth() + 1) +
                      "-" +
                      nowDate.getDate() +
                      " " +
                      e.closing_time +
                      ":00"
                  ) &&
                nowDate >=
                  new Date(
                    nowDate.getFullYear() +
                      "-" +
                      (nowDate.getMonth() + 1) +
                      "-" +
                      nowDate.getDate() +
                      " " +
                      e.opening_time +
                      ":00"
                  )
            )
          ];
        if (current_shift != undefined) {
          var date = new Date(
            nowDate.getFullYear() +
              "-" +
              (nowDate.getMonth() + 1) +
              "-" +
              nowDate.getDate() +
              " " +
              current_shift.closing_time +
              ":00"
          );
          let diff = date - nowDate;
          terminal_closing_time.value = Math.round(
            ((diff % 86400000) % 3600000) / 60000
          );
          if (
            terminal_closing_time.value <= 0 &&
            is_closing_terminal_open.value == false
          ) {
            is_closing_terminal_open.value = true;
            force_closing.value = true;
            is_shift_available_close.value = false;
            closeRegister();
          }
        }
        else{
          if(is_shift_available.value == true){
            force_closing.value = false;
            is_shift_available.value = false;
            is_shift_available_close.value = false;
            //openNoShift();
          }
          
        }
        
      }
      else{
      
        if (timings.find((e) => e.weekday === day)) {
          if (
            timings[timings.findIndex((e) => e.weekday === day)].is_allday_running == false && (timings[timings.findIndex((e) => e.weekday === day)].shifts == '' || timings[timings.findIndex((e) => e.weekday === day)].shifts == null) 
          ){
            if(is_shift_available.value == true){
              is_shift_available.value = false;
              is_shift_available_close.value = false;
              openNoShift();
            }
          }
        }
      }
    }
  //}
}

const last_page = computed(() => {
  return cashierStore.last_page;
});

/* ------------------------------ */
/* ---- Search & Filtering ------- */
/* ------------------------------ */

/* searching */
const search_term = ref("");

watch(
  () => search_term.value,
  _.debounce((newValue) => {
    cashierStore.setSearch(newValue);
  }, 600)
);

/* filter by is veg, in stock*/
// const filters = computed(() => {
//   return cashierStore.filters;
// });

const next_page = computed(() => {
  return cashierStore.next_page;
});
// watch(
//   filters,
//   (newValue) => {
//     all_products.value = [];
//     cashierStore.setFilters(newValue);
//   },
//   { deep: true }
// );

// watch(
//   filtered_products,
//   (newValue) => {
//     if (cashierStore.page == 1) {
//       all_products.value = [];
//       page_no.value = 1;
//     }
//     newValue.map(function (item) {
//       all_products.value.push(item);
//     });
//   },
//   { deep: true }
// );

/* customer */

const customer = computed(() => {
  return cashierStore.customer;
});

function selectCustomer(selection_type = 0) {
  // 0-direct,1-indirect
  clearCustomer();
  cashierStore.setCustomerSelectionType(selection_type);
  $("#customerModal").modal("show");
}
function closeCustomerModal() {
  $("#customerModal").modal("hide");
}

const cashier_action = computed(() => {
  return cashierStore.action_type;
});

function clearCustomer() {
  cashierStore.clearCustomer();
}

async function payNow() {
  if (
    cashier_action.value == "CLOSE" ||
    cashier_action.value == "SEND_TO_KITCHEN"
  ) {
    if (
      cashier_settings.value &&
      cashier_settings.value.enable_customer_selection &&
      !customer.value.is_added
    ) {
      selectCustomer(1); // Indirect
    } else {
      $("#customerModal").modal("hide");
      $("#paymentModal").modal("show");
    }
  } else if (
    cashier_action.value == "HOLD" ||
    cashier_action.value == "HOLD_AND_SEND_TO_KITCHEN"
  ) {
    await holdOrder();
  }
}

const is_processing = ref(false);

async function holdOrder() {
  is_processing.value = true;

  let response = await placeOrder();

  if (response.data.status_code == 200) {
    toast.success(response.data.msg);

    cashierStore.clearCart();

    is_processing.value = false;
  } else {
    toast.error(response.data.msg);

    is_processing.value = false;
  }
}

function openTerminal() {
  $("#terminalModal").modal("show");
}
function openNoShift(){
  $(".modal").modal("hide");
  $("#noShiftModal").modal("show");
}
function closeRegisterModal() {
  is_closing_terminal_open.value = false;
  force_closing.value = false;
  cash_in_hand_remain.value = 0;
  $("#closeRegisterModal").modal("hide");
}

const register_id = computed(() => {
  return authStore.loggedInTerminal
    ? authStore.loggedInTerminal.active_business_register.id
    : "";
});

async function closeRegister() {
  let response = await axios.get("/api/order/system_closing_cash", {
    params: {
      register_id: register_id.value,
    },
  });
  cashierStore.setSystemClosingCash(response.data.system_closing_cash);
  cash_in_hand_remain.value = cashierStore.system_closing_cash;
  terminal_closing_time.value = "";
  $("#closeRegisterModal").modal("show");
}

const AsyncSelectTerminal = defineAsyncComponent(() =>
  import("@/components/cashier/SelectTerminal.vue")
);
const AsyncSelectDineIn = defineAsyncComponent(() =>
  import("@/components/cashier/restro/SelectDineIn.vue")
);
const AsyncSelectPayment = defineAsyncComponent(() =>
  import("@/components/cashier/SelectPayment.vue")
);
const AsyncSelectCustomer = defineAsyncComponent(() =>
  import("@/components/cashier/SelectCustomer.vue")
);
const AsyncCloseRegister = defineAsyncComponent(() =>
  import("@/components/cashier/CloseRegister.vue")
);
const AsyncHoldOrdersModal = defineAsyncComponent(() =>
  import("@/components/cashier/HoldOrdersModal.vue")
);
const AsyncSearchOrdersModal = defineAsyncComponent(() =>
  import("@/components/cashier/SearchOrdersModal.vue")
);
const AsyncBookTableModal = defineAsyncComponent(() =>
  import("@/components/cashier/restro/BookTableModal.vue")
);
const AsyncSwitchMultiplePriceModal = defineAsyncComponent(() =>
  import("@/components/cashier/SwitchMultiplePriceModal.vue")
);

const AsyncProfileModal = defineAsyncComponent(() =>
  import("@/components/cashier/ProfileModal.vue")
);

const AsyncNoShiftModal= defineAsyncComponent(() =>
  import("@/components/cashier/noShiftModal.vue")
);
function getProductsOnScroll(page) {
  //if (document.querySelector("#content")) {

  // document.querySelector("#content").addEventListener("scroll", (e) => {
  //   const clientHeight = e.target.clientHeight;
  //   const scrollHeight = e.target.scrollHeight;
  //   const scrollTop = e.target.scrollTop;
  //   // console.log('scrollTop'+scrollTop);
  //   // console.log('clientHeight'+clientHeight);
  //   // console.log('scrollHeight'+scrollHeight);
  //   //console.log((scrollTop + clientHeight)+" - "+scrollHeight)
  //   if (
  //     Math.ceil(scrollTop + clientHeight) >= scrollHeight ||
  //     scrollTop + clientHeight >= scrollHeight
  //   ) {
  // page_no.value++;
  if (page <= cashierStore.pagination.last_page) {
    page_no.value++;
    cashierStore.setPage(page);
  }
  // } else {
  // }
  // });
  //}
}

function refreshDineInTables(values) {
  cashierStore.setBookingDate(values.booking_datetime);
  cashierStore.setBookingTime(values.booking_datetime);
  cashierStore.setBookingData(values);

  $("#dineInModal").modal("show");
}

//KEYBOARD SORTCUTS
const { alt_s, alt_t, alt_d } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.altKey && e.key === "d" && e.type === "keydown") e.preventDefault();

    if (e.altKey && e.key === "b" && e.type === "keydown") e.preventDefault();
  },
});
whenever(alt_s, () => document.getElementById("search").focus());
whenever(alt_t, () => changeOrderType(1));
whenever(alt_d, () => changeOrderType(2));

const layout = computed(() => {
  return authStore.user.merchant.layout;
});
</script>
