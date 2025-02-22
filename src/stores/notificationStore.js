import { defineStore } from "pinia";
import lowStockIcon from '@/components/icons/lowStockIcon.vue';

export const useNotificationStore = defineStore("notificationStore", {
  state: () => ({
    paginate_limit: 10,
    notifications: [],
    unread_notification_count: 0,
  }),
  actions: {
    resetState() {
      this.$reset();
    },
    async index() {
      let response = await axios.get("/api/v2/notifications");
      if (response.data.status_code == 200) {
        this.notifications = response.data.data.notifications.data;
        this.unread_notification_count =
          response.data.data.unread_notification_count;
      }
    },
    addNotification(data) {
      
      let notification = data;
      
      notification.is_read = false;
      notification.time_ago = "just now";
      notification.svg_icon = JSON.parse(data.data.svg_icon);
      let params = data.data.params;
      notification.notification = data.data.message.replace(
        /[\[\]\w]+/g,
        (match) => params[match.slice(1, -1)] || match 
      );

      this.unread_notification_count += 1;

      this.notifications.unshift(notification);
    
      toast.info(notification.notification, {
        autoClose: 8000,
        icon: lowStockIcon,
        onClick: () => router.push(data.data.url),
        position: toast.POSITION.BOTTOM_LEFT,
      });
    },
  },
  getters: {},
  persist: false,
});
