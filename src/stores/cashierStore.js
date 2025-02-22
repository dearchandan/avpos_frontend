import { defineStore } from "pinia";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useAuthStore } from "./auth";
import { useCashierStorePersist } from "./cashierStorePersist";
import _ from "lodash";

const { calculateOrder } = useGlobalFunctions();

export const useCashierStore = defineStore("cashierStore", {
  state: () => ({
    all_products: "",
    is_products_loaded: false,
    show_combos: "",
    all_combos: "",
    filtered_combos: "",
    category_id: "",
    search_term: "",
    table: "",
    seats: "",
    order_type: 1,
    customer: {
      selection_type: "", // 0-Opened Directly by click on select customer,1-Opened Indirectly by clicking on pay now
      is_added: false,
      name: "",
      mobile_number: "",
    },
    cart: [],
    cash_amount: 0,
    card_amount: 0,
    change_amount: 0,
    payment_methods: [],
    payment_method: 1,
    is_discount_applied: false,
    discount: {
      slack: "",
      value: "",
      type: "",
    },
    gift_code: "",
    action_type: "",
    hold_orders: [],
    filtered_hold_orders: [],
    search_orders: [],
    edit_mode: false,
    edit_order: [],
    pagination: [],
    page_limit: 50,
    booking_type: 1, // 1-Dine In, 2-Reserve
    booking_date: moment().format("YYYY-MM-DD"),
    booking_time: moment().format("HH:mm"),
    booking_data: {
      seats: "",
      mobile_number: "",
      person_name: "",
    },
    order_note: "",
    show_terminal: true,
    all_terminals: "",
    multiple_prices: "",
    system_closing_cash: "",
    settings: "",
    table: "",
    seats: "",
    is_kds_present: true,
    is_cds_linked: false,
    log_products: []
  }),
  actions: {
    resetState() {
      this.$reset();
    },
    async setTable(value) {
      this.table = value;
    },
    async setSeats(value) {
      this.seats = value;
    },
    async setOrderType(value) {
      this.order_type = value;
      if (value == 1) {
        this.table = null;
        this.seats = null;
      }
    },
    async setCategory(value) {
      this.page = 1;
      this.category_id = value;
      this.show_combos = false;
      this.getProducts();
    },
    async setSearch(value) {
      this.page = 1;
      this.search_term = value;
      if (this.show_combos) {
        this.getCombos();
      } else {
        this.getProducts();
      }
    },
    async setPage(value) {
      this.page = value;
      this.getProducts();
    },
    async setShowTerminal(value) {
      this.show_terminal = value;
    },
    async setSystemClosingCash(system_closing_cash) {
      this.system_closing_cash = system_closing_cash;
    },
    async getSettings() {
      let response = await axios.get("/api/cashier_settings").catch((error) => {
        if (401 === error.response.status) {
          router.push("/");
        }
      });
      if (response.data) {
        this.settings = response.data.settings;
        this.is_kds_present = response.data.is_kds_present;
        this.is_cds_linked = response.data.is_cds_linked;
      }
    },
    async refreshTerminals() {
      await axios.get("api/cashier/terminals").then((resp) => {
        this.all_terminals = resp.data.data.terminals;
      });
    },
    async getMultiplePrices() {
      await axios.post("api/multiple_price/all").then((resp) => {
        this.multiple_prices = resp.data.data;
      });
    },

    /* Dine In */
    async setTable(table) {
      this.table = table;
    },
    async setSeats(seats) {
      this.seats = seats;
    },
    async getProducts() {
      let form_data = new FormData();
      form_data.append(
        "category_id",
        this.category != "" ? this.category_id : ""
      );
      form_data.append("search_term", this.search_term);
      form_data.append("page_limit", this.page_limit);
      form_data.append("page", this.page);

      this.is_products_loaded = false;
      await axios
        .post("api/v2/cashier/products", form_data)
        .then((response) => {
          if (response.data.status_code == 200) {
            this.all_products = response.data.data.data;

            if (useCashierStorePersist().multiple_price_id != "") {
              this.all_products.map((value, index) => {
                if (value.this_branch_inventory.product_prices.length) {
                  let multiple_price = _.find(
                    value.this_branch_inventory.product_prices,
                    (item) => {
                      return (
                        item.multiple_price_id ==
                        useCashierStorePersist().multiple_price_id
                      );
                    }
                  );
                  if (multiple_price) {
                    this.all_products[
                      index
                    ].this_branch_inventory.initial_sale_price =
                      multiple_price.product_price;
                    this.all_products[index].this_branch_inventory.sale_price =
                      multiple_price.product_price;
                  }
                }
              });
            }

            if (this.page > 1) {
              response.data.data.data.map((value) => {
                this.all_products.push(value);
              });
            }
            this.pagination = response.data.data.pagination;
            this.is_products_loaded = true;
          }
        });
    },
    async getPaymentMethods() {
      await axios.get("api/v2/cashier/payment_methods").then((response) => {
        if (response.data.status_code == 200) {
          this.payment_methods = response.data.data;
        }
      });
    },
    // async setFilters(value){
    //   this.filters = value;
    //   this.filterProducts();
    // },
    // async filterProducts(){

    //     this.filtered_products = this.all_products.filter( (item) => {
    //       let isVeg = 1;
    //       let isInStock = true;

    //       if(this.filters.dietary){
    //         isVeg = item.dietary;
    //         if(isVeg==2){
    //             isVeg = false;
    //         }
    //       }

    //       if(this.filters.in_stock){
    //         isInStock = item.is_stockable && item.this_branch_inventory && parseFloat(item.this_branch_inventory.quantity) > 0;
    //       }

    //       return isVeg && isInStock;

    //     });

    // },
    async setCombo() {
      this.show_combos = true;
      this.getCombos();
    },
    async setEditOrder(value) {
      this.edit_mode = true;
      this.edit_order = value;
    },
    async getCombos() {
      let form_data = new FormData();
      form_data.append("search_term", this.search_term);

      let response = await axios.post("api/cashier/combos", form_data);

      this.all_combos = response.data;

      this.filtered_combos = this.all_combos;
    },

    /* Cart Management */
    async addToCart(product) {
      let item_prices = calculateOrder(product);

      let search_item = this.cart.find((item) => {
        return item.product_id == product.id;
      });

      if (search_item) {
        this.increaseCartItemQty(search_item);
      } else {
        let cart_item = {
          cart_id: _.uniqueId(),
          type: "product", // product or combo
          product: product,
          product_id: product.id,
          name: product.name,
          dietary: product.dietary,
          name_ar: product.name_ar,
          modifiers: [],
          discount: [],
          product_quantity: 1,
          note: "",
          is_gift_item: false,
          is_open_price: false,
          open_sale_price: item_prices.product_rate,
          prices: item_prices,
        };

        this.cart.push(cart_item);
      }
    },
    cloneItem(index){
      
      const clone_item = this.cart[index];
      
      let cart_item = {
        cart_id: _.uniqueId(),
        type: "product", // product or combo
        product: clone_item.product,
        product_id: clone_item.product_id,
        name: clone_item.product.name,
        dietary: clone_item.product.dietary,
        name_ar: clone_item.product.name_ar,
        modifiers: [],
        discount: [],
        product_quantity: 1,
        note: "",
        is_gift_item: clone_item.is_gift_item,
        is_open_price: clone_item.is_open_price,
        open_sale_price: clone_item.open_sale_price,
        prices: clone_item.prices,
      };

      this.cart.push(cart_item);

    },
    async setOpenPrice(cart_id, newPrice) {
      
      let search_item = this.cart.find((item) => {
        return item.cart_id == cart_id;
      });

      let item_prices = calculateOrder(
        search_item.product, // product
        search_item.product_quantity, // product quantity
        search_item.modifiers, // selected product modifiers
        search_item.discount, // selected product discount
        search_item.prices.order_discount_percentage, // order discount percentage
        search_item.is_gift_item, // is gift item
        true, // is open price
        newPrice // open sale price
      );
      search_item.is_open_price = true;
      search_item.open_sale_price = parseFloat(newPrice);
      search_item.prices = item_prices;
    },
    async markItemAsGift(cart_id) {

      let search_item = this.cart.find((item) => {
        return item.cart_id == cart_id;
      });

      let item_prices = calculateOrder(
        search_item.product, // product
        search_item.product_quantity, // product quantity
        search_item.modifiers, // selected product addProductModifierss
        search_item.discount, // selected product discount
        search_item.prices.order_discount_percentage, // order discount percentage
        search_item.is_gift_item, // is gift item
        search_item.is_open_price, // is open price
        search_item.open_sale_price // open price
      );

      let index = this.cart.indexOf(search_item);
      this.cart[index].prices = item_prices;

    },
    addProductModifiers(cart_id, modifiers) {

      const search_item = this.cart.find(
        (item) => item.cart_id === cart_id
      );

      let item_prices = calculateOrder(
        search_item.product, // product
        search_item.product_quantity, // product quantity
        modifiers, // selected product modifiers
        search_item.discount, // selected product discount
        search_item.prices.order_discount_percentage, // order discount percentage,
        search_item.is_gift_item,
        search_item.is_open_price,
        search_item.open_sale_price
      );
      
      const index = this.cart.indexOf(search_item);
      this.cart[index].product_quantity = search_item.product_quantity;
      this.cart[index].prices = item_prices;
      this.cart[index].modifiers = modifiers;
    },
    addProductDiscount(cart_id, discount) {

      const search_item = this.cart.find(
        (item) => item.cart_id === cart_id
      );
      
      let item_prices = calculateOrder(
        search_item.product, // product
        search_item.product_quantity, // product quantity
        search_item.modifiers, // product modifiers
        discount, // product discount
        search_item.prices.order_discount_percentage, // order discount percentage
        search_item.is_gift_item, // is gift item
        search_item.is_open_price, // open price
        search_item.open_sale_price
      );

      const index = this.cart.indexOf(search_item);
      this.cart[index].product_quantity = search_item.product_quantity;
      this.cart[index].prices = item_prices;
      this.cart[index].discount = discount;
    },
    increaseCartItemQty(cart_id, increment_by = 1) {
      
      let search_item = this.cart.find((item) => {
        return item.cart_id == cart_id;
      });

      if (search_item) {
        let new_quantity = (search_item.product_quantity += increment_by);

        let item_prices = calculateOrder(
          search_item.product, // product
          new_quantity, // product quantity
          search_item.modifiers, // product modifiers
          search_item.discount, // product discount
          search_item.prices.order_discount_percentage, // order discount percentage
          search_item.is_gift_item, // gift item
          search_item.is_open_price, // is open price
          search_item.open_sale_price // open price
        );
        search_item.prices = item_prices;
      }
    },
    decreaseCartItemQty(cart_id, decrement_by) {

      let item = this.cart.find((item) => {
        return item.cart_id == cart_id;
      });

      if (item) {

        let new_quantity = (item.product_quantity -= decrement_by);

        if (new_quantity > 0) {
          let item_prices = calculateOrder(
            item.product, // product
            new_quantity, // product quantity
            item.modifiers, // product modifiers
            item.discount, // product discount
            item.prices.order_discount_percentage, // order discount percentage,
            item.is_gift_item, // is gift item
            item.is_open_price, // open price
            item.open_sale_price // open price
          );

          let updated_cart_item = item;
          updated_cart_item.product_quantity = new_quantity;
          updated_cart_item.prices = item_prices;
        } else {
          this.cart = this.cart.filter(
            (value) => value.cart_id != cart_id
          );
        }
      }
    },
    removeItemFromCart(index) {
      this.cart.splice(index, 1);
    },
    clearCart() {
      this.cart = [];
      this.dicsount = {
        value: "",
        type: "",
      };
      this.cash_amount = 0;
      this.card_amount = 0;
      this.change_amount = 0;
      this.is_discount_applied = false;
      this.gift_code = "";
      this.edit_mode = false;
      this.order_note = "";
      this.clearCustomer();
    },
    newOrder() {
      this.edit_mode = false;
      this.clearCart();
      this.setOrderType(1);
    },
    setCustomer(value) {
      this.customer.is_added = true;
      this.customer = value;
    },
    setCustomerSelectionType(value) {
      this.customer.selection_type = value;
    },
    clearCustomer() {
      let customer = {
        is_added: false,
        name: "",
        mobile_number: "",
      };
      this.customer = customer;
    },
    setCashAmount(value) {
      this.cash_amount = parseFloat(value);
      if (this.payment_method != 1) {
        this.change_amount = 0;
        this.card_amount =
          parseFloat(this.grandTotal.total) - parseFloat(this.cash_amount);
      } else {
        this.change_amount =
          parseFloat(value) - parseFloat(this.grandTotal.total);
      }
    },
    setCardAmount(value) {
      this.card_amount = parseFloat(value);
      this.cash_amount =
        parseFloat(this.grandTotal.total) - parseFloat(this.card_amount);
      this.change_amount = 0;
    },
    setDiscount(value, type, slack) {
      this.discount.value = value;
      this.discount.type = type;
      this.discount.slack = slack;
      this.calculateOrderDiscount(type, value);
    },
    calculateOrderDiscount(type, value) {
      let order_discount_percentage = 0;

      if (value > 0) {
        if (type == 2) {
          let product_amount_after_product_discount = 0;
          this.cart.map((item) => {
            product_amount_after_product_discount += parseFloat(
              item.prices.product_amount_after_product_discount
            );
          });
          order_discount_percentage = parseFloat(
            (value / product_amount_after_product_discount) * 100
          );
        } else {
          order_discount_percentage = parseFloat(value);
        }
      }

      if (parseFloat(order_discount_percentage) > 0.1) {
        this.addOrderDiscount(order_discount_percentage);
      } else {
        this.addOrderDiscount(0);
      }
    },
    addOrderDiscount(order_discount_percentage) {
      this.cart.map((item, index) => {
        let item_prices = calculateOrder(
          item.product, // product
          item.product_quantity, // product quantity
          item.modifiers, // product modifiers
          item.discount, // product discount
          order_discount_percentage, // order discount percentage
          item.is_gift_item,
          item.is_open_price,
          item.open_sale_price
        );
        this.cart[index].prices = item_prices;
      });
    },
    clearDiscount() {
      this.discount.value = "";
      this.discount.type = "";
      this.discount.slack = "";
      this.calculateOrderDiscount(this.discount.type, this.discount.value);
    },
    setIsDiscountApplied(value) {
      this.is_discount_applied = value;
    },
    setPaymentMethod(value) {
      if (value == 1) {
        this.setCashAmount(this.cash_amount);
      } else {
        this.setCardAmount(this.card_amount);
      }
      this.payment_method = value;
    },
    formatNumber(number, decimals) {
      return Number(number).toFixed(decimals);
    },
    setActionType(value) {
      this.action_type = value;
    },
    async getHoldOrders() {
      let response = await axios.get("api/cashier/hold_orders");
      this.hold_orders = response.data;
      this.filtered_hold_orders = response.data;
    },
    filterHoldOrders(value) {
      var search_term = value;

      if (search_term != "") {
        this.filtered_hold_orders = this.hold_orders.filter((item) => {
          return (
            item.order_number == search_term ||
            item.reference_number == search_term
          );
        });
      } else {
        this.getHoldOrders();
      }
    },
    async getSearchOrders(search_term) {
      let response = await axios.get("api/cashier/search_orders", {
        params: {
          search_term: search_term,
          terminal_id: useAuthStore().loggedInTerminal.id,
        },
      });

      this.search_orders = response.data;
    },
    editOrder(order_slack) {
      this.clearCart();

      axios
        .get("/api/order/edit/" + order_slack)
        .then((response) => {
          let order = response.data.order;
          this.setEditOrder(order);
          this.setOrderType(order.order_type);
          this.setSeats(order.table_seats);

          let table = response.data.table;
          this.setTable(table);

          this.setCustomer({
            name: order.customer_name,
            mobile_number: order.customer_phone,
          });

          let items = response.data.cart;

          _.forEach(items, (item) => {
            let item_prices = calculateOrder(
              item.product,
              item.product_quantity,
              item.modifiers,
              item.discount,
              item.order_discount_percentage, // order discount percentage
              item.is_gift_item,
              item.is_open_price
            );

            let cart_item = {
              cart_id: _.uniqueId(), 
              type: item.type, // product or combo
              product: item.product,
              product_id: item.product_id,
              name: item.name,
              dietary: item.dietary,
              name_ar: item.name_ar,
              modifiers: item.modifiers,
              discount: item.discount,
              is_gift_item: item.is_gift_item,
              is_open_price: parseFloat(item.is_open_price),
              open_sale_price: parseFloat(item_prices.product_rate),
              product_quantity: parseFloat(item.product_quantity),
              note: item.note,
              prices: item_prices,
            };
            this.cart.push(cart_item);
          });
        })
        .catch((error) => {
          // form.server_messages.type = "error";
          // form.server_messages.messages = error;
          // form.is_listing = false;
          console.log(error);
        });
    },
    setBookingData(values) {
      this.booking_type = 2;
      this.booking_data = values;
      this.booking_data.person_name =
        values.person_name && !_.isUndefined(values.person_name)
          ? values.person_name
          : "";
    },
    setBookingDate(value) {
      this.booking_date = moment(value).format("YYYY-MM-DD");
    },
    setBookingTime(value) {
      if (this.booking_type == 2) {
        this.booking_time = moment(value).format("HH:mm");
      } else {
        this.booking_time = "";
      }
    },
    setBookingType(value) {
      if (value == 1) {
        this.booking_date = moment().format("YYYY-MM-DD");
        this.booking_time = "";
        this.booking_data.mobile_number = "";
        this.booking_data.person_name = "";
        this.booking_data.seats = "";
      }
      this.booking_type = value;
    },
    setOrderNote(value) {
      this.order_note = value;
    },
  },
  getters: {
    cartItemCount() {
      return this.cart.length;
    },
    isCartEmpty() {
      return this.cart.length === 0;
    },
    grandTotal() {
      var subtotal = 0;
      var product_discount = 0;
      var subtotal_after_product_discount = 0;
      var order_discount = 0;
      var subtotal_after_order_discount = 0;
      var additional_fee = 0;
      var tobacco_tax = 0;
      var tax = 0;
      var total = 0;
      this.log_products = [];

      this.cart.map((item) => {
        let temp_subtotal = parseFloat(item.prices.product_amount);
        let temp_product_discount = parseFloat(
          item.prices.product_discount_amount
        );
        let temp_subtotal_after_product_discount = parseFloat(
          temp_subtotal - temp_product_discount
        );
        let temp_order_discount = parseFloat(item.prices.order_discount_amount);
        let temp_subtotal_after_order_discount = parseFloat(
          temp_subtotal_after_product_discount - temp_order_discount
        );
        let temp_additional_fee = parseFloat(item.prices.additional_fee_amount);
        let temp_tobacco_tax = parseFloat(item.prices.tobacco_tax_amount);
        let temp_tax = parseFloat(item.prices.tax_amount);
        let temp_total = parseFloat(
          temp_subtotal_after_order_discount +
            temp_additional_fee +
            temp_tobacco_tax +
            temp_tax
        );

        subtotal += temp_subtotal;
        product_discount += temp_product_discount;
        subtotal_after_product_discount += temp_subtotal_after_product_discount;
        order_discount += temp_order_discount;
        subtotal_after_order_discount += temp_subtotal_after_order_discount;
        additional_fee += temp_additional_fee;
        tobacco_tax += temp_tobacco_tax;
        tax += temp_tax;
        total += temp_total;

        let log_product = {
          name: item.name,
          name_ar: item.name_ar,
          dietary: item.dietary,
          is_gift_item: item.is_gift_item,
          modifiers: item.modifiers,
          price: item.prices.product_price_with_tax,
          quantity: item.prices.product_quantity,
          total_price: item.prices.product_price_with_tax * item.prices.product_quantity,
        };
        this.log_products.push(log_product);
      });

      if (this.payment_method == 1) {
        this.cash_amount = total;
        this.card_amount = 0;
      } else {
        this.card_amount = total;
        this.cash_amount = 0;
      }

      let round_off = 0;
      // if(_.round(total,0) != _.round(total,2)){
      //   round_off = _.round(total,0) - _.round(total,2);
      //   total += round_off;
      // }

      /*update cart log table*/
      // if(this.is_cds_linked==true){

      //   let order_json = {
      //     products:this.log_products,
      //     payable_amount : _.round(total, 2)
      //   };
      //   axios.post('api/cashier/update_cart_log',{
      //     order_json : order_json,
      //     terminal_id : useAuthStore().loggedInTerminal.id,
      //   });
      // }
      /*update cart log table*/

      return {
        subtotal: _.round(subtotal, 2),
        product_discount: _.round(product_discount, 2),
        subtotal_after_product_discount: _.round(
          subtotal_after_product_discount,
          2
        ),
        order_discount: _.round(order_discount, 2),
        subtotal_after_order_discount: _.round(subtotal_after_order_discount, 2),
        additional_fee: _.round(additional_fee, 2),
        tobacco_tax: _.round(tobacco_tax, 2),
        tax: _.round(tax, 2),
        round_off: _.round(round_off, 2),
        total: _.round(total, 2),
      };
    },
  },
});
