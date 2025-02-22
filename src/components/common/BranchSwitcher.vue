<template>
    <teleport to='body'>

        <div class="modal fade" id="BranchSwitcherModal" tabindex="-1" aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false" ref="modal">
            <div class="modal-dialog modal-dialog-centered modal-w-1260 modal-xl">
                <div class="modal-content">
                    <div class="modal-header modal-title">
                        <h3 class="mb-0">{{ $t('Switch Branch') }}</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="form-field mb-4">
                            <div class="field-icon">
                                <input type="search" class="form-control form-control-sm form-control-solid" :placeholder="search_placeholder" v-model="search_query">
                                <div class="icon"><Icon icon="fa6-solid:magnifying-glass" /></div>
                            </div>
                        </div>
                        <div class="row g-4">
                            <div class="col-12 col-md-6 col-lg-4" v-for="(branch,index) in branches" @click="switchBranch(branch)">
                                    <div class="brandselectbox" :class="{ 'active' : branch.slack == logged_in_branch_slack }" role="button" >
                                        <div class="icon">
                                           <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23.369 11.3684V23.3684C23.369 23.7171 23.0869 24 22.7394 24H11.4075V14.5263C11.4075 14.1777 11.1255 13.8947 10.778 13.8947H5.74158C5.39407 13.8947 5.11203 14.1777 5.11203 14.5263V24H2.59383C2.24632 24 1.96428 23.7171 1.96428 23.3684V11.3684H2.17833C3.09747 11.3684 3.94107 10.9168 4.46359 10.2C4.47618 10.2126 4.48563 10.2316 4.49507 10.2474C5.03648 10.9579 5.85804 11.3684 6.752 11.3684H7.54523C8.499 11.3684 9.34575 10.8947 9.86198 10.1621C9.9029 10.2126 9.94382 10.2663 9.98789 10.3168C10.5828 10.9863 11.439 11.3684 12.333 11.3684H13.0003C13.8942 11.3684 14.7504 10.9863 15.3453 10.3168C15.3894 10.2663 15.4303 10.2126 15.4713 10.1621C15.9875 10.8947 16.8342 11.3684 17.788 11.3684H18.5812C19.4752 11.3684 20.2968 10.9579 20.8382 10.2474C20.8476 10.2316 20.857 10.2126 20.8696 10.2C21.3922 10.9168 22.2358 11.3684 23.1549 11.3684H23.369ZM20.2212 19.5789V14.5263C20.2212 14.1777 19.9392 13.8947 19.5917 13.8947H15.1848C14.8373 13.8947 14.5553 14.1777 14.5553 14.5263V19.5789C14.5553 19.9276 14.8373 20.2105 15.1848 20.2105H19.5917C19.9392 20.2105 20.2212 19.9276 20.2212 19.5789ZM4.45069 0C3.95303 0 3.50227 0.294 3.30019 0.75L0.13859 7.88526C-0.0893071 8.40158 -0.0342214 8.96842 0.289682 9.432C0.594383 9.86779 1.11093 10.1053 1.64132 10.1053H2.17833C2.88342 10.1053 3.50668 9.62842 3.69554 8.94947L5.15295 3.67895L6.17282 0H4.45069ZM7.47913 0L5.23479 8.10316C5.10258 8.58316 5.20016 9.08526 5.4992 9.48316C5.79824 9.87789 6.25466 10.1053 6.752 10.1053H7.54523C8.35106 10.1053 9.02153 9.5021 9.10966 8.7L10.076 0H7.47913ZM13.9918 0H11.3414L10.4538 8.0021C10.3971 8.53579 10.5671 9.07263 10.9259 9.47368C11.2879 9.88105 11.7884 10.1053 12.333 10.1053H13.0003C13.5448 10.1053 14.0453 9.88105 14.4073 9.47368C14.7662 9.07263 14.9361 8.53579 14.8795 8.0021L13.9918 0ZM17.8541 0H15.2572L16.2236 8.7C16.3117 9.5021 16.9822 10.1053 17.788 10.1053H18.5812C19.0786 10.1053 19.535 9.87789 19.834 9.48316C20.1331 9.08526 20.2306 8.58316 20.0984 8.10316L17.8541 0ZM22.033 0.75C21.831 0.294 21.3799 0 20.8825 0H19.1604L20.1803 3.67895L21.6377 8.94947C21.8266 9.62842 22.4498 10.1053 23.1549 10.1053H23.6919C24.2226 10.1053 24.7392 9.86779 25.0436 9.432C25.3678 8.96842 25.4225 8.40126 25.1946 7.88526L22.033 0.75Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <h4>{{(lang == 'ar' && branch.name_ar !='' && branch.name_ar!=null && branch.name_ar!='null')?branch.name_ar:branch.name}}</h4>
                                        <h6 v-if="branch.last_logged_in_at">Last accessed {{ branch.last_logged_in_at }}</h6>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>

    </teleport>

</template>


<script setup>

	import { useAuthStore } from '@/stores/auth';
	import { useI18n } from 'vue-i18n'
    const { t } = useI18n(); 

	const authStore = useAuthStore();

    const server_messages = reactive({
        type : "",
        messages : "",
    });

    const logged_in_branch_slack = computed(() => {
        return authStore.user.login_branch.slack;
    });

    const search_placeholder = t("Search branches..")
    const search_query = ref("");

    // const branches = computed(() => {
    //         return authStore.user.branches;
    // });

    const branches = computed(() => {
        if (!search_query.value) {
            return authStore.user.branches;
        }
        return authStore.user.branches.filter(item => {
            return item.name.toLowerCase().includes(search_query.value.toLowerCase());
        });
    });

    const lang = ref("en");
    
    onMounted( () => {
        lang.value = localStorage.getItem('language');
    });
    function closeModal(){
        $('#BranchSwitcherModal').modal('hide');
    }

    async function switchBranch(branch){
        
        // if(branch.slack != logged_in_branch_slack.value){

            var form_data = new FormData();
            form_data.append('branch_slack',branch.slack)
            
            await axios.post('/api/switch/branch', form_data).then( (response) => {
                
                if(response.data.status_code == 200) {
                    
                    authStore.refresh().then(() => {
                      authStore.updateBranchChangeDataToFalse();
                        router.go(0);
                    });
                
                }
                
            }).catch((error) => {
            console.log(error)
            });

        // }

    }

</script>