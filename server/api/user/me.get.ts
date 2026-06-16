import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  try {
    const user = await prisma.users.findFirst({
      where: { id: session.user.id },
      select: {
        id: true,
        login: true,
        full_name: true,
        phone: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      throw createError({ statusCode: 404, message: 'Пользователь не найден' })
    }

    return user
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[me]', error)
    throw createError({ statusCode: 500, message: error?.message ?? 'Ошибка сервера' })
  }
})
