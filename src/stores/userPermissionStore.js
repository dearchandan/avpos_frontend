import { defineStore } from 'pinia'

export const useUserPermissionStore = defineStore('userPermissionStore', {
  state: () => ({
      permissions: [],
  }),
  actions: {
    setPermissions(value){
        this.permissions = value;
    }
  },
  getters: {
    getPermissions() {
        return this.permissions;
    },
    resetPermissions() {
        this.permissions = [];
    }
  }
})