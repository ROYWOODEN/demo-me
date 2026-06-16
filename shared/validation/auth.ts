import { z } from 'zod'

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, 'Логин обязателен')
    .regex(/^[a-zA-Z0-9]+$/, 'Логин должен содержать только латинские буквы и цифры'),
  password: z
    .string()
    .min(1, 'Пароль обязателен'),
})

export const registerSchema = z.object({
  login: z
    .string()
    .min(6, 'Логин должен содержать минимум 6 символов')
    .regex(/^[a-zA-Z0-9]+$/, 'Логин должен содержать только латинские буквы и цифры'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов'),
  fullName: z
    .string()
    .min(1, 'ФИО обязательно'),
  phone: z
    .string()
    .regex(/^\d{11}$/, 'Телефон должен содержать ровно 11 цифр'),
  email: z.email('Введите корректный e-mail, например: user@mail.ru'),
})

export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
