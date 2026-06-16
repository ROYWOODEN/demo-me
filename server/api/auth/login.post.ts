import { loginSchema } from "#shared/validation/auth";
import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues[0]?.message,
    });
  }

  const { login, password } = result.data;

  try {
    const user = await prisma.users.findFirst({ where: { login } });
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Неверный логин или пароль",
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw createError({
        statusCode: 401,
        message: "Неверный логин или пароль",
      });
    }

    await setUserSession(event, {
      user: { id: user.id, login: user.login, role: user.role },
    });

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("[login]", error);
    throw createError({
      statusCode: 500,
      message: error?.message ?? "Ошибка сервера при авторизации",
    });
  }
});
