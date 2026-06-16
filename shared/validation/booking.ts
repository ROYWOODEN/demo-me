import { z } from 'zod'

export const bookingSchema = z.object({
  room: z.enum(['Аудитория', 'Коворкинг', 'Кинозал'], {
    error: 'Выберите помещение',
  }),
  date: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Формат даты: ДД.ММ.ГГГГ'),
  paymentMethod: z.enum(
    ['Наличные', 'Банковская карта', 'Безналичный расчёт'],
    { error: 'Выберите способ оплаты' }
  ),
})

export type BookingData = z.infer<typeof bookingSchema>
