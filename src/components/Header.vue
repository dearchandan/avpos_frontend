<template>
  <div class="header-topbar" id="tempOne">
    <div class="row justify-content-between align-items-center">
      <div class="col-auto">
        <div class="row align-items-center gx-2 gx-md-3">
          <div class="col-auto d-lg-none">
            <div class="navbar-toggle">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="col-auto">
            <div class="logo">
              <a href="#">
                <img :src="logo_icon" class="d-block" alt="" />
              </a>
            </div>
          </div>
          <div class="col-auto ms-2" v-if="user_type != 1 && user_type != 4">
            <button
              v-if="my_branches && my_branches.length > 1"
              type="button"
              class="h-cashier-btn h-cashier-btn-light"
              @click="openBranchSwitcher()"
            >
              <svg
                class=""
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.4492 9.50287V18.9461C18.4492 19.2205 18.2265 19.4431 17.9522 19.4431H9.00594V11.9879C9.00594 11.7136 8.78328 11.4909 8.50893 11.4909H4.53282C4.25847 11.4909 4.03581 11.7136 4.03581 11.9879V19.4431H2.04776C1.77341 19.4431 1.55075 19.2205 1.55075 18.9461V9.50287H1.71973C2.44537 9.50287 3.11137 9.1475 3.52389 8.58339C3.53383 8.59333 3.54129 8.60824 3.54874 8.62067C3.97617 9.17981 4.62477 9.50287 5.33053 9.50287H5.95677C6.70974 9.50287 7.37822 9.13011 7.78577 8.55357C7.81808 8.59333 7.85038 8.63558 7.88518 8.67534C8.35485 9.20217 9.03079 9.50287 9.73655 9.50287H10.2634C10.9691 9.50287 11.6451 9.20217 12.1148 8.67534C12.1495 8.63558 12.1818 8.59333 12.2142 8.55357C12.6217 9.13011 13.2902 9.50287 14.0432 9.50287H14.6694C15.3752 9.50287 16.0238 9.17981 16.4512 8.62067C16.4586 8.60824 16.4661 8.59333 16.476 8.58339C16.8886 9.1475 17.5546 9.50287 18.2802 9.50287H18.4492ZM15.9641 15.964V11.9879C15.9641 11.7136 15.7415 11.4909 15.4671 11.4909H11.988C11.7137 11.4909 11.491 11.7136 11.491 11.9879V15.964C11.491 16.2384 11.7137 16.461 11.988 16.461H15.4671C15.7415 16.461 15.9641 16.2384 15.9641 15.964ZM3.5137 0.556641C3.12081 0.556641 2.76495 0.788 2.60541 1.14684L0.109413 6.76184C-0.0705056 7.16815 -0.0270169 7.61422 0.228696 7.97903C0.46925 8.32197 0.877049 8.50884 1.29578 8.50884H1.71973C2.27639 8.50884 2.76843 8.1336 2.91753 7.59931L4.06812 3.45174L4.87328 0.556641H3.5137ZM5.90458 0.556641L4.13273 6.93331C4.02836 7.31104 4.10539 7.70617 4.34147 8.01928C4.57756 8.32992 4.93789 8.50884 5.33053 8.50884H5.95677C6.59294 8.50884 7.12226 8.03419 7.19184 7.40299L7.95476 0.556641H5.90458ZM11.0462 0.556641H8.95375L8.25296 6.85379C8.20823 7.27377 8.34243 7.69623 8.62572 8.01183C8.91151 8.3324 9.30663 8.50884 9.73655 8.50884H10.2634C10.6933 8.50884 11.0884 8.3324 11.3742 8.01183C11.6575 7.69623 11.7917 7.27377 11.747 6.85379L11.0462 0.556641ZM14.0953 0.556641H12.0452L12.8081 7.40299C12.8777 8.03419 13.407 8.50884 14.0432 8.50884H14.6694C15.062 8.50884 15.4224 8.32992 15.6585 8.01928C15.8945 7.70617 15.9716 7.31104 15.8672 6.93331L14.0953 0.556641ZM17.3945 1.14684C17.235 0.788 16.8789 0.556641 16.4862 0.556641H15.1266L15.9318 3.45174L17.0824 7.59931C17.2315 8.1336 17.7235 8.50884 18.2802 8.50884H18.7041C19.1231 8.50884 19.5309 8.32197 19.7712 7.97903C20.0272 7.61422 20.0704 7.1679 19.8905 6.76184L17.3945 1.14684Z"
                  fill="currentColor"
                />
              </svg>
              <span class="d-none d-md-block">{{ logged_in_branch_name }}</span>
            </button>

            <span v-else type="button" class="h-cashier-btn btn btn-light">
              <svg
                class="me-0"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.4492 9.50287V18.9461C18.4492 19.2205 18.2265 19.4431 17.9522 19.4431H9.00594V11.9879C9.00594 11.7136 8.78328 11.4909 8.50893 11.4909H4.53282C4.25847 11.4909 4.03581 11.7136 4.03581 11.9879V19.4431H2.04776C1.77341 19.4431 1.55075 19.2205 1.55075 18.9461V9.50287H1.71973C2.44537 9.50287 3.11137 9.1475 3.52389 8.58339C3.53383 8.59333 3.54129 8.60824 3.54874 8.62067C3.97617 9.17981 4.62477 9.50287 5.33053 9.50287H5.95677C6.70974 9.50287 7.37822 9.13011 7.78577 8.55357C7.81808 8.59333 7.85038 8.63558 7.88518 8.67534C8.35485 9.20217 9.03079 9.50287 9.73655 9.50287H10.2634C10.9691 9.50287 11.6451 9.20217 12.1148 8.67534C12.1495 8.63558 12.1818 8.59333 12.2142 8.55357C12.6217 9.13011 13.2902 9.50287 14.0432 9.50287H14.6694C15.3752 9.50287 16.0238 9.17981 16.4512 8.62067C16.4586 8.60824 16.4661 8.59333 16.476 8.58339C16.8886 9.1475 17.5546 9.50287 18.2802 9.50287H18.4492ZM15.9641 15.964V11.9879C15.9641 11.7136 15.7415 11.4909 15.4671 11.4909H11.988C11.7137 11.4909 11.491 11.7136 11.491 11.9879V15.964C11.491 16.2384 11.7137 16.461 11.988 16.461H15.4671C15.7415 16.461 15.9641 16.2384 15.9641 15.964ZM3.5137 0.556641C3.12081 0.556641 2.76495 0.788 2.60541 1.14684L0.109413 6.76184C-0.0705056 7.16815 -0.0270169 7.61422 0.228696 7.97903C0.46925 8.32197 0.877049 8.50884 1.29578 8.50884H1.71973C2.27639 8.50884 2.76843 8.1336 2.91753 7.59931L4.06812 3.45174L4.87328 0.556641H3.5137ZM5.90458 0.556641L4.13273 6.93331C4.02836 7.31104 4.10539 7.70617 4.34147 8.01928C4.57756 8.32992 4.93789 8.50884 5.33053 8.50884H5.95677C6.59294 8.50884 7.12226 8.03419 7.19184 7.40299L7.95476 0.556641H5.90458ZM11.0462 0.556641H8.95375L8.25296 6.85379C8.20823 7.27377 8.34243 7.69623 8.62572 8.01183C8.91151 8.3324 9.30663 8.50884 9.73655 8.50884H10.2634C10.6933 8.50884 11.0884 8.3324 11.3742 8.01183C11.6575 7.69623 11.7917 7.27377 11.747 6.85379L11.0462 0.556641ZM14.0953 0.556641H12.0452L12.8081 7.40299C12.8777 8.03419 13.407 8.50884 14.0432 8.50884H14.6694C15.062 8.50884 15.4224 8.32992 15.6585 8.01928C15.8945 7.70617 15.9716 7.31104 15.8672 6.93331L14.0953 0.556641ZM17.3945 1.14684C17.235 0.788 16.8789 0.556641 16.4862 0.556641H15.1266L15.9318 3.45174L17.0824 7.59931C17.2315 8.1336 17.7235 8.50884 18.2802 8.50884H18.7041C19.1231 8.50884 19.5309 8.32197 19.7712 7.97903C20.0272 7.61422 20.0704 7.1679 19.8905 6.76184L17.3945 1.14684Z"
                  fill="currentColor"
                />
              </svg>
              <span class="d-none d-md-block">{{ logged_in_branch_name }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="col-auto">
        <div class="row align-items-center">
        
          <div class="col-auto" v-if="user_type != 1 && user_type != 4 && isAuthorized('A_CLOSE_ORDER') || isAuthorized('A_HOLD_ORDER')">
            <a href="/cashier" class="h-cashier-btn text-white">
              <svg
                class=""
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_85_129)">
                  <path
                    d="M2.5 0C1.80859 0 1.25 0.558594 1.25 1.25V3.75C1.25 4.44141 1.80859 5 2.5 5H5.625V6.25H3.39844C2.16406 6.25 1.11328 7.15234 0.925781 8.375L0.0429688 14.2227C0.015625 14.4062 0 14.5938 0 14.7812V17.5C0 18.8789 1.12109 20 2.5 20H17.5C18.8789 20 20 18.8789 20 17.5V14.7812C20 14.5938 19.9844 14.4062 19.957 14.2188L19.0703 8.375C18.8867 7.15234 17.8359 6.25 16.6016 6.25H8.125V5H11.25C11.9414 5 12.5 4.44141 12.5 3.75V1.25C12.5 0.558594 11.9414 0 11.25 0H2.5ZM3.75 1.875H10C10.3438 1.875 10.625 2.15625 10.625 2.5C10.625 2.84375 10.3438 3.125 10 3.125H3.75C3.40625 3.125 3.125 2.84375 3.125 2.5C3.125 2.15625 3.40625 1.875 3.75 1.875ZM2.5 16.875C2.5 16.5312 2.78125 16.25 3.125 16.25H16.875C17.2188 16.25 17.5 16.5312 17.5 16.875C17.5 17.2188 17.2188 17.5 16.875 17.5H3.125C2.78125 17.5 2.5 17.2188 2.5 16.875ZM4.375 8.4375C4.89453 8.4375 5.3125 8.85547 5.3125 9.375C5.3125 9.89453 4.89453 10.3125 4.375 10.3125C3.85547 10.3125 3.4375 9.89453 3.4375 9.375C3.4375 8.85547 3.85547 8.4375 4.375 8.4375ZM7.1875 9.375C7.1875 8.85547 7.60547 8.4375 8.125 8.4375C8.64453 8.4375 9.0625 8.85547 9.0625 9.375C9.0625 9.89453 8.64453 10.3125 8.125 10.3125C7.60547 10.3125 7.1875 9.89453 7.1875 9.375ZM6.25 11.5625C6.76953 11.5625 7.1875 11.9805 7.1875 12.5C7.1875 13.0195 6.76953 13.4375 6.25 13.4375C5.73047 13.4375 5.3125 13.0195 5.3125 12.5C5.3125 11.9805 5.73047 11.5625 6.25 11.5625ZM10.9375 9.375C10.9375 8.85547 11.3555 8.4375 11.875 8.4375C12.3945 8.4375 12.8125 8.85547 12.8125 9.375C12.8125 9.89453 12.3945 10.3125 11.875 10.3125C11.3555 10.3125 10.9375 9.89453 10.9375 9.375ZM10 11.5625C10.5195 11.5625 10.9375 11.9805 10.9375 12.5C10.9375 13.0195 10.5195 13.4375 10 13.4375C9.48047 13.4375 9.0625 13.0195 9.0625 12.5C9.0625 11.9805 9.48047 11.5625 10 11.5625ZM14.6875 9.375C14.6875 8.85547 15.1055 8.4375 15.625 8.4375C16.1445 8.4375 16.5625 8.85547 16.5625 9.375C16.5625 9.89453 16.1445 10.3125 15.625 10.3125C15.1055 10.3125 14.6875 9.89453 14.6875 9.375ZM13.75 11.5625C14.2695 11.5625 14.6875 11.9805 14.6875 12.5C14.6875 13.0195 14.2695 13.4375 13.75 13.4375C13.2305 13.4375 12.8125 13.0195 12.8125 12.5C12.8125 11.9805 13.2305 11.5625 13.75 11.5625Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_85_129">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span class="d-none d-md-block">{{ $t("Cashier") }}</span>
            </a>
          </div>

          <div class="col-auto" v-if="user_type == 1 || user_type == 4">
            <span
              type="button"
              class="h-cashier-btn btn btn-light border border-0"
              v-if="user_type == 1"
            >
              <Icon icon="eos-icons:admin-outlined" class="fs-3" />
              <span class="d-none d-md-block">{{ $t("Administrator") }}</span>
            </span>

            <span
              type="button"
              class="h-cashier-btn btn btn-light border border-0"
              v-else
            >
              <Icon icon="eos-icons:admin-outlined" class="fs-3" />
              <span class="d-none d-md-block"> {{ authStore.user.name }}</span>
            </span>
          </div>

          <div class="col-auto">
            <ul class="header-icon-list">
              <!-- <li class="dropdown">
                <a
                  href="#"
                  class="btn-icon"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                  data-bs-auto-close="outside"
                >
                  <svg
                    width="17"
                    height="19"
                    viewBox="0 0 17 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.803901 14.4444C0.80215 14.1782 0.895302 13.9063 1.10542 13.6788C1.14744 13.6334 1.19174 13.5865 1.23787 13.5376C1.93438 12.8003 3.04796 11.6213 3.04796 8.23786C3.04796 5.4978 4.95583 3.30435 7.52837 2.76621V2.0313C7.52837 1.40817 8.02985 0.902832 8.6483 0.902832C9.26675 0.902832 9.76823 1.40817 9.76823 2.0313V2.76621C12.3408 3.30435 14.2486 5.4978 14.2486 8.23786C14.2486 11.6213 15.3622 12.8003 16.0587 13.5376C16.1049 13.5865 16.1492 13.6334 16.1912 13.6788C16.4013 13.9059 16.4945 14.1782 16.4927 14.4444C16.4892 15.0228 16.0381 15.5729 15.3686 15.5729H1.92803C1.25846 15.5729 0.807753 15.0228 0.803901 14.4444ZM0.803901 14.4444L1.60388 14.4391M0.803901 14.4444L1.60388 14.4392C1.60448 14.5256 1.63997 14.6144 1.69975 14.6782C1.75287 14.7348 1.82498 14.7729 1.92803 14.7729H15.3686C15.4717 14.7729 15.5439 14.7347 15.597 14.6781C15.6568 14.6144 15.6922 14.5257 15.6927 14.4396L15.6927 14.4392C15.6932 14.3685 15.671 14.2945 15.604 14.2221L16.1907 13.6793L15.6037 14.2218C15.5662 14.1812 15.5249 14.1377 15.4805 14.0908C15.1533 13.7455 14.6558 13.2205 14.2479 12.3889C13.7825 11.4399 13.4486 10.1372 13.4486 8.23786C13.4486 5.89354 11.8232 4.0134 9.60443 3.54926L8.96823 3.41618V2.76621V2.0313C8.96823 1.84425 8.81919 1.70283 8.6483 1.70283C8.47742 1.70283 8.32837 1.84425 8.32837 2.0313V2.76621V3.41618L7.69218 3.54926C5.47336 4.0134 3.84796 5.89354 3.84796 8.23786C3.84796 10.1372 3.51409 11.4399 3.04868 12.3889C2.64083 13.2205 2.1433 13.7455 1.81614 14.0908C1.77176 14.1376 1.73052 14.1811 1.69306 14.2217L1.60388 14.4391M1.60388 14.4391C1.60343 14.3689 1.62542 14.295 1.69294 14.2218L1.60388 14.4391ZM9.85229 17.5013C9.59382 17.8982 9.149 18.1583 8.6483 18.1583C8.14761 18.1583 7.70278 17.8982 7.44431 17.5013H9.85229Z"
                      stroke="currentColor"
                      stroke-width="0.9"
                    />
                  </svg>
                  <span
                    v-if="unread_notification_count > 0"
                    class="notification-status-dot"
                    style="background: #dc3545"
                  ></span>
                </a>
                <div class="dropdown-menu notification-dropdown">
                  <div
                    class="row align-items-center justify-content-between mb-3"
                  >
                    <div class="col-auto">
                      <p
                        class="mb-0 text-danger"
                        v-if="unread_notification_count > 0"
                      >
                        {{ unread_notification_count }}
                        {{ $t("Unread notifications") }}
                      </p>
                    </div>
                    <div
                      class="col-auto"
                      v-if="notifications && unread_notification_count > 0"
                    >
                      <span
                        role="button"
                        @click="markAllAsRead()"
                        class="fs-6 fw-semibold"
                        ><u> {{ $t("Mark All as Read") }}</u></span
                      >
                    </div>
                  </div>
                  <div class="notification-items" data-simplebar>
                    <div v-if="!notifications" class="text-center p-5">
                      <p>No Notifications</p>
                    </div>
                    <div
                      v-else
                      class="item"
                      v-for="item in notifications"
                      :class="{ readed: item.is_read }"
                      @click="readNotification(item)"
                    >
                      <div
                        class="icon bg-success text-light"
                        v-html="item.svg_icon"
                      ></div>
                      <div class="text">
                        <h5>
                          <a
                            href="#"
                            class="lh-base"
                            :class="[ item.data.time_sensitive ? 'text-danger' : 'text-primary' ]"
                            >
                            {{ item.notification }} <Icon v-if="item.data.time_sensitive" icon="material-symbols:alarm-outline" /> </a>
                        </h5>
                      </div>
                      <div
                        class="row align-items-center justify-content-between"
                      >
                        <div class="col-auto text-muted">
                          {{ item.time_ago }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="notification-dropdown-footer"
                    v-if="notifications"
                  >
                    <router-link to="/notifications">
                      {{ $t("View All Notications") }}
                    </router-link>
                  </div>
                </div>
              </li> -->
              <li>
                <a
                  href="#"
                  class="dropdown btn-icon"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                  data-bs-auto-close="outside"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.64468 10.4711C7.6126 10.3105 6.50784 4.78668 6.4728 4.61164C6.41807 4.33777 6.17757 4.14062 5.89827 4.14062H4.72639C4.4471 4.14062 4.20659 4.33777 4.15186 4.61164C4.11628 4.78965 3.01038 10.3191 2.97999 10.471C2.91651 10.7884 3.12233 11.097 3.43964 11.1605C3.75694 11.2239 4.06565 11.0181 4.12909 10.7008L4.50362 8.82813H6.12104L6.49557 10.7009C6.55905 11.0183 6.86788 11.224 7.18503 11.1605C7.50233 11.097 7.70815 10.7884 7.64468 10.4711ZM4.738 7.65625L5.20675 5.3125H5.41792L5.88667 7.65625H4.738Z"
                      fill="currentColor"
                    />
                    <path
                      d="M17.0312 8.82812H15.2734V8.24219C15.2734 7.91859 15.0111 7.65625 14.6875 7.65625C14.3639 7.65625 14.1016 7.91859 14.1016 8.24219V8.82812H12.3438C12.0202 8.82812 11.7578 9.09047 11.7578 9.41406C11.7578 9.73766 12.0202 10 12.3438 10H12.4855C12.8194 11.0786 13.3221 11.9065 13.8752 12.5699C13.425 12.9817 12.9695 13.3194 12.5637 13.644C12.311 13.8462 12.27 14.2149 12.4722 14.4676C12.6745 14.7204 13.0432 14.7611 13.2957 14.5591C13.7038 14.2326 14.1929 13.8698 14.6875 13.4159C15.1825 13.8702 15.6725 14.2336 16.0793 14.5591C16.332 14.7612 16.7007 14.7202 16.9028 14.4676C17.105 14.2149 17.064 13.8461 16.8113 13.644C16.4066 13.3202 15.9505 12.9821 15.4998 12.5699C16.0529 11.9065 16.5556 11.0786 16.8895 10H17.0312C17.3548 10 17.6172 9.73766 17.6172 9.41406C17.6172 9.09047 17.3548 8.82812 17.0312 8.82812ZM14.6875 11.7088C14.3135 11.2393 13.977 10.6788 13.7233 9.99609H15.6516C15.398 10.6788 15.0615 11.2393 14.6875 11.7088Z"
                      fill="currentColor"
                    />
                    <path
                      d="M18.2422 3.55469H9.78902L9.53785 1.53977C9.42813 0.661953 8.67828 0 7.79363 0H1.75781C0.788555 0 0 0.788555 0 1.75781V14.6875C0 15.6568 0.788555 16.4453 1.75781 16.4453H6.69855L6.94652 18.4602C7.05605 19.3363 7.8059 20 8.69078 20H18.2422C19.2114 20 20 19.2114 20 18.2422V5.3125C20 4.34324 19.2114 3.55469 18.2422 3.55469ZM1.75781 15.2734C1.43473 15.2734 1.17188 15.0106 1.17188 14.6875V1.75781C1.17188 1.43473 1.43473 1.17188 1.75781 1.17188H7.79363C8.08852 1.17188 8.33848 1.3925 8.375 1.68492C8.45992 2.36602 9.98469 14.5978 10.0689 15.2734H1.75781ZM8.07516 18.0371L7.87926 16.4453H9.45129L8.07516 18.0371ZM18.8281 18.2422C18.8281 18.5653 18.5653 18.8281 18.2422 18.8281H8.94039L11.171 16.2479C11.2852 16.1191 11.3364 15.9482 11.3128 15.7782L9.93512 4.72656H18.2422C18.5653 4.72656 18.8281 4.98941 18.8281 5.3125V18.2422Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <div class="dropdown-menu">
                  <div class="col-auto" role="button">
                    <p class="p-2" @click="switchLanguage('en')">English</p>
                  </div>
                  <div class="col-auto" role="button">
                    <p class="p-2" @click="switchLanguage('ar')">عربي</p>
                  </div>
                </div>
              </li>
              <li class="btn-hover-wrap position-relative">
                <a href="#" class="d-flex align-items-center">
                    <span class="btn btn-icon">
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6667 16.5V14.8333C14.6667 13.9493 14.3155 13.1014 13.6904 12.4763C13.0652 11.8512 12.2174 11.5 11.3333 11.5H4.66666C3.78261 11.5 2.93476 11.8512 2.30964 12.4763C1.68452 13.1014 1.33333 13.9493 1.33333 14.8333V16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.99447 8.16667C9.83542 8.16667 11.3278 6.67428 11.3278 4.83333C11.3278 2.99238 9.83542 1.5 7.99447 1.5C6.15352 1.5 4.66113 2.99238 4.66113 4.83333C4.66113 6.67428 6.15352 8.16667 7.99447 8.16667Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </span>
                    <b class="fs-6 d-none d-md-block">{{ authStore.user.name }}</b>
                </a>
                <div class="submenu">
                  <ul
                    class="inner-submenu"
                    v-if="user_type != 1 && user_type != 4"
                  >
                    <li>
                      <router-link :to="'/user/' + authStore.user.slack">{{
                        $t("My Profile")
                      }}</router-link>
                    </li>

                    <li>
                      <router-link
                        :to="
                          '/branch/edit/' + authStore.user.login_branch.slack
                        "
                      >
                        My Store</router-link
                      >
                    </li>
                    <li>
                      <a @click="openActivityLog()" href="#">Activity Log</a>
                    </li>
                  </ul>
                  <hr v-if="user_type != 1 && user_type != 4" />
                  <ul class="inner-submenu">
                    <li>
                      <a
                        href="#"
                        :disabled="is_processing"
                        @click="signOut"
                        class="text-danger"
                      >
                        <clip-loader
                          v-if="is_processing"
                          :color="'white'"
                          :size="'20px'"
                          class="pt-2 pe-2"
                        >
                        </clip-loader>
                        <span class="pt-0" v-if="is_processing">
                          {{ $t("Signing Out...") }}
                        </span>
                        <span class="pt-0" v-else>
                          {{ $t("Sign Out") }}
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <AsyncBranchSwitcher />
  </div>

  <AsyncActivityLogDrawer ref="activityLog" />

  <AsyncReleaseDetailModal :release_version="release_version" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useAuthStore } from "@/stores/auth";
// import { useNotificationStore } from "@/stores/notificationStore";
import flag_image from "@/assets/images/flag.png";
import logo_icon from "@/assets/images/logo-icon.png";
import { useSettingStore } from "@/stores/settingStore";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { signOut, isAuthorized } = useGlobalFunctions();

const authStore = useAuthStore();
const settingStore = useSettingStore();
const logo = computed(() => {
  return settingStore.logo;
});

const lang = ref("en");

// const notificationStore = useNotificationStore();
// const notifications = computed(() => {
//   return notificationStore.notifications;
// });
// const unread_notification_count = computed(() => {
//   return notificationStore.unread_notification_count;
// });

onMounted(() => {
  lang.value = localStorage.getItem("language");
});

onUpdated(() => {
  if(authStore.open_branch_change_modal){
    //openBranchSwitcher();
  }
});

const is_processing = ref(false);

function openBranchSwitcher() {
  $("#BranchSwitcherModal").modal("show");
}

const AsyncBranchSwitcher = defineAsyncComponent(() =>
  import("@/components/common/BranchSwitcher.vue")
);

const AsyncActivityLogDrawer = defineAsyncComponent(() =>
  import("@/components/common/ActivityLogDrawer.vue")
);

const AsyncReleaseDetailModal = defineAsyncComponent(() =>
  import("@/components/common/ReleaseDetailModal.vue")
);
const my_branches = computed(() => {
  return authStore.user.branches;
});
const logged_in_branch_name = computed(() => {
  return lang.value == "ar" &&
    authStore.user.login_branch.name_ar != "" &&
    authStore.user.login_branch.name_ar != null &&
    authStore.user.login_branch.name_ar != "null"
    ? authStore.user.login_branch.name_ar
    : authStore.user.login_branch.name;
});
const user_type = computed(() => {
  return authStore.user.user_type;
});

const activityLog = ref(null);
function openActivityLog() {
  activityLog.value.getActivityLogs();
}

const release_version = ref("");

async function readNotification(item) {
  let form_data = new FormData();
  form_data.append("notification_id", item.id);
  axios.post("/api/v2/notification/read", form_data).then((resp) => {
    if (resp.data.status_code == 200) {
      if (item.name == "VERSION_RELEASED") {
        release_version.value = resp.data.data.release_version;
        $("#releaseDetailModal").modal("show");
      } else if (item.data.url != undefined && item.data.url != "") {
        location.href = item.data.url;
      }
    }
  });
}

async function markAllAsRead() {
  var is_confirmed = false;

  await Swal.fire({
    title: t("Do you really want to mark all as read?"),
    showCancelButton: true,
    confirmButtonText: t("Yes"),
    confirmButtonColor: "#d33",
    cancelButtonText: t("Cancel"),
  }).then((result) => {
    if (result.isConfirmed) {
      is_confirmed = true;
    }
  });

  if (is_confirmed) {
    axios.post("/api/v2/notification/read/all").then((resp) => {
      if (resp.data.status_code == 200) {
        location.reload();
      }
    });
  }
}

async function switchLanguage(language)
    {
        localStorage.setItem('language',language);
        window.location.reload();
        
  }

</script>
