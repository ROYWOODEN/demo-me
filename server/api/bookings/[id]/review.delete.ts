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

  try {
    const booking = await prisma.bookings.findUnique({ where: { id } })

    if (!booking || booking.user_id !== session.user.id) {
      throw createError({ statusCode: 404, message: 'Заявка не найдена' })
    }

    await prisma.bookings.update({
      where: { id },
      data: { review: null },
    })

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[bookings/review/delete]', error)
    throw createError({ statusCode: 500, message: error?.message ?? 'Ошибка при удалении отзыва' })
  }
})
