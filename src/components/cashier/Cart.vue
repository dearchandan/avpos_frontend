<template>
  <div v-if="layout == 2" class="spm-rightbar-content">
    <div class="spm-order-items">
      <div class="cart_item" v-for="(item, index) in cart">
      <div class="cart-item-top-content">
        <h2>
          <img
            v-if="item.dietary"
            src="/src/assets/images/veg_icon.svg"
            alt=""
          />
          <img v-else src="/src/assets/images/nonveg_icon.svg" alt="" />
          <span class="fs-5 fw-bold"> {{ item.name }} </span>
          <span v-if="item.is_gift_item">
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6816 4.51562H12.8933C13.1698 4.14813 13.334 3.69153 13.334 3.19727C13.334 1.98569 12.3483 1 11.1367 1C10.4069 1 9.86875 1.26147 9.4431 1.82286C9.08699 2.29255 8.8266 2.94833 8.5 3.7769C8.1734 2.9483 7.91301 2.29255 7.5569 1.82286C7.13125 1.26147 6.5931 1 5.86328 1C4.65171 1 3.66602 1.98569 3.66602 3.19727C3.66602 3.69153 3.83017 4.14813 4.10667 4.51562H2.31836C1.59142 4.51562 1 5.10704 1 5.83398V6.71289C1 7.28579 1.36741 7.77426 1.87891 7.95566V14.6816C1.87891 15.4086 2.47032 16 3.19727 16H13.8027C14.5297 16 15.1211 15.4086 15.1211 14.6816V7.95566C15.6326 7.77426 16 7.28579 16 6.71289V5.83398C16 5.10704 15.4086 4.51562 14.6816 4.51562ZM9.30666 4.12715C9.97987 2.4192 10.2358 1.87891 11.1367 1.87891C11.8637 1.87891 12.4551 2.47032 12.4551 3.19727C12.4551 3.92421 11.8637 4.51562 11.1367 4.51562H9.15294C9.20679 4.38042 9.25814 4.25025 9.30666 4.12715ZM5.86328 1.87891C6.76419 1.87891 7.02013 2.4192 7.69334 4.12715C7.74186 4.25025 7.79321 4.38042 7.84706 4.51562H5.86328C5.13634 4.51562 4.54492 3.92421 4.54492 3.19727C4.54492 2.47032 5.13634 1.87891 5.86328 1.87891ZM6.74219 15.1211H3.19727C2.95495 15.1211 2.75781 14.924 2.75781 14.6816V8.03125H6.74219V15.1211ZM6.74219 7.15234H2.31836C2.07604 7.15234 1.87891 6.95521 1.87891 6.71289V5.83398C1.87891 5.59167 2.07604 5.39453 2.31836 5.39453H6.74219V7.15234ZM9.37891 15.1211H7.62109V5.39453C7.71317 5.39453 8.87383 5.39453 9.37891 5.39453V15.1211ZM14.2422 14.6816C14.2422 14.924 14.045 15.1211 13.8027 15.1211H10.2578V8.03125H14.2422V14.6816ZM15.1211 6.71289C15.1211 6.95521 14.924 7.15234 14.6816 7.15234H10.2578V5.39453H14.6816C14.924 5.39453 15.1211 5.59167 15.1211 5.83398V6.71289Z"
                fill="#793693"
                stroke="#793693"
                stroke-width="0.3"
              />
            </svg>
          </span>

          <!--<a
            role="button"
            @click="customizeProduct(item)"
            class="c_link"
            v-if="item.product.product_modifiers || item.product.discounts"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.625 2.32568H2.25C1.91848 2.32568 1.60054 2.45738 1.36612 2.6918C1.1317 2.92622 1 3.24416 1 3.57568V12.3257C1 12.6572 1.1317 12.9751 1.36612 13.2096C1.60054 13.444 1.91848 13.5757 2.25 13.5757H11C11.3315 13.5757 11.6495 13.444 11.8839 13.2096C12.1183 12.9751 12.25 12.6572 12.25 12.3257V7.95068"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.3125 1.38833C11.5611 1.13968 11.8984 1 12.25 1C12.6016 1 12.9389 1.13968 13.1875 1.38833C13.4361 1.63697 13.5758 1.97419 13.5758 2.32583C13.5758 2.67746 13.4361 3.01468 13.1875 3.26333L7.25 9.20083L4.75 9.82583L5.375 7.32583L11.3125 1.38833Z"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
            >{{ $t("Customize") }}
          </a>-->

          <a
            v-if="item.prices != ''"
            class="cart_top_price"
            :role="[
              item.product.price_type == 2 && !item.is_gift_item
                ? 'button'
                : '',
            ]"
            @click="
              [
                item.product.price_type == 2 && !item.is_gift_item
                  ? openOpenPriceModal(item)
                  : '',
              ]
            "
          >
            <span class="">
              <small
                class="pe-2 text-success"
                style="font-size: 11px"
                v-if="item.prices.product_discount_amount > 0"
              >
                <img
                  src="/src/assets/images/discount-tag-icon.svg"
                  style="width: 20px"
                  alt=""
                />
                <!-- {{ item.prices.product_discount_amount }} {{ currency_symbol }} -->
              </small>
              <span>
                <u v-if="item.product.price_type == 2 && !item.is_gift_item"
                  > 
                  <s v-if="item.is_gift_item">{{ item.prices.initial_product_rate  }}</s>
                  {{ item.prices.product_rate }} {{ currency_symbol }}</u
                >
                <span v-else
                  > 
                  <s v-if="item.is_gift_item">{{ item.prices.initial_product_rate  }}</s>
                  {{ item.prices.product_rate }} {{ currency_symbol }}</span
                >
              </span>
            </span>
          </a>
        </h2>
        <a role="button" class="remove-item" @click="removeItem(index)">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4H3.33333H14"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.6615 3.9987V13.332C12.6615 13.6857 12.521 14.0248 12.2709 14.2748C12.0209 14.5249 11.6817 14.6654 11.3281 14.6654H4.66146C4.30784 14.6654 3.9687 14.5249 3.71865 14.2748C3.4686 14.0248 3.32813 13.6857 3.32812 13.332V3.9987M5.32813 3.9987V2.66536C5.32813 2.31174 5.4686 1.9726 5.71865 1.72256C5.9687 1.47251 6.30784 1.33203 6.66146 1.33203H9.32813C9.68175 1.33203 10.0209 1.47251 10.2709 1.72256C10.521 1.9726 10.6615 2.31174 10.6615 2.66536V3.9987"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.67188 7.33203V11.332"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.32812 7.33203V11.332"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
        
      </div>
      <div class="cart-item-bottom-content">
        <div class="row align-items-center">
          <div class="col-auto">
            <div>
              <div class="quantity-selector">
                <button
                  type="button"
                  class="quantity-selector__button minus"
                  @click="decreaseQty(item, 1)"
                >
                  <svg
                    focusable="false"
                    width="10"
                    height="2"
                    class="icon icon--minus-big"
                    viewBox="0 0 10 2"
                  >
                    <path fill="currentColor" d="M0 0h10v2H0z"></path>
                  </svg>
                </button>
                <input
                  type="text"
                  form="product-form-template--16096598982880__main-7697358684384"
                  is="input-number"
                  class="quantity-selector__input"
                  inputmode="numeric"
                  name="quantity"
                  autocomplete="off"
                  min="1"
                  size="2"
                  readonly
                  aria-label="Quantity"
                  :value="item.product_quantity"
                />
                <button
                  type="button"
                  class="quantity-selector__button add"
                  @click="increaseQty(item, 1)"
                >
                  <svg
                    focusable="false"
                    width="10"
                    height="10"
                    class="icon icon--plus-big"
                    viewBox="0 0 10 10"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4 6v4h2V6h4V4H6V0H4v4H0v2h4z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="col-auto">
            <label for="is_gift_item ">
              <div class="form-check form-switch pt-1">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="is_gift_item"
                  v-model="item.is_gift_item"
                  @change="MarkItemAsGift(item)"
                />
                <label class="form-check-label" for="is_gift_item">{{
                  $t("Gift")
                }}</label>
              </div>
            </label>
          </div>
          <div class="col-auto">
            <a
              :href="'#c_notes' + index"
              data-bs-toggle="collapse"
              class="item-edit"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_137_28)">
                  <path
                    d="M3.17081 0.0233512C2.26768 0.152843 1.46085 0.770421 1.10225 1.61378C0.883114 2.13175 0.896395 1.68019 0.896395 8.50011C0.896395 15.32 0.883114 14.8685 1.10225 15.3864C1.36124 15.9941 1.82608 16.4722 2.43038 16.7478C2.92179 16.9769 2.92843 16.9769 4.44913 16.9901C5.39542 17.0001 5.8669 16.9935 5.94991 16.9702C6.4214 16.8275 6.56749 16.1866 6.20225 15.848C6.02296 15.6786 5.96651 15.672 4.67159 15.672C3.98761 15.672 3.38331 15.6587 3.2837 15.6388C2.8919 15.5657 2.53331 15.2835 2.34737 14.9083L2.24112 14.6925V8.50011V2.30773L2.34737 2.09191C2.53331 1.71671 2.8919 1.43448 3.2837 1.36144C3.39991 1.34152 4.9339 1.32823 7.62003 1.32823C10.3062 1.32823 11.8401 1.34152 11.9564 1.36144C12.3482 1.43448 12.7067 1.71671 12.8927 2.09191L12.9989 2.30773L13.0155 4.59874C13.0288 6.21905 13.0421 6.913 13.072 6.97608C13.311 7.51066 14.0183 7.54718 14.2806 7.03253C14.3403 6.913 14.3437 6.80343 14.3437 4.61534C14.3437 2.62648 14.337 2.29112 14.2905 2.08527C14.0681 1.10909 13.3708 0.381945 12.3681 0.0797965C12.1821 0.0233512 11.9099 0.0200309 7.71964 0.0133903C5.27257 0.0100699 3.22725 0.0167106 3.17081 0.0233512Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.91797 4.05742C3.83828 4.10059 3.72539 4.19023 3.67227 4.25996C3.57598 4.37949 3.56934 4.40937 3.56934 4.64844C3.56934 4.8875 3.57598 4.91738 3.67227 5.03691C3.72539 5.10664 3.83828 5.19629 3.91797 5.23613L4.06406 5.3125H7.61016C10.7379 5.3125 11.1729 5.30586 11.2824 5.2627C11.8236 5.03359 11.8236 4.26328 11.2824 4.03418C11.1729 3.99102 10.7379 3.98437 7.61016 3.98437H4.06406L3.91797 4.05742Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.91797 6.71367C3.83828 6.75684 3.72539 6.84648 3.67227 6.91621C3.57598 7.03574 3.56934 7.06562 3.56934 7.30469C3.56934 7.54375 3.57598 7.57363 3.67227 7.69316C3.72539 7.76289 3.83828 7.85254 3.91797 7.89238L4.06406 7.96875H7.61016C10.7379 7.96875 11.1729 7.96211 11.2824 7.91895C11.8236 7.68984 11.8236 6.91953 11.2824 6.69043C11.1729 6.64727 10.7379 6.64062 7.61016 6.64062H4.06406L3.91797 6.71367Z"
                    fill="currentColor"
                  />
                  <path
                    d="M13.6961 9.08124C13.4604 9.13437 13.2213 9.2373 13.0155 9.37343C12.8063 9.50956 9.04106 13.2715 8.96469 13.4142C8.93149 13.4807 8.72231 14.1314 8.49985 14.8586C8.13461 16.0605 8.09809 16.2066 8.10805 16.3926C8.11801 16.5619 8.13793 16.6217 8.22094 16.7246C8.37035 16.9105 8.57621 17.0101 8.78207 16.9869C8.93481 16.9736 11.083 16.3926 11.5877 16.2299L11.8036 16.1601L13.7061 14.2642C15.7215 12.2588 15.8577 12.1027 16.0071 11.6644C16.0735 11.4752 16.0868 11.3723 16.0868 11.0236C16.0868 10.5223 16.0204 10.2898 15.768 9.91132C15.3164 9.2373 14.4864 8.90526 13.6961 9.08124ZM14.3702 10.4094C14.8217 10.5986 14.918 11.183 14.5528 11.5283L14.4565 11.6213L13.995 11.1564L13.5334 10.6949L13.6297 10.5887C13.8289 10.3795 14.1211 10.3064 14.3702 10.4094ZM12.3016 13.7795L11.0731 15.0047L10.4123 15.1873C10.0471 15.2902 9.74496 15.3666 9.74164 15.3633C9.73832 15.36 9.82465 15.0644 9.93422 14.7092L10.1301 14.0617L11.3653 12.8432L12.6004 11.6279L13.0653 12.0894L13.5301 12.551L12.3016 13.7795Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.91797 9.36992C3.83828 9.41309 3.72539 9.50273 3.67227 9.57246C3.57598 9.69199 3.56934 9.72187 3.56934 9.96094C3.56934 10.2 3.57598 10.2299 3.67227 10.3494C3.72539 10.4191 3.83828 10.5088 3.91797 10.5486L4.06406 10.625H6.27539C8.35391 10.625 8.49004 10.6184 8.61621 10.5619C9.1375 10.3195 9.1375 9.60234 8.61621 9.35996C8.49004 9.30352 8.35391 9.29687 6.27539 9.29687H4.06406L3.91797 9.36992Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_137_28">
                    <rect width="17" height="17" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Add Note</a
            >
          </div>

          <div class="col-auto" style="cursor: pointer;" @click="clone(index)">
            <Icon icon="cil:clone" v-tippy="'Duplicate Item'" class="fs-5 text-primary" />
          </div>
          
          
          <div
            class="col-auto"
            v-if="item.product.discounts.length && !item.is_gift_item"
          >
            <a href="#" v-tippy="labels.discounts" @click="customizeProductDiscount(item)">
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.4388 10.2332C17.3664 10.085 17.3664 9.91503 17.4388 9.76688L18.1102 8.39352C18.4839 7.62884 18.1878 6.71743 17.436 6.31851L16.0856 5.60204C15.9399 5.52476 15.8401 5.38723 15.8115 5.22485L15.5475 3.71916C15.4004 2.88083 14.6249 2.3175 13.7823 2.43671L12.2688 2.65081C12.1054 2.67387 11.9439 2.62135 11.8254 2.5067L10.7267 1.44387C10.115 0.85206 9.15661 0.852025 8.5449 1.44387L7.44621 2.50681C7.32767 2.62149 7.16612 2.67391 7.00279 2.65091L5.48923 2.43682C4.64636 2.31753 3.87118 2.88094 3.72412 3.71927L3.46003 5.22488C3.43152 5.3873 3.33164 5.5248 3.18599 5.60211L1.83565 6.31858C1.08381 6.71746 0.787659 7.62895 1.16144 8.39362L1.83274 9.76695C1.90516 9.91513 1.90516 10.0851 1.83274 10.2332L1.1614 11.6065C0.787624 12.3712 1.08378 13.2826 1.83562 13.6816L3.18596 14.398C3.33164 14.4753 3.43152 14.6128 3.46003 14.7752L3.72412 16.2809C3.85799 17.0441 4.51239 17.5793 5.26447 17.5792C5.33855 17.5792 5.41371 17.574 5.48926 17.5633L7.00283 17.3492C7.16605 17.3261 7.3277 17.3787 7.44625 17.4933L8.5449 18.5562C8.85083 18.8521 9.24324 19 9.63579 19C10.0282 19 10.4209 18.852 10.7267 18.5562L11.8254 17.4933C11.9439 17.3787 12.1055 17.3263 12.2688 17.3492L13.7823 17.5633C14.6253 17.6826 15.4004 17.1192 15.5475 16.2809L15.8116 14.7753C15.8401 14.6128 15.94 14.4753 16.0856 14.398L17.436 13.6816C18.1878 13.2827 18.4839 12.3712 18.1102 11.6065L17.4388 10.2332ZM16.9494 12.7644L15.599 13.4809C15.1685 13.7094 14.8732 14.1157 14.789 14.5958L14.5249 16.1015C14.4752 16.3851 14.213 16.5756 13.9278 16.5354L12.4142 16.3213C11.9315 16.2529 11.4539 16.4082 11.1035 16.7471L10.0049 17.8099C9.79793 18.0101 9.47368 18.0101 9.26669 17.8099L8.16803 16.7471C7.87195 16.4607 7.48488 16.3054 7.0808 16.3054C7.00676 16.3054 6.93213 16.3106 6.85739 16.3212L5.34382 16.5353C5.05885 16.5756 4.79641 16.3851 4.74663 16.1014L4.4825 14.5957C4.39827 14.1157 4.10303 13.7093 3.67248 13.4809L2.32214 12.7644C2.06775 12.6294 1.96756 12.3211 2.09401 12.0624L2.76535 10.689C2.97938 10.2511 2.97938 9.74888 2.76535 9.31098L2.09401 7.93761C1.96756 7.6789 2.06775 7.37055 2.32214 7.23559L3.67248 6.51911C4.103 6.29063 4.39827 5.8843 4.48247 5.40421L4.74656 3.89856C4.79634 3.61492 5.05853 3.42438 5.34375 3.46467L6.85732 3.67877C7.33983 3.74707 7.81763 3.59179 8.16796 3.25292L9.26665 2.19009C9.47358 1.98991 9.79782 1.98991 10.0048 2.19009L11.1035 3.25292C11.4538 3.59183 11.9315 3.74707 12.4141 3.67877L13.9277 3.46467C14.2127 3.42434 14.4751 3.61492 14.5249 3.89856L14.789 5.40425C14.8732 5.88434 15.1684 6.2907 15.599 6.51911L16.9493 7.23559C17.2037 7.37055 17.3039 7.6789 17.1775 7.93761L16.5061 9.31094C16.2921 9.74881 16.2921 10.2511 16.5061 10.689L17.1775 12.0623C17.3039 12.3211 17.2038 12.6295 16.9494 12.7644Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.3"
                />
                <path
                  d="M13.428 6.20721C13.2254 6.0045 12.8967 6.0045 12.6939 6.20721L5.84246 13.0587C5.63975 13.2614 5.63975 13.5901 5.84246 13.7928C5.94382 13.8942 6.07667 13.9449 6.20949 13.9449C6.34231 13.9449 6.4752 13.8942 6.57652 13.7928L13.428 6.94133C13.6308 6.73859 13.6308 6.40995 13.428 6.20721Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.3"
                />
                <path
                  d="M7.55906 5.32861C6.50959 5.32861 5.65576 6.18244 5.65576 7.23192C5.65576 8.28139 6.50959 9.13522 7.55906 9.13522C8.60854 9.13522 9.46237 8.28139 9.46237 7.23192C9.46237 6.18244 8.60854 5.32861 7.55906 5.32861ZM7.55906 8.09703C7.08203 8.09703 6.69395 7.70894 6.69395 7.23188C6.69395 6.75485 7.08203 6.36677 7.55906 6.36677C8.03609 6.36677 8.42421 6.75485 8.42421 7.23188C8.42418 7.70894 8.03609 8.09703 7.55906 8.09703Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.3"
                />
                <path
                  d="M11.7124 10.8657C10.6629 10.8657 9.80908 11.7196 9.80908 12.769C9.80908 13.8185 10.6629 14.6723 11.7124 14.6723C12.7619 14.6723 13.6157 13.8185 13.6157 12.769C13.6157 11.7196 12.7619 10.8657 11.7124 10.8657ZM11.7124 13.6341C11.2354 13.6341 10.8472 13.2461 10.8472 12.769C10.8472 12.292 11.2353 11.9039 11.7124 11.9039C12.1894 11.9039 12.5775 12.292 12.5775 12.769C12.5775 13.2461 12.1894 13.6341 11.7124 13.6341Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.3"
                />
              </svg>
            </a>
          </div>

          <div
            class="col-auto"
            v-if="item.product.product_modifiers.length && !item.is_gift_item"
          >
            <a href="#" v-tippy="labels.modifiers" @click="customizeProduct(item)">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8 2.4C12.8 1.92533 12.9408 1.46131 13.2045 1.06663C13.4682 0.671954 13.843 0.36434 14.2816 0.18269C14.7201 0.00103989 15.2027 -0.0464881 15.6682 0.0461164C16.1338 0.138721 16.5614 0.367299 16.897 0.702945C17.2327 1.03859 17.4613 1.46623 17.5539 1.93178C17.6465 2.39734 17.599 2.8799 17.4173 3.31844C17.2357 3.75698 16.928 4.13181 16.5334 4.39553C16.1387 4.65924 15.6747 4.8 15.2 4.8C14.5635 4.8 13.953 4.54714 13.5029 4.09706C13.0528 3.64697 12.8 3.03652 12.8 2.4ZM0.8 3.2H10.4C10.6122 3.2 10.8157 3.11571 10.9657 2.96569C11.1157 2.81566 11.2 2.61217 11.2 2.4C11.2 2.18783 11.1157 1.98434 10.9657 1.83432C10.8157 1.68429 10.6122 1.6 10.4 1.6H0.8C0.587827 1.6 0.384343 1.68429 0.234314 1.83432C0.0842854 1.98434 0 2.18783 0 2.4C0 2.61217 0.0842854 2.81566 0.234314 2.96569C0.384343 3.11571 0.587827 3.2 0.8 3.2ZM5.6 5.6C5.10484 5.60139 4.62224 5.7559 4.21835 6.04235C3.81445 6.3288 3.50905 6.73316 3.344 7.2H0.8C0.587827 7.2 0.384343 7.28428 0.234314 7.43431C0.0842854 7.58434 0 7.78782 0 8C0 8.21217 0.0842854 8.41565 0.234314 8.56568C0.384343 8.71571 0.587827 8.8 0.8 8.8H3.344C3.49076 9.2151 3.74888 9.58183 4.09011 9.86006C4.43135 10.1383 4.84254 10.3173 5.27869 10.3775C5.71484 10.4376 6.15914 10.3767 6.56296 10.2013C6.96679 10.0258 7.31458 9.74272 7.56827 9.38287C7.82196 9.02303 7.97178 8.60033 8.00132 8.16104C8.03087 7.72175 7.939 7.28279 7.73578 6.89222C7.53256 6.50164 7.22581 6.1745 6.84911 5.94658C6.47241 5.71866 6.04028 5.59876 5.6 5.6ZM16.8 7.2H10.4C10.1878 7.2 9.98434 7.28428 9.83431 7.43431C9.68428 7.58434 9.6 7.78782 9.6 8C9.6 8.21217 9.68428 8.41565 9.83431 8.56568C9.98434 8.71571 10.1878 8.8 10.4 8.8H16.8C17.0122 8.8 17.2156 8.71571 17.3657 8.56568C17.5157 8.41565 17.6 8.21217 17.6 8C17.6 7.78782 17.5157 7.58434 17.3657 7.43431C17.2156 7.28428 17.0122 7.2 16.8 7.2ZM7.2 12.8H0.8C0.587827 12.8 0.384343 12.8843 0.234314 13.0343C0.0842854 13.1843 0 13.3878 0 13.6C0 13.8122 0.0842854 14.0157 0.234314 14.1657C0.384343 14.3157 0.587827 14.4 0.8 14.4H7.2C7.41217 14.4 7.61565 14.3157 7.76568 14.1657C7.91571 14.0157 8 13.8122 8 13.6C8 13.3878 7.91571 13.1843 7.76568 13.0343C7.61565 12.8843 7.41217 12.8 7.2 12.8ZM16.8 12.8H14.256C14.0673 12.2662 13.6959 11.8164 13.2076 11.5299C12.7193 11.2434 12.1454 11.1388 11.5874 11.2346C11.0294 11.3303 10.5232 11.6202 10.1583 12.0531C9.7934 12.4859 9.59325 13.0338 9.59325 13.6C9.59325 14.1661 9.7934 14.7141 10.1583 15.1469C10.5232 15.5798 11.0294 15.8697 11.5874 15.9654C12.1454 16.0612 12.7193 15.9566 13.2076 15.6701C13.6959 15.3836 14.0673 14.9338 14.256 14.4H16.8C17.0122 14.4 17.2156 14.3157 17.3657 14.1657C17.5157 14.0157 17.6 13.8122 17.6 13.6C17.6 13.3878 17.5157 13.1843 17.3657 13.0343C17.2156 12.8843 17.0122 12.8 16.8 12.8Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>

          <div class="collapse" :id="'c_notes' + index">
            <div class="c_notes_field field mb-0">
              <textarea
                class="form-control form-control-solid"
                placeholder="enter notes"
                v-model="item.note"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>

  <div v-if="layout == 2" class="spm-rightbar-bottom position-relative">
    <div class="checkoutamounts_wrap m-0">
      <div class="text-center" v-if="cashierStore.grandTotal.total > 0">
        <button
          type="button"
          class="btn checkoutamount_toggle_btn"
          data-bs-target="#checkoutamounts"
          data-bs-toggle="collapse"
        >
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevrons-up"
            >
              <polyline points="17 11 12 6 7 11"></polyline>
              <polyline points="17 18 12 13 7 18"></polyline>
            </svg>
            {{ $t("Show Breakup") }}
          </span>
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevrons-down"
            >
              <polyline points="7 13 12 18 17 13"></polyline>
              <polyline points="7 6 12 11 17 6"></polyline></svg
            >Hide Breakup</span
          >
        </button>
      </div>
      <div class="collapse" id="checkoutamounts">
        <div class="checkout-data-table">
          <table class="table py-0 px-2">
            <tbody>
              <tr>
                <td>{{ $t("Sub Total") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.subtotal }}</b>
                </td>
              </tr>
              <tr
                v-if="
                  additional_fee != null &&
                  additional_fee.tax_type != 0
                "
              >
                <td>
                  <span v-if="additional_fee.tax_type == 1">{{
                    $t("Tobacco Tax")
                  }}</span>
                  <span v-if="additional_fee.tax_type == 2">
                    <span v-if="additional_fee.fee_name != ''">{{
                      additional_fee.fee_name
                    }}</span>
                    <span v-else>{{ $t("Additional Product Fee") }}</span>
                  </span>
                </td>
                <td align="right">
                  <b>
                    {{
                      cashierStore.grandTotal.grand_product_additional_fee
                    }}
                    {{ currency_symbol }}</b
                  >
                </td>
              </tr>
              <tr>
                <td>{{ $t("Tax") }}</td>
                <td align="right">
                  <b>
                    {{ cashierStore.grandTotal.grand_product_tax }}
                    {{ currency_symbol }}</b
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row align-items-center justify-content-between mb-3 gx-0">
      <div class="col-auto">
        <div class="row align-items-center gx-2">
          <div class="col-auto">
            <h3>{{ $t("Total") }}</h3>
          </div>
          <div class="col-auto">
            <h6>({{ $t("Items") }} : {{ cashierStore.cartItemCount }})</h6>
          </div>
        </div>
      </div>
      <div class="col-auto">
        <h3>
          {{ cashierStore.grandTotal.grand_product_amount }}
          {{ currency_symbol }}
        </h3>
      </div>
    </div>
    <div class="row g-3">
      <div class="col-7" v-if="isAuthorized('A_CLOSE_ORDER')">
        <button
          class="btn btn-lg btn-primary w-100"
          :class="{ disabled: cart.length == 0 }"
          @click="payNow('CLOSE')"
        >
          {{ $t("Pay Now") }}
        </button>
      </div>

      <div
        class="col-5"
        v-if="
          !edit_mode ||
          (edit_mode && edit_order != '' && edit_order.order_status == '3')
          && isAuthorized('A_HOLD_ORDER')
        "
      >
        <button
          type="button"
          class="btn btn-danger btn-lg w-100"
          :class="{ disabled: cart.length == 0 }"
          @click="payNow('HOLD')"
        >
          <span>{{ $t("Hold") }}</span>
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="layout == 1"
    class="row align-items-center justify-content-between mb-2"
  >
    <div class="col-auto">
      <h6 class="mb-0 fw-normal">
        {{ $t("Total Items") }} : {{ cashierStore.cartItemCount }}
      </h6>
    </div>
    <div class="col-auto" v-if="!cashierStore.isCartEmpty">
      <u class="text-danger"
        ><a href="#" class="text-danger" @click="clearCart()">{{
          $t("Clear Cart")
        }}</a></u
      >
    </div>
  </div>
  <div v-if="layout == 1" class="cart_item_wrap" data-simplebar>
    <div class="cart_item" v-for="(item, index) in cart">
      <div class="cart-item-top-content">
        <h2>
          <img
            v-if="item.dietary"
            src="/src/assets/images/veg_icon.svg"
            alt=""
          />
          <img v-else src="/src/assets/images/nonveg_icon.svg" alt="" />
          <span class="fs-5 fw-bold"> {{ item.name }} </span>
          <span v-if="item.is_gift_item">
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6816 4.51562H12.8933C13.1698 4.14813 13.334 3.69153 13.334 3.19727C13.334 1.98569 12.3483 1 11.1367 1C10.4069 1 9.86875 1.26147 9.4431 1.82286C9.08699 2.29255 8.8266 2.94833 8.5 3.7769C8.1734 2.9483 7.91301 2.29255 7.5569 1.82286C7.13125 1.26147 6.5931 1 5.86328 1C4.65171 1 3.66602 1.98569 3.66602 3.19727C3.66602 3.69153 3.83017 4.14813 4.10667 4.51562H2.31836C1.59142 4.51562 1 5.10704 1 5.83398V6.71289C1 7.28579 1.36741 7.77426 1.87891 7.95566V14.6816C1.87891 15.4086 2.47032 16 3.19727 16H13.8027C14.5297 16 15.1211 15.4086 15.1211 14.6816V7.95566C15.6326 7.77426 16 7.28579 16 6.71289V5.83398C16 5.10704 15.4086 4.51562 14.6816 4.51562ZM9.30666 4.12715C9.97987 2.4192 10.2358 1.87891 11.1367 1.87891C11.8637 1.87891 12.4551 2.47032 12.4551 3.19727C12.4551 3.92421 11.8637 4.51562 11.1367 4.51562H9.15294C9.20679 4.38042 9.25814 4.25025 9.30666 4.12715ZM5.86328 1.87891C6.76419 1.87891 7.02013 2.4192 7.69334 4.12715C7.74186 4.25025 7.79321 4.38042 7.84706 4.51562H5.86328C5.13634 4.51562 4.54492 3.92421 4.54492 3.19727C4.54492 2.47032 5.13634 1.87891 5.86328 1.87891ZM6.74219 15.1211H3.19727C2.95495 15.1211 2.75781 14.924 2.75781 14.6816V8.03125H6.74219V15.1211ZM6.74219 7.15234H2.31836C2.07604 7.15234 1.87891 6.95521 1.87891 6.71289V5.83398C1.87891 5.59167 2.07604 5.39453 2.31836 5.39453H6.74219V7.15234ZM9.37891 15.1211H7.62109V5.39453C7.71317 5.39453 8.87383 5.39453 9.37891 5.39453V15.1211ZM14.2422 14.6816C14.2422 14.924 14.045 15.1211 13.8027 15.1211H10.2578V8.03125H14.2422V14.6816ZM15.1211 6.71289C15.1211 6.95521 14.924 7.15234 14.6816 7.15234H10.2578V5.39453H14.6816C14.924 5.39453 15.1211 5.59167 15.1211 5.83398V6.71289Z"
                fill="#793693"
                stroke="#793693"
                stroke-width="0.3"
              />
            </svg>
          </span>

          <!--<a
            role="button"
            @click="customizeProduct(item)"
            class="c_link"
            v-if="item.product.product_modifiers || item.product.discounts"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.625 2.32568H2.25C1.91848 2.32568 1.60054 2.45738 1.36612 2.6918C1.1317 2.92622 1 3.24416 1 3.57568V12.3257C1 12.6572 1.1317 12.9751 1.36612 13.2096C1.60054 13.444 1.91848 13.5757 2.25 13.5757H11C11.3315 13.5757 11.6495 13.444 11.8839 13.2096C12.1183 12.9751 12.25 12.6572 12.25 12.3257V7.95068"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.3125 1.38833C11.5611 1.13968 11.8984 1 12.25 1C12.6016 1 12.9389 1.13968 13.1875 1.38833C13.4361 1.63697 13.5758 1.97419 13.5758 2.32583C13.5758 2.67746 13.4361 3.01468 13.1875 3.26333L7.25 9.20083L4.75 9.82583L5.375 7.32583L11.3125 1.38833Z"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
            >{{ $t("Customize") }}
          </a>-->

          <a
            v-if="item.prices != ''"
            class="cart_top_price"
            :role="[
              item.product.price_type == 2 && !item.is_gift_item
                ? 'button'
                : '',
            ]"
            @click="
              [
                item.product.price_type == 2 && !item.is_gift_item
                  ? openOpenPriceModal(item)
                  : '',
              ]
            "
          >
            <span class="">
              <small
                class="pe-2 text-success"
                style="font-size: 11px"
                v-if="item.prices.product_discount_amount > 0"
              >
                <img
                  src="/src/assets/images/discount-tag-icon.svg"
                  style="width: 20px"
                  alt=""
                />
                <!-- {{ item.prices.product_discount_amount }} {{ currency_symbol }} -->
              </small>
              <span>
                <u v-if="item.product.price_type == 2 && !item.is_gift_item"
                  > 
                  <s v-if="item.is_gift_item">{{ item.prices.initial_product_rate  }}</s>
                  {{ item.prices.product_rate }} {{ currency_symbol }}</u
                >
                <span v-else
                  > 
                  <s v-if="item.is_gift_item">{{ item.prices.initial_product_rate  }}</s>
                  {{ item.prices.product_rate }} {{ currency_symbol }}</span
                >
              </span>
            </span>
          </a>
        </h2>
        <a role="button" class="remove-item" @click="removeItem(index)">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4H3.33333H14"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.6615 3.9987V13.332C12.6615 13.6857 12.521 14.0248 12.2709 14.2748C12.0209 14.5249 11.6817 14.6654 11.3281 14.6654H4.66146C4.30784 14.6654 3.9687 14.5249 3.71865 14.2748C3.4686 14.0248 3.32813 13.6857 3.32812 13.332V3.9987M5.32813 3.9987V2.66536C5.32813 2.31174 5.4686 1.9726 5.71865 1.72256C5.9687 1.47251 6.30784 1.33203 6.66146 1.33203H9.32813C9.68175 1.33203 10.0209 1.47251 10.2709 1.72256C10.521 1.9726 10.6615 2.31174 10.6615 2.66536V3.9987"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.67188 7.33203V11.332"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.32812 7.33203V11.332"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
        <div class="modifier_name_wrap" data-simplebar>
          <ul v-if="item.modifiers.length">
            <li v-for="modifier in item.modifiers">
              {{ modifier.option_name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="cart-item-bottom-content">
        <div class="row align-items-center">
          <div class="col-auto">
            <div>
              <div class="quantity-selector">
                <button
                  type="button"
                  class="quantity-selector__button minus"
                  @click="decreaseQty(item.cart_id, 1)"
                >
                  <svg
                    focusable="false"
                    width="10"
                    height="2"
                    class="icon icon--minus-big"
                    viewBox="0 0 10 2"
                  >
                    <path fill="currentColor" d="M0 0h10v2H0z"></path>
                  </svg>
                </button>
                <input
                  type="text"
                  form="product-form-template--16096598982880__main-7697358684384"
                  is="input-number"
                  class="quantity-selector__input"
                  inputmode="numeric"
                  name="quantity"
                  autocomplete="off"
                  min="1"
                  size="2"
                  readonly
                  aria-label="Quantity"
                  :value="item.product_quantity"
                />
                <button
                  type="button"
                  class="quantity-selector__button add"
                  @click="increaseQty(item.cart_id, 1)"
                >
                  <svg
                    focusable="false"
                    width="10"
                    height="10"
                    class="icon icon--plus-big"
                    viewBox="0 0 10 10"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4 6v4h2V6h4V4H6V0H4v4H0v2h4z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <label for="is_gift_item ">
              <div class="form-check form-switch pt-1">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="is_gift_item"
                  v-model="item.is_gift_item"
                  @change="MarkItemAsGift(item.cart_id)"
                />
                <label class="form-check-label" for="is_gift_item">{{
                  $t("Gift")
                }}</label>
              </div>
            </label>
          </div>
          <div class="col-auto">
            <a
              :href="'#c_notes' + index"
              data-bs-toggle="collapse"
              class="item-edit"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_137_28)">
                  <path
                    d="M3.17081 0.0233512C2.26768 0.152843 1.46085 0.770421 1.10225 1.61378C0.883114 2.13175 0.896395 1.68019 0.896395 8.50011C0.896395 15.32 0.883114 14.8685 1.10225 15.3864C1.36124 15.9941 1.82608 16.4722 2.43038 16.7478C2.92179 16.9769 2.92843 16.9769 4.44913 16.9901C5.39542 17.0001 5.8669 16.9935 5.94991 16.9702C6.4214 16.8275 6.56749 16.1866 6.20225 15.848C6.02296 15.6786 5.96651 15.672 4.67159 15.672C3.98761 15.672 3.38331 15.6587 3.2837 15.6388C2.8919 15.5657 2.53331 15.2835 2.34737 14.9083L2.24112 14.6925V8.50011V2.30773L2.34737 2.09191C2.53331 1.71671 2.8919 1.43448 3.2837 1.36144C3.39991 1.34152 4.9339 1.32823 7.62003 1.32823C10.3062 1.32823 11.8401 1.34152 11.9564 1.36144C12.3482 1.43448 12.7067 1.71671 12.8927 2.09191L12.9989 2.30773L13.0155 4.59874C13.0288 6.21905 13.0421 6.913 13.072 6.97608C13.311 7.51066 14.0183 7.54718 14.2806 7.03253C14.3403 6.913 14.3437 6.80343 14.3437 4.61534C14.3437 2.62648 14.337 2.29112 14.2905 2.08527C14.0681 1.10909 13.3708 0.381945 12.3681 0.0797965C12.1821 0.0233512 11.9099 0.0200309 7.71964 0.0133903C5.27257 0.0100699 3.22725 0.0167106 3.17081 0.0233512Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.91797 4.05742C3.83828 4.10059 3.72539 4.19023 3.67227 4.25996C3.57598 4.37949 3.56934 4.40937 3.56934 4.64844C3.56934 4.8875 3.57598 4.91738 3.67227 5.03691C3.72539 5.10664 3.83828 5.19629 3.91797 5.23613L4.06406 5.3125H7.61016C10.7379 5.3125 11.1729 5.30586 11.2824 5.2627C11.8236 5.03359 11.8236 4.26328 11.2824 4.03418C11.1729 3.99102 10.7379 3.98437 7.61016 3.98437H4.06406L3.91797 4.05742Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.91797 6.71367C3.83828 6.75684 3.72539 6.84648 3.67227 6.91621C3.57598 7.03574 3.56934 7.06562 3.56934 7.30469C3.56934 7.54375 3.57598 7.57363 3.67227 7.69316C3.72539 7.76289 3.83828 7.85254 3.91797 7.89238L4.06406 7.96875H7.61016C10.7379 7.96875 11.1729 7.96211 11.2824 7.91895C11.8236 7.68984 11.8236 6.91953 11.2824 6.69043C11.1729 6.64727 10.7379 6.64062 7.61016 6.64062H4.06406L3.91797 6.71367Z"
                    fill="currentColor"
                  />
                  <path
                    d="M13.6961 9.08124C13.4604 9.13437 13.2213 9.2373 13.0155 9.37343C12.8063 9.50956 9.04106 13.2715 8.96469 13.4142C8.93149 13.4807 8.72231 14.1314 8.49985 14.8586C8.13461 16.0605 8.09809 16.2066 8.10805 16.3926C8.11801 16.5619 8.13793 16.6217 8.22094 16.7246C8.37035 16.9105 8.57621 17.0101 8.78207 16.9869C8.93481 16.9736 11.083 16.3926 11.5877 16.2299L11.8036 16.1601L13.7061 14.2642C15.7215 12.2588 15.8577 12.1027 16.0071 11.6644C16.0735 11.4752 16.0868 11.3723 16.0868 11.0236C16.0868 10.5223 16.0204 10.2898 15.768 9.91132C15.3164 9.2373 14.4864 8.90526 13.6961 9.08124ZM14.3702 10.4094C14.8217 10.5986 14.918 11.183 14.5528 11.5283L14.4565 11.6213L13.995 11.1564L13.5334 10.6949L13.6297 10.5887C13.8289 10.3795 14.1211 10.3064 14.3702 10.4094ZM12.3016 13.7795L11.0731 15.0047L10.4123 15.1873C10.0471 15.2902 9.74496 15.3666 9.74164 15.3633C9.73832 15.36 9.82465 15.0644 9.93422 14.7092L10.1301 14.0617L11.3653 12.8432L12.6004 11.6279L13.0653 12.0894L13.5301 12.551L12.3016 13.7795Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.91797 9.36992C3.83828 9.41309 3.72539 9.50273 3.67227 9.57246C3.57598 9.69199 3.56934 9.72187 3.56934 9.96094C3.56934 10.2 3.57598 10.2299 3.67227 10.3494C3.72539 10.4191 3.83828 10.5088 3.91797 10.5486L4.06406 10.625H6.27539C8.35391 10.625 8.49004 10.6184 8.61621 10.5619C9.1375 10.3195 9.1375 9.60234 8.61621 9.35996C8.49004 9.30352 8.35391 9.29687 6.27539 9.29687H4.06406L3.91797 9.36992Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_137_28">
                    <rect width="17" height="17" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Add Note</a
            >
          </div>
          
          <div class="col-auto" style="cursor: pointer;" @click="clone(index)">
            <Icon icon="cil:clone" v-tippy="labels.duplicate" class="fs-5 text-primary" />
          </div>
          
          <div
            class="col-auto"
            v-if="item.product.discounts.length && !item.is_gift_item"
          >
            <a href="#" v-tippy="labels.discounts" @click="customizeProductDiscount(item)">
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.4388 10.2332C17.3664 10.085 17.3664 9.91503 17.4388 9.76688L18.1102 8.39352C18.4839 7.62884 18.1878 6.71743 17.436 6.31851L16.0856 5.60204C15.9399 5.52476 15.8401 5.38723 15.8115 5.22485L15.5475 3.71916C15.4004 2.88083 14.6249 2.3175 13.7823 2.43671L12.2688 2.65081C12.1054 2.67387 11.9439 2.62135 11.8254 2.5067L10.7267 1.44387C10.115 0.85206 9.15661 0.852025 8.5449 1.44387L7.44621 2.50681C7.32767 2.62149 7.16612 2.67391 7.00279 2.65091L5.48923 2.43682C4.64636 2.31753 3.87118 2.88094 3.72412 3.71927L3.46003 5.22488C3.43152 5.3873 3.33164 5.5248 3.18599 5.60211L1.83565 6.31858C1.08381 6.71746 0.787659 7.62895 1.16144 8.39362L1.83274 9.76695C1.90516 9.91513 1.90516 10.0851 1.83274 10.2332L1.1614 11.6065C0.787624 12.3712 1.08378 13.2826 1.83562 13.6816L3.18596 14.398C3.33164 14.4753 3.43152 14.6128 3.46003 14.7752L3.72412 16.2809C3.85799 17.0441 4.51239 17.5793 5.26447 17.5792C5.33855 17.5792 5.41371 17.574 5.48926 17.5633L7.00283 17.3492C7.16605 17.3261 7.3277 17.3787 7.44625 17.4933L8.5449 18.5562C8.85083 18.8521 9.24324 19 9.63579 19C10.0282 19 10.4209 18.852 10.7267 18.5562L11.8254 17.4933C11.9439 17.3787 12.1055 17.3263 12.2688 17.3492L13.7823 17.5633C14.6253 17.6826 15.4004 17.1192 15.5475 16.2809L15.8116 14.7753C15.8401 14.6128 15.94 14.4753 16.0856 14.398L17.436 13.6816C18.1878 13.2827 18.4839 12.3712 18.1102 11.6065L17.4388 10.2332ZM16.9494 12.7644L15.599 13.4809C15.1685 13.7094 14.8732 14.1157 14.789 14.5958L14.5249 16.1015C14.4752 16.3851 14.213 16.5756 13.9278 16.5354L12.4142 16.3213C11.9315 16.2529 11.4539 16.4082 11.1035 16.7471L10.0049 17.8099C9.79793 18.0101 9.47368 18.0101 9.26669 17.8099L8.16803 16.7471C7.87195 16.4607 7.48488 16.3054 7.0808 16.3054C7.00676 16.3054 6.93213 16.3106 6.85739 16.3212L5.34382 16.5353C5.05885 16.5756 4.79641 16.3851 4.74663 16.1014L4.4825 14.5957C4.39827 14.1157 4.10303 13.7093 3.67248 13.4809L2.32214 12.7644C2.06775 12.6294 1.96756 12.3211 2.09401 12.0624L2.76535 10.689C2.97938 10.2511 2.97938 9.74888 2.76535 9.31098L2.09401 7.93761C1.96756 7.6789 2.06775 7.37055 2.32214 7.23559L3.67248 6.51911C4.103 6.29063 4.39827 5.8843 4.48247 5.40421L4.74656 3.89856C4.79634 3.61492 5.05853 3.42438 5.34375 3.46467L6.85732 3.67877C7.33983 3.74707 7.81763 3.59179 8.16796 3.25292L9.26665 2.19009C9.47358 1.98991 9.79782 1.98991 10.0048 2.19009L11.1035 3.25292C11.4538 3.59183 11.9315 3.74707 12.4141 3.67877L13.9277 3.46467C14.2127 3.42434 14.4751 3.61492 14.5249 3.89856L14.789 5.40425C14.8732 5.88434 15.1684 6.2907 15.599 6.51911L16.9493 7.23559C17.2037 7.37055 17.3039 7.6789 17.1775 7.93761L16.5061 9.31094C16.2921 9.74881 16.2921 10.2511 16.5061 10.689L17.1775 12.0623C17.3039 12.3211 17.2038 12.6295 16.9494 12.7644Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.3"
                />
                <path
                  d="M13.428 6.20721C13.2254 6.0045 12.8967 6.0045 12.6939 6.20721L5.84246 13.0587C5.63975 13.2614 5.63975 13.5901 5.84246 13.7928C5.94382 13.8942 6.07667 13.9449 6.20949 13.9449C6.34231 13.9449 6.4752 13.8942 6.57652 13.7928L13.428 6.94133C13.6308 6.73859 13.6308 6.40995 13.428 6.20721Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.3"
                />
                <path
                  d="M7.55906 5.32861C6.50959 5.32861 5.65576 6.18244 5.65576 7.23192C5.65576 8.28139 6.50959 9.13522 7.55906 9.13522C8.60854 9.13522 9.46237 8.28139 9.46237 7.23192C9.46237 6.18244 8.60854 5.32861 7.55906 5.32861ZM7.55906 8.09703C7.08203 8.09703 6.69395 7.70894 6.69395 7.23188C6.69395 6.75485 7.08203 6.36677 7.55906 6.36677C8.03609 6.36677 8.42421 6.75485 8.42421 7.23188C8.42418 7.70894 8.03609 8.09703 7.55906 8.09703Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.3"
                />
                <path
                  d="M11.7124 10.8657C10.6629 10.8657 9.80908 11.7196 9.80908 12.769C9.80908 13.8185 10.6629 14.6723 11.7124 14.6723C12.7619 14.6723 13.6157 13.8185 13.6157 12.769C13.6157 11.7196 12.7619 10.8657 11.7124 10.8657ZM11.7124 13.6341C11.2354 13.6341 10.8472 13.2461 10.8472 12.769C10.8472 12.292 11.2353 11.9039 11.7124 11.9039C12.1894 11.9039 12.5775 12.292 12.5775 12.769C12.5775 13.2461 12.1894 13.6341 11.7124 13.6341Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.3"
                />
              </svg>
            </a>
          </div>
          

          <div
            class="col-auto"
            v-if="item.product.product_modifiers.length && !item.is_gift_item"
          >
            <a href="#" v-tippy="labels.modifiers" @click="customizeProduct(item)">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8 2.4C12.8 1.92533 12.9408 1.46131 13.2045 1.06663C13.4682 0.671954 13.843 0.36434 14.2816 0.18269C14.7201 0.00103989 15.2027 -0.0464881 15.6682 0.0461164C16.1338 0.138721 16.5614 0.367299 16.897 0.702945C17.2327 1.03859 17.4613 1.46623 17.5539 1.93178C17.6465 2.39734 17.599 2.8799 17.4173 3.31844C17.2357 3.75698 16.928 4.13181 16.5334 4.39553C16.1387 4.65924 15.6747 4.8 15.2 4.8C14.5635 4.8 13.953 4.54714 13.5029 4.09706C13.0528 3.64697 12.8 3.03652 12.8 2.4ZM0.8 3.2H10.4C10.6122 3.2 10.8157 3.11571 10.9657 2.96569C11.1157 2.81566 11.2 2.61217 11.2 2.4C11.2 2.18783 11.1157 1.98434 10.9657 1.83432C10.8157 1.68429 10.6122 1.6 10.4 1.6H0.8C0.587827 1.6 0.384343 1.68429 0.234314 1.83432C0.0842854 1.98434 0 2.18783 0 2.4C0 2.61217 0.0842854 2.81566 0.234314 2.96569C0.384343 3.11571 0.587827 3.2 0.8 3.2ZM5.6 5.6C5.10484 5.60139 4.62224 5.7559 4.21835 6.04235C3.81445 6.3288 3.50905 6.73316 3.344 7.2H0.8C0.587827 7.2 0.384343 7.28428 0.234314 7.43431C0.0842854 7.58434 0 7.78782 0 8C0 8.21217 0.0842854 8.41565 0.234314 8.56568C0.384343 8.71571 0.587827 8.8 0.8 8.8H3.344C3.49076 9.2151 3.74888 9.58183 4.09011 9.86006C4.43135 10.1383 4.84254 10.3173 5.27869 10.3775C5.71484 10.4376 6.15914 10.3767 6.56296 10.2013C6.96679 10.0258 7.31458 9.74272 7.56827 9.38287C7.82196 9.02303 7.97178 8.60033 8.00132 8.16104C8.03087 7.72175 7.939 7.28279 7.73578 6.89222C7.53256 6.50164 7.22581 6.1745 6.84911 5.94658C6.47241 5.71866 6.04028 5.59876 5.6 5.6ZM16.8 7.2H10.4C10.1878 7.2 9.98434 7.28428 9.83431 7.43431C9.68428 7.58434 9.6 7.78782 9.6 8C9.6 8.21217 9.68428 8.41565 9.83431 8.56568C9.98434 8.71571 10.1878 8.8 10.4 8.8H16.8C17.0122 8.8 17.2156 8.71571 17.3657 8.56568C17.5157 8.41565 17.6 8.21217 17.6 8C17.6 7.78782 17.5157 7.58434 17.3657 7.43431C17.2156 7.28428 17.0122 7.2 16.8 7.2ZM7.2 12.8H0.8C0.587827 12.8 0.384343 12.8843 0.234314 13.0343C0.0842854 13.1843 0 13.3878 0 13.6C0 13.8122 0.0842854 14.0157 0.234314 14.1657C0.384343 14.3157 0.587827 14.4 0.8 14.4H7.2C7.41217 14.4 7.61565 14.3157 7.76568 14.1657C7.91571 14.0157 8 13.8122 8 13.6C8 13.3878 7.91571 13.1843 7.76568 13.0343C7.61565 12.8843 7.41217 12.8 7.2 12.8ZM16.8 12.8H14.256C14.0673 12.2662 13.6959 11.8164 13.2076 11.5299C12.7193 11.2434 12.1454 11.1388 11.5874 11.2346C11.0294 11.3303 10.5232 11.6202 10.1583 12.0531C9.7934 12.4859 9.59325 13.0338 9.59325 13.6C9.59325 14.1661 9.7934 14.7141 10.1583 15.1469C10.5232 15.5798 11.0294 15.8697 11.5874 15.9654C12.1454 16.0612 12.7193 15.9566 13.2076 15.6701C13.6959 15.3836 14.0673 14.9338 14.256 14.4H16.8C17.0122 14.4 17.2156 14.3157 17.3657 14.1657C17.5157 14.0157 17.6 13.8122 17.6 13.6C17.6 13.3878 17.5157 13.1843 17.3657 13.0343C17.2156 12.8843 17.0122 12.8 16.8 12.8Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>


          <div class="collapse" :id="'c_notes' + index">
            <div class="c_notes_field field mb-0">
              <textarea
                class="form-control form-control-solid"
                placeholder="enter notes"
                v-model="item.note"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="layout == 1" class="restro-rightbar-bottom position-relative">
    <div class="checkoutamounts_wrap">
      <div class="text-center" v-if="cashierStore.grandTotal.total > 0">
        <button
          type="button"
          class="btn checkoutamount_toggle_btn"
          data-bs-target="#checkoutamounts"
          data-bs-toggle="collapse"
        >
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevrons-up"
            >
              <polyline points="17 11 12 6 7 11"></polyline>
              <polyline points="17 18 12 13 7 18"></polyline></svg
            >{{ $t("Show Breakup") }}</span
          >
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevrons-down"
            >
              <polyline points="7 13 12 18 17 13"></polyline>
              <polyline points="7 6 12 11 17 6"></polyline></svg
            >{{ $t("Hide Breakup") }}</span
          >
        </button>
      </div>
      <div class="collapse" id="checkoutamounts">
        <div class="checkout-data-table">
          <table class="table">
            <tbody>
              <tr>
                <td>{{ $t("Sub Total") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.subtotal }}</b>
                </td>
              </tr>

              <tr v-if="cashierStore.grandTotal.product_discount > 0">
                <td>{{ $t("Product Discount") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.product_discount }}</b>
                </td>
              </tr>

              <tr v-if="cashierStore.grandTotal.product_discount > 0">
                <td>{{ $t("Subtotal After Product Discount") }}</td>
                <td align="right">
                  <b>{{
                    cashierStore.grandTotal.subtotal_after_product_discount
                  }}</b>
                </td>
              </tr>

              <tr v-if="cashierStore.grandTotal.order_discount > 0">
                <td>{{ $t("Order Discount") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.order_discount }}</b>
                </td>
              </tr>

              <tr v-if="cashierStore.grandTotal.order_discount > 0">
                <td>{{ $t("Subtotal After Order Discount") }}</td>
                <td align="right">
                  <b>{{
                    cashierStore.grandTotal.subtotal_after_order_discount
                  }}</b>
                </td>
              </tr>

              <tr v-if="cashierStore.grandTotal.additional_fee > 0">
                <td>{{ $t("Additional Fee") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.additional_fee }}</b>
                </td>
              </tr>

              <tr v-if="cashierStore.grandTotal.tobacco_tax > 0">
                <td>{{ $t("Tobacco Tax") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.tobacco_tax }}</b>
                </td>
              </tr>

              <tr>
                <td>{{ $t("Tax") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.tax }}</b>
                </td>
              </tr>
<!-- 
              <tr>
                <td>{{ $t("Round Off") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.round_off }}</b>
                </td>
              </tr> -->

              <tr>
                <td>{{ $t("Total") }}</td>
                <td align="right">
                  <b>{{ cashierStore.grandTotal.total }}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="checkout-btn">
      <div class="row g-3">
        
        <div
          class="col-md-12"
          v-if="cashierStore.is_kds_present == false && isAuthorized('A_CLOSE_ORDER')"
        >
          <label class="text-danger text-center w-100">{{
            labels.kds_not_linked
          }}</label>
        </div>

        <div v-if="isAuthorized('A_CLOSE_ORDER')" :class="[edit_mode ? 'col-md-12' : 'col-6 col-md-7']">
          <button
            type="button"
            class="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-between"
            :class="{ disabled: cashierStore.isCartEmpty }"
            @click="payNow('CLOSE')"
          >
            {{ $t("Pay Now") }}
            <span class="fw-bold fs-4"
              >{{ cashierStore.grandTotal.total }} {{ currency_symbol }}</span
            >
          </button>
        </div>

        <div class="col-6 col-md-5" v-if="!edit_mode && isAuthorized('A_CLOSE_ORDER')">
          <button
            type="button"
            class="btn btn-primary btn-lg w-100"
            :class="{
              disabled:
                cashierStore.is_kds_present == false ||
                cashierStore.isCartEmpty,
            }"
            @click="payNow('SEND_TO_KITCHEN')"
          >
            {{ $t("Send To Kitchen") }}
          </button>
        </div>

        <div
          :class="[!edit_mode ? 'col-6 col-md-7' : 'col-md-8']"
          v-if="
            !edit_mode ||
            (edit_mode && edit_order != '' && edit_order.order_status == '4')
          "
        >
          <button
            v-if="isAuthorized('A_HOLD_ORDER')"
            type="button"
            class="btn btn-danger btn-lg w-100"
            :class="{
              disabled:
                cashierStore.is_kds_present == false ||
                cashierStore.isCartEmpty,
            }"
            @click="payNow('HOLD_AND_SEND_TO_KITCHEN')"
          >
            {{ $t("Hold & Send To Kitchen") }}
          </button>
        </div>

        <div
          :class="[!edit_mode ? 'col-6 col-md-5' : 'col-md-8']"
          v-if="
            !edit_mode ||
            (edit_mode && edit_order != '' && edit_order.order_status == '3') 
            "
        >
          <button
          v-if="isAuthorized('A_HOLD_ORDER')"
            type="button"
            class="btn btn-danger btn-lg w-100"
            :class="{ disabled: cashierStore.isCartEmpty }"
            @click="payNow('HOLD')"
          >
            <span>{{ $t("Hold") }}</span>
          </button>
        </div>

        <div class="col-md-4" v-if="edit_mode">
          <button
            type="button"
            class="btn btn-dark btn-lg w-100"
            @click="newOrder()"
          >
            <small>{{ $t("New Order") }}</small>
          </button>
        </div>
      </div>
    </div>
  </div>

  <AsyncSelectModifierDiscount
    @closeModifierModal="closeModifierDiscountModal"
    :product="selected_product"
  />
  <AsyncSelectDiscount :product="selected_product" />
  <AsyncOpenPriceModal :product="selected_product" />
</template>

<script setup>
import { useCashierStore } from "@/stores/cashierStore";
import { useAuthStore } from "@/stores/auth";
import { useMagicKeys, whenever } from "@vueuse/core";
import { useI18n } from 'vue-i18n'
import useGlobalFunctions from "@/composables/global_functions.js";

const { isAuthorized } = useGlobalFunctions();
const cashierStore = useCashierStore();
const authStore = useAuthStore();
const { t } = useI18n();

const currency_symbol = computed(() => {
  return authStore.user.currency.symbol;
});

const cart = computed(() => {
  return cashierStore.cart;
});

const edit_mode = computed(() => {
  return cashierStore.edit_mode;
});

const edit_order = computed(() => {
  return cashierStore.edit_order;
});

function increaseQty(cart_id, increment_by = 1) {
  cashierStore.increaseCartItemQty(cart_id, increment_by);
}

function decreaseQty(cart_id, decrement_by = 1) {
  cashierStore.decreaseCartItemQty(cart_id, decrement_by);
}

function removeItem(index) {
  cashierStore.removeItemFromCart(index);
}

function clearCart() {
  cashierStore.clearCart();
}

function newOrder() {
  cashierStore.newOrder();
}

const selected_product = ref("");
function customizeProduct(product) {
  selected_product.value = product;
  $("#modifierDiscountModal").modal("show");
}

function customizeProductDiscount(product) {
  selected_product.value = product;
  $("#discountModal").modal("show");
}

function openOpenPriceModal(product) {
  selected_product.value = product;
  $("#OpenPriceModal").modal("show");
}

function closeModifierDiscountModal() {
  $("#modifierDiscountModal").modal("hide");
}

const emits = defineEmits(["payNow"]);

function payNow(action) {
  if (cart.value.length > 0) {
    if (action == "HOLD_AND_SEND_TO_KITCHEN") {
      if (cashierStore.is_kds_present) {
        cashierStore.setActionType(action);
        emits("payNow");
      }
    } else {
      cashierStore.setActionType(action);
      emits("payNow");
    }
  }
}
const AsyncSelectDiscount = defineAsyncComponent(() =>
  import("@/components/cashier/SelectDiscount.vue")
);
const AsyncSelectModifierDiscount = defineAsyncComponent(() =>
  import("@/components/cashier/SelectModifierDiscount.vue")
);
const AsyncOpenPriceModal = defineAsyncComponent(() =>
  import("@/components/cashier/OpenPriceModal.vue")
);

const labels = ref({
  kds_not_linked: t("KDS not linked with product's categories"),
  duplicate: t('Duplicate'),
  discounts: t('Discounts'),
  modifiers: t('Modifiers'),
});

const additional_fee = computed(() => {
  return authStore.user.additional_fee;
});

//KEYBOARD SORTCUTS
const { alt_p, alt_h, alt_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {},
});
whenever(alt_p, () => payNow("CLOSE"));
whenever(alt_h, () => payNow("HOLD"));
whenever(alt_k, () => payNow("HOLD_AND_SEND_TO_KITCHEN"));

const layout = computed(() => {
  return authStore.user.merchant.layout;
});

function MarkItemAsGift(cart_id) {
  cashierStore.markItemAsGift(cart_id);
}

function clone(index){
  cashierStore.cloneItem(index);
}


</script>
