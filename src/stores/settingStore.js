import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settingStore', {
  state: () => ({
      display_name: '',
      headoffice_address: '',
      logo: '',
      dark_logo: '',
      favicon:'',
      loading: false,
      error: null,
  }),
  actions: {
    resetState() {
      this.$reset();
    },   
    async getSettings(){
        this.loading = true;
        try {
          
            const response = await axios.get('/api/app_settings');
            this.display_name = this.extractKeyValue(response.data,'DISPLAY_NAME');
            this.headoffice_address = this.extractKeyValue(response.data,'HEADOFFICE_ADDRESS');
            this.logo = this.extractKeyValue(response.data,'LOGO');
            this.dark_logo = this.extractKeyValue(response.data,'DARK_LOGO');
            this.favicon = this.extractKeyValue(response.data,'FAVICON_ICN');
            localStorage.setItem('favicon',this.favicon);
            localStorage.setItem('display_name',this.display_name);
            document.title = this.display_name!=''?this.display_name:'Wosul';

        } catch (error) {
            this.error = error;
        } finally {
            this.loading = false;
        }
    },
    extractKeyValue(data,key){
      if(data != '' || data.length){
        let temp = _.filter(data, (val) => {
          return val.key == key;
        });
        if(temp.length){
          return temp[0].value;
        }else{
          return '';
        }
      }
    },
  },
})