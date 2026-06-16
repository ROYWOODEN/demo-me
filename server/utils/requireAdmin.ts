import { prisma } from './prisma'

export async function requireAdmin(event: Parameters<typeof getUserSession>[0]) {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Доступ запрещён' })
  }
}
