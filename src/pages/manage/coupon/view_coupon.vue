<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/coupons" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Coupons') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ form.coupon.name  }} </h5>
                    </div>
                </div>
            </div>
        </template>

        <div class="content">
            <div class="page-heading">
                <div class="py-3" v-if="form.server_messages.messages != ''">
                    <ServerMessage :server_messages="form.server_messages"  />
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-auto">
                    <ul class="nav nav-tabs align-items-center nav-tabs-product" id="myTab2" role="tablist">
                        <li class="nav-item" role="presentation" v-for="(tab,index) in tabs" :key="index">
                            <button class="nav-link nav-link-lg fw-bold" @click="setActive(tab,index)" :class="[ form.active_tab.index == index || (form.active_tab.index == '' && index == 0)  ? 'active' : '' , (tab.required && tab.count <= 0) ? 'text-danger' : ''  ]"  type="button" role="tab" aria-selected="false" tabindex="-1">{{ tab.value }} <span v-if="tab.count >= 0" class="badge count-badge" :class="[ form.active_tab.index != index ? 'badge-secondary' : 'badge-dark' ]" >{{  tab.count }}</span> </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="form.coupon != ''">
                
                <AsyncCouponDetail v-if=" form.active_tab.index == '' || form.active_tab.tab.key == 'coupon_detail'" :coupon="form.coupon"  />
                
                <AsyncCouponSetting v-if="form.active_tab.tab.key == 'coupon_setting'"  :form="form" @refreshCoupon="getCoupon" />
                
            </div>
            

        </div>

     </DefaultLayout>
</template>

<script setup>

    import { Form } from 'vee-validate'
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    import {useRoute} from "vue-router";
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    /* async components */
    const AsyncCouponDetail = defineAsyncComponent( () => import('@/components/coupon/CouponDetail.vue') );
    const AsyncCouponSetting = defineAsyncComponent( () => import('@/components/coupon/CouponSetting.vue') );

    /* Route parameter */
    const route = useRoute();
    const slack = route.params.slack;

    const tabs = computed(() => {
        
        let values = [
            {
                key: 'coupon_detail',
                value: t('Coupon Details'),
                count: '',
                required: false,
            }
            ,{
                key: 'coupon_setting',
                value: t('Coupon Setting'),
                count: '',
                required: false,
            }
        ]
        
        return values;

    });

    function setActive(tab,index){
        let template = {
            tab: tab,
            index: index,
        };
        form.active_tab = template;
    }

    onMounted(()=>{
        getCoupon();
    })

    /* form object */
    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
        active_tab : {
            index : '',
            tab : ''
        },
        selected_branch: "",
        coupon: "",
        branches: "",
    };

    const form = reactive({ ...initialState });

    async function getCoupon(){

        await axios.get('/api/coupon', { params : {
                slack : slack,
            } }).then( (response) => {
            
            form.coupon = response.data.data.coupon;
            form.branches = response.data.data.branches
            // form.applies_to_all_branch = response.data.data.coupon.applies_to_all_branch;
            form.selected_branch = '';

        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            console.log(error);
        });

    }


</script>