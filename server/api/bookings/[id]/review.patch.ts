import { reviewSchema } from '#shared/validation/booking'
import { REVIEW_STATUS } from '#shared/domain'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Некорректный ID заявки' })
  }

  const body = await readBody(event)
  const result = reviewSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.issues[0]?.message })
  }

  try {
    const booking = await prisma.bookings.findUnique({ where: { id } })

    if (!booking || booking.user_id !== session.user.id) {
      throw createError({ statusCode: 404, message: 'Заявка не найдена' })
    }

    if (booking.status !== REVIEW_STATUS) {
      throw createError({
        statusCode: 400,
        message: 'Отзыв можно оставить только после завершения обучения',
      })
    }

    await prisma.bookings.update({
      where: { id },
      data: { review: result.data.review },
    })

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[bookings/review]', error)
    throw createError({ statusCode: 500, message: error?.message ?? 'Ошибка при сохранении отзыва' })
  }
})
