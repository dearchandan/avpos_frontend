<template>
  <div class="row g-2">
    <div class="col item cursor-pointer" v-for="i in 9">
      <div class="product-box">
        <div class="image">
          <a href="#">
            <div class="skl-w" style="height: 100%"></div>
          </a>
        </div>
        <div class="text">
          <h2 class="pb-1 mb-2 fw-bold text-start">
            <div class="skl-w" style="height: 16px"></div>
          </h2>
          <div class="row align-items-center justify-content-between">
            <div class="col-8 text-start">
              <h5 class="fw-bold">
                <div class="skl-w" style="height: 16px"></div>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
