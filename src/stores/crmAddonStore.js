import { defineStore } from "pinia";
import useGlobalFunctions from "@/composables/global_functions.js";
import { useAuthStore } from "./auth";
import _ from "lodash";

const { calculateCrmAddon } = useGlobalFunctions();

export const useCrmAddonStore = defineStore("crmAddonStore", {
  state: () => ({
    cart: [],
    discount: {
      value: "",
      type: "",
    },
  }),
  actions: {
    resetState() {
      this.$reset();
    },
    async addToCart(addon,yearly_remain_months,monthly_remain_months){
      let item_prices = calculateCrmAddon(addon, yearly_remain_months,monthly_remain_months);

      const index = this.cart.findIndex(
          (cart_item) => cart_item.addon_id === addon.id
      );
      if(index>-1){
        //only update the price and qty
        this.cart[index].quantity = item_prices.addon_quantity;
        this.cart[index].price = item_prices.addon_amount.toFixed(2);
        this.cart[index].tax_percentage = item_prices.tax_percentage.toFixed(2);
        this.cart[index].tax_amount = item_prices.tax_amount.toFixed(2);
        this.cart[index].final_addon_amount = item_prices.final_addon_amount.toFixed(2);
      }else{
        //add the json to store
        let cart_item = {
          addon : addon,
          addon_id:addon.id,
          addon_name:addon.name,
          addon_constant:addon.constant_name,
          type: addon.type,
          value_type: addon.value_type,
          quantity: item_prices.addon_quantity,
          price : item_prices.addon_amount.toFixed(2),
          tax_percentage : item_prices.tax_percentage.toFixed(2),
          tax_amount : item_prices.tax_amount.toFixed(2),
          final_addon_amount : item_prices.final_addon_amount.toFixed(2),
        }
        this.cart.push(cart_item);
      }
    },
    removeItemFromCart(index){
      this.cart.splice(index, 1);
    },

    clearCart(){
      this.cart = [];
    },

    addDiscount(discount) {
      this.discount.value = discount.value;
      this.discount.type = discount.type;
    },

    clearDiscount() {
      this.discount.value = "";
      this.discount.type = "";
    },
  },
  getters: {
    cartItemCount() {
      return this.cart.length;
    },
    isCartEmpty() {
      return this.cart.length === 0;
    },
    grandTotal(){
      var grand_addon_price_without_tax = 0;
      var discount_amount = 0;
      var amount_after_discount = 0;
      var grand_addon_tax = 0;
      var grand_addon_amount = 0;

      this.cart.map( (item) => {
        grand_addon_price_without_tax += parseFloat(item.price);
      });

      //DISCOUNT
      if (this.discount.type == 1) {
        // Percent
        discount_amount = (parseFloat(grand_addon_price_without_tax) * parseFloat(this.discount.value)) /
            100;
        amount_after_discount = parseFloat(grand_addon_price_without_tax - discount_amount);
      } else if(this.discount.type ==2) {
        // Flat
        discount_amount = parseFloat(this.discount.value);
        amount_after_discount = parseFloat(grand_addon_price_without_tax - discount_amount);
      }else{
        amount_after_discount = grand_addon_price_without_tax;
      }

      grand_addon_tax = parseFloat(amount_after_discount * 15 / 100 );

      grand_addon_amount = parseFloat(amount_after_discount + grand_addon_tax);

      return {
        grand_addon_price_without_tax : grand_addon_price_without_tax.toFixed(2),
        discount_amount : discount_amount.toFixed(2),
        grand_addon_tax : grand_addon_tax.toFixed(2),
        grand_addon_amount : grand_addon_amount.toFixed(2)
      };
    }
  },
});
