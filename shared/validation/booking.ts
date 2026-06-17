import { z } from 'zod'
import { ROOMS, PAYMENT_VALUES } from '../domain'

export const bookingSchema = z.object({
  room: z.enum(ROOMS, { error: 'Выберите помещение' }),
  date: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Формат даты: ДД.ММ.ГГГГ'),
  paymentMethod: z.enum(PAYMENT_VALUES, { error: 'Выберите способ оплаты' }),
})

export type BookingData = z.infer<typeof bookingSchema>

export const reviewSchema = z.object({
  review: z
    .string()
    .trim()
    .min(1, 'Отзыв не может быть пустым')
    .max(1000, 'Отзыв не должен превышать 1000 символов'),
})

export type ReviewData = z.infer<typeof reviewSchema>
