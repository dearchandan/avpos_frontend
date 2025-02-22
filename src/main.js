import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/js/jquery-2.2.4.min.js';
import '@/assets/js/bootstrap.bundle.min.js';
import '@/assets/js/simplebar.min.js';
import '@/assets/js/select2.min.js';
import '@/assets/js/custom.js';
import '@/assets/js/cashier/custom.js';
import '@/assets/css/calculator_style.css';
import '@/assets/main.css';
import default_logo from '@/assets/images/logo-icon.png';
import _ from 'lodash';
import axios from 'axios';       
import i18n from "./i18n";
import router from './router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { toast, updateGlobalOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import '@vuepic/vue-datepicker/dist/main.css'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css';
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css' // optional for styling
import moment from 'moment'
import { Icon } from '@iconify/vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import PageScrollDirective from './plugins/PageScrollDirective';
import { install } from "vue3-recaptcha-v2";
import VueLazyload from 'vue-lazyload'
// import echoInstance from './websocket';

window.default_logo = default_logo;
window.router = router;
window._ = _;
const defaultOptions = {
    headers: {},
}
const instance = axios.create(defaultOptions);
export default instance
window.axios = axios;
window.Multiselect = Multiselect;
window.moment = moment;
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
/* toastr */
updateGlobalOptions({
    autoClose: 3000,
    position: 'top-right',
    style: {
      opacity: '1',
      userSelect: 'initial',
    },
});
window.toast = toast;

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
if(localStorage.getItem("auth")){
    axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("auth")).access_token;
}
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
axios.defaults.withCredentials = true;

/* Websocket */
// window.Echo = echoInstance;

/* ------------------------------------------ */

const app = createApp(App)

app.component('Icon',Icon);
app.component('Pagination',Bootstrap5Pagination);

app.use(pinia)
.use(router)
.use(VueSweetalert2)
.use(VueTippy)
.use(i18n)
.use(PageScrollDirective)
.use(install, {
    sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    cnDomains: false, // Optional, If you use in China, set this value true
  })
.use(VueLazyload)
.mount('#app')

window.Swal =  app.config.globalProperties.$swal;
