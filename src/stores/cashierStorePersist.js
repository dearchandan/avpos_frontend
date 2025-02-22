import { defineStore } from 'pinia'

export const useCashierStorePersist = defineStore('cashierStorePersist', {
  state: () => ({
    multiple_price_id : '',
    multiple_price_name : '',
  }),
  actions: {
    resetState() {
      this.$reset();
    },
    setMultiplePrice(value){
      if(value != ''){
        this.multiple_price_id = value.id;
        this.multiple_price_name = value.name;
      }else{
        this.multiple_price_id = '';
        this.multiple_price_name = ''
      }
    }
  },
  persist : true,
})