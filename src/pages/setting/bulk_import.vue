<template>
  <DefaultLayout>
    <template v-slot:subheader>
      <div class="header-nav-wrap">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="header-back-link">
              <router-link class="text-primary" to="/settings"
                ><Icon icon="fa6-solid:chevron-left" />
                {{ $t("Settings") }}</router-link
              >
            </div>
          </div>
          <div class="col-auto">
            <h5 class="fw-bold">{{ $t("Bulk Import") }}</h5>
          </div>
        </div>
      </div>
    </template>

    <div class="content p-0">
      <div class="row g-0 align-items-start">
        <div class="col-lg-auto content-sidebar-sticky">
          <div class="content-sidebar">
            <nav class="d-none d-lg-block">
              <ul>
                <li class=""><a href="#ImportCategories">Categories</a></li>
                <li class=""><a href="#ImportProducts">Products</a></li>
                <li class=""><a href="#ImportIngredients">Ingredients</a></li>
                <li class=""><a href="#ImportInventories">Inventory</a></li>
                <li class=""><a href="#ImportCustomers">Customers</a></li>
                <li class=""><a href="#ImportSuppliers">Suppliers</a></li>
                <li class=""><a href="#ImportUsers">Users</a></li>
                <li class=""><a href="#ImportDiscounts">Discounts</a></li>
                <li class=""><a href="#ImportDiscounts">Dine In</a></li>
              </ul>
            </nav>
            <div class="sidebarbottom-nav">
              <a
                href="javascript:;"
                class="btn w-lg-100 btn-primary"
                @click="downloadMasterData"
              >
                {{ $t("Download Master Data") }}
                <clip-loader
                  v-if="form.is_processing"
                  loading="loading"
                  :color="'white'"
                  :size="'10px'"
                  class="pt-1 pe-1"
                >
                </clip-loader>
                <svg
                  class="ms-3 me-0"
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.25 15.75C0.836 15.75 0.5 15.414 0.5 15V11.25C0.5 10.836 0.836 10.5 1.25 10.5C1.664 10.5 2 10.836 2 11.25V15C2 15.414 1.664 15.75 1.25 15.75Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.5 18C1.84588 18 0.5 16.6541 0.5 15C0.5 14.586 0.836 14.25 1.25 14.25C1.664 14.25 2 14.586 2 15C2 15.8273 2.67275 16.5 3.5 16.5C3.914 16.5 4.25 16.836 4.25 17.25C4.25 17.664 3.914 18 3.5 18Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.75 15.75C17.336 15.75 17 15.414 17 15V11.25C17 10.836 17.336 10.5 17.75 10.5C18.164 10.5 18.5 10.836 18.5 11.25V15C18.5 15.414 18.164 15.75 17.75 15.75Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15.5 18H3.5C3.086 18 2.75 17.664 2.75 17.25C2.75 16.836 3.086 16.5 3.5 16.5H15.5C15.914 16.5 16.25 16.836 16.25 17.25C16.25 17.664 15.914 18 15.5 18Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15.5 18C15.086 18 14.75 17.664 14.75 17.25C14.75 16.836 15.086 16.5 15.5 16.5C16.3273 16.5 17 15.8273 17 15C17 14.586 17.336 14.25 17.75 14.25C18.164 14.25 18.5 14.586 18.5 15C18.5 16.6541 17.1541 18 15.5 18Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.5 13.5C9.086 13.5 8.75 13.164 8.75 12.75V0.75C8.75 0.336 9.086 0 9.5 0C9.914 0 10.25 0.336 10.25 0.75V12.75C10.25 13.164 9.914 13.5 9.5 13.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.49998 13.5C9.30798 13.5 9.11598 13.4268 8.96973 13.2802L4.72698 9.03785C4.43411 8.74497 4.43411 8.27022 4.72698 7.97735C5.01948 7.68447 5.49498 7.68447 5.78748 7.97735L10.0299 12.2197C10.3227 12.5126 10.3227 12.9873 10.0299 13.2802C9.88398 13.4268 9.69198 13.5 9.49998 13.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.49991 13.5C9.30791 13.5 9.11591 13.4268 8.96966 13.2802C8.67678 12.9873 8.67678 12.5126 8.96966 12.2197L13.212 7.97735C13.5045 7.68447 13.98 7.68447 14.2725 7.97735C14.5654 8.27022 14.5654 8.74497 14.2725 9.03785L10.0302 13.2802C9.88391 13.4268 9.69191 13.5 9.49991 13.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="content-mainwrap">
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportCategories"></div>
              <ImportCategories />
            </div>
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportProducts"></div>
              <ImportProducts />
            </div>
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportIngredients"></div>
              <ImportIngredients />
            </div>
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportInventories"></div>
              <ImportInventories />
            </div>
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportCustomers"></div>
              <ImportCustomers />
            </div>
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportSuppliers"></div>
              <ImportSuppliers />
            </div>
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportUsers"></div>
              <ImportUsers />
            </div>
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportDiscounts"></div>
              <ImportDiscounts />
            </div>
            <div class="bimportwrap">
              <div class="bimportwrap-id" id="ImportDiscounts"></div>
              <ImportDineIn />
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
const initialState = {
  is_processing: false,
};

const form = reactive({ ...initialState });

async function downloadMasterData(e) {
  form.is_processing = true;

  let response = await axios.get("/api/download_master_data");
  
  const link = document.createElement("a");
  link.target = "_blank";
  link.href = response.data.data.file;
  document.body.appendChild(link);
  link.click();

  form.is_processing = false;
}
</script>
