declare module '#auth-utils' {
  interface UserSession {
    user: {
      id: number
      login: string
      role: 'admin' | 'user'
    }
  }
}

export {}
