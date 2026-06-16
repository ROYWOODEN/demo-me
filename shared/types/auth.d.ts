declare module '#auth-utils' {
  interface User {
    id: number
    login: string
    role: 'admin' | 'user'
  }
}

export {}
