import {defineStore} from 'pinia'

export const useSubscriptionStore = defineStore('subscriptionStore', {
    state: () => ({
        cart_subscription_id: '',
    }),
    actions: {
        resetState() {
            this.$reset();
        },
        async setSubscriptionId(id) {
            this.cart_subscription_id = id;
        },
    },
    getters: {
        getsubscriptionId() {
            return this.cart_subscription_id;
        },
    },
    persist: true
})