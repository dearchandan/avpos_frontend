import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
      access_token: null,
      paginate_limit: 20,
      user: null,
      menus: [],
      timings: [],
      open_branch_change_modal: false
  }),
  actions: {
    resetState() {
      this.$reset();
    },
    async login(form_data){

      let response = await axios.post('/api/login',form_data);
      response = response.data;

      if(response.status_code == 200) {

        this.access_token = response.data.access_token;
        this.paginate_limit = response.data.paginate_limit;
        this.user = response.data.user;

        this.menus = response.data.menus;

        this.open_branch_change_modal = false;
        if(this.user.branches){
          let is_branch_exist = this.user.branches.some(branch => branch.slack === this.user.login_branch.slack);
          if(is_branch_exist!='true' && (this.user.user_type!=1 && this.user.user_type!=4 )){
            this.open_branch_change_modal = true;
          }else{
            this.open_branch_change_modal = false;
          }
        }

        if(response.data.user.user_type != 1 && response.data.user.login_branch && response.data.user.login_branch.enable_timings == true)
          localStorage.setItem('timings',JSON.stringify(response.data.user.login_branch.timings));
        else
          localStorage.setItem('timings',"");

        if(response.data.user.language_id == 1)
          localStorage.setItem('language','en');
        else
          localStorage.setItem('language','ar');
      
      }

      return response;

    },
    async logout(){
      
      await axios.post('/api/logout').catch(error => {
        if (401 === error.response.status) {
          router.push('/'); 
        } 
     });

     this.reset();
      // router.push('/'); 
      location.reload();
    },
    async updateBranchChangeDataToFalse(){
      this.open_branch_change_modal = false;
    },
    async refresh(){
      let response = await axios.get('/api/v2/user/refresh');
      this.user = response.data.data;

      let is_branch_exist = this.user.branches.some(branch => branch.slack === this.user.login_branch.slack);
      if(!is_branch_exist){
        this.open_branch_change_modal = true;
      }else{
        this.open_branch_change_modal = false;
      }


      if(response.data.data.user_type != 1 && response.data.data.login_branch.enable_timings == true)
      localStorage.setItem('timings',JSON.stringify(response.data.data.login_branch.timings));
      else
      localStorage.setItem('timings',"");
      // this.updateSubscriptionMenu();
    },
    async updateSubscriptionMenu(){
      var form_data = new FormData();
      form_data.append('subscription_id',this.user.merchant.user_subscription.subscription_id);
      let response = await axios.post('/api/subscription/menus',form_data);
      this.menus = response.data.data;
    },
    async setUserTax(value){
      this.user.tax = value;
    },
    async setUserTaxId(value){
      this.user.tax_id = value;
    },
    async setMenu(value){
      this.menus = value;
    },
    reset(){
      this.resetState();
      localStorage.removeItem('auth');
      localStorage.removeItem('timings');
      localStorage.removeItem('cashierStore');
      localStorage.removeItem('cashierStorePersist');
      this.access_token = this.user = null;
      return false;
    }
  },
  getters: {
    authenticated() {
      return (this.access_token != null && this.access_token != '') ? true : this.reset();
    },
    isAdmin() {
      return (this.user != null && this.user != '' && this.user.user_type == 1 ) ? true : false;
    },
    isMerchant() {
      return (this.user != null && this.user != '' && this.user.user_type == 2 ) ? true : false;
    },
    isUser() {
      return (this.user != null && this.user != '' && this.user.user_type == 3 ) ? true : false;
    },
    isSubAdmin() {
      return (this.user != null && this.user != '' && this.user.user_type == 4 ) ? true : false;
    },
    tax_inclusive_pricing() {
      if(this.user != null){
        return this.user.login_branch.tax_inclusive_pricing;
      }
    },
    IsOtherTaxesAndFeeEnabled() {
      var status = false;
      if(this.user != null){
        if(this.user.other_taxes_and_fee != null && this.user.other_taxes_and_fee.tax_type != 0){
          status = true;
        }
      }
      return status;
    },
    loggedInTerminal(){
      return this.user.logged_in_terminal;
    }
    
  },
  persist : true
})