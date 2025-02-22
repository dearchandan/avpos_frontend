<template>
  <div>
    <div class="row gx-4">
      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
          <div class="row align-items-center flex-nowrap">
            <div class="col-auto">
              <span style="font-size: 42px" class="text-primary">{{
                data.out_of_stock
              }}</span>
            </div>
            <div class="col">
              <div>
                <a href=""
                  ><h4 class="mb-0">{{ $t("Out of stock") }}</h4></a
                >
                <p class="text-800 fs-9 mb-0">{{ $t("Products") }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
          <div class="row align-items-center flex-nowrap">
            <div class="col-auto">
              <span style="font-size: 42px" class="text-primary">{{
                data.low_stock
              }}</span>
            </div>
            <div class="col">
              <div class="">
                <a href=""
                  ><h4 class="mb-0">{{ $t("Low stock") }}</h4></a
                >
                <p class="text-800 fs-9 mb-0">{{ $t("Products") }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
          <div class="row align-items-center flex-nowrap">
            <div class="col-auto">
              <span style="font-size: 42px" class="text-primary">{{
                data.inactive
              }}</span>
            </div>
            <div class="col">
              <div class="">
                <a href=""
                  ><h4 class="mb-0">{{ $t("Inactive") }}</h4></a
                >
                <p class="text-800 fs-9 mb-0">{{ $t("Products") }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
          <div class="row align-items-center flex-nowrap">
            <div class="col-auto">
              <span style="font-size: 42px" class="text-primary">{{data.hold_orders}}</span>
            </div>
            <div class="col">
              <div class="">
                <a href=""><h4 class="mb-0">{{ $t("Hold orders") }}</h4></a>
                <p class="text-800 fs-9 mb-0">{{ $t("Awating processing") }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-12 col-lg-12">
        <h5 class="text-muted">{{ $t("Revenue in") }} {{  currency_symbol }}</h5>
      </div>
      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
            <span style="font-size: 42px;line-height:110%;" class="text-primary mb-2">{{ number_abbr(revenue_data.total_income) }}</span>
            <a href=""><h4 class="mb-0 fs-5">{{ $t("Total Income Transactions") }}</h4></a>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
            <span style="font-size: 42px;line-height:110%;" class="text-primary mb-2">{{ number_abbr(revenue_data.total_return) }}</span>
            <a href=""><h4 class="mb-0 fs-5">{{ $t("Total Return Transactions") }}</h4></a>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
            <span style="font-size: 42px;line-height:110%;" class="text-primary mb-2">
              {{ number_abbr(parseFloat(revenue_data.net_transaction)) }}</span>
            <a href=""><h4 class="mb-0 fs-5">{{ $t("Net Transactions") }}</h4></a>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
            <span style="font-size: 42px;line-height:110%;" class="text-primary mb-2">{{number_abbr(revenue_data.total_tax) }}</span>
            <a href=""><h4 class="mb-0 fs-5">{{ $t("Tax") }}</h4></a>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
            <span style="font-size: 42px;line-height:110%;" class="text-primary mb-2">{{number_abbr(revenue_data.total_expense) }}</span>
            <a href=""><h4 class="mb-0 fs-5">{{ $t("Expense Transactions") }}</h4></a>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3">
        <div class="card py-3">
            <span style="font-size: 42px;line-height:110%;" class="text-primary mb-2">
              {{number_abbr(parseFloat(revenue_data.net_income))}}
            </span>
            <a href=""><h4 class="mb-0 fs-5">{{ $t("Net Income") }}</h4></a>
        </div>
      </div>

    </div>

  </div>

  
  <div>
   
  </div>
</template>

<script setup>
const props = defineProps(["data","revenue_data", "general_stats", "inventory_stats","currency_symbol"]);
const data = props.data;
const revenue_data = props.revenue_data;
const currency_symbol = props.currency_symbol;

const is_data_loaded = computed(() => {
  return (props.data != '') ? true : false;
})
const general_stats = props.general_stats;
const inventory_stats = props.inventory_stats;

function number_abbr(num) { 
  // console.log('num =', num);
    if (String(num).length < 7) { 
        // return Math.floor(num/1000) + 'K'; 
        return (num/1000).toFixed(2) + 'K'; 
    } else { 
        // return Math.floor(num/1000000) + 'M'; 
        return (num/1000000).toFixed(2) + 'M'; 
    } 
} 
</script>
