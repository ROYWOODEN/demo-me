import { registerSchema } from "#shared/validation/auth";
import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues[0]?.message,
    });
  }

  const { login, password, fullName, birthDate, phone, email } = result.data;

  const [d, m, y] = birthDate.split(".");
  const birthIso = `${y}-${m}-${d}`;

  try {
    const existingLogin = await prisma.users.findFirst({ where: { login } });
    if (existingLogin) {
      throw createError({ statusCode: 409, message: "Этот логин уже занят" });
    }

    const existingEmail = await prisma.users.findFirst({ where: { email } });
    if (existingEmail) {
      throw createError({
        statusCode: 409,
        message: "Этот e-mail уже зарегистрирован",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        login,
        password: hashedPassword,
        full_name: fullName,
        birth_date: new Date(birthIso),
        phone: phone.replace(/\D/g, ""),
        email,
      },
    });

    await setUserSession(event, {
      user: { id: user.id, login: user.login, role: user.role },
    });

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("[register]", error);
    throw createError({
      statusCode: 500,
      message: error?.message ?? "Ошибка сервера при регистрации",
    });
  }
});
