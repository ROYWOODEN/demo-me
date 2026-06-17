import { defineStore } from 'pinia'

export interface CurrentUser {
  id: number
  login: string
  full_name: string
  birth_date: string | null
  phone: string
  email: string
  role: 'admin' | 'user'
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as CurrentUser | null,
  }),
  actions: {
    clear() {
      this.user = null
    },
  },
})
