import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMIN_LOGIN = 'Admin26'
const ADMIN_PASSWORD = 'Demo20'

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)

  // login не помечен @unique в схеме, поэтому ищем вручную
  const existing = await prisma.users.findFirst({ where: { login: ADMIN_LOGIN } })

  if (existing) {
    await prisma.users.update({
      where: { id: existing.id },
      data: { password: passwordHash, role: 'admin' },
    })
    console.log(`Админ обновлён (id=${existing.id}, логин=${ADMIN_LOGIN})`)
  } else {
    const user = await prisma.users.create({
      data: {
        login: ADMIN_LOGIN,
        password: passwordHash,
        full_name: 'Администратор',
        phone: '00000000000',
        email: 'admin@conf.rf',
        role: 'admin',
      },
    })
    console.log(`Админ создан (id=${user.id}, логин=${ADMIN_LOGIN}, пароль=${ADMIN_PASSWORD})`)
  }
}

main()
  .catch((e) => {
    console.error('Ошибка сидинга:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
