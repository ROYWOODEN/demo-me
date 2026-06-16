import { defineStore } from 'pinia'

export interface CurrentUser {
  id: number
  login: string
  full_name: string
  phone: string
  email: string
  role: 'admin' | 'user'
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as CurrentUser | null,
  }),
  actions: {
    async fetchUser() {
      try {
        this.user = await $fetch<CurrentUser>('/api/user/me')
      } catch {
        this.user = null
      }
    },
    clear() {
      this.user = null
    },
  },
})
