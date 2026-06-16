import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: "Не авторизован" });
  }

  try {
    const bookings = await prisma.bookings.findMany({
      where: { user_id: session.user.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        room: true,
        date: true,
        payment_method: true,
        status: true,
        review: true,
        created_at: true,
      },
    });

    return bookings;
  } catch (error: any) {
    console.error("[bookings/index]", error);
    throw createError({
      statusCode: 500,
      message: error?.message ?? "Ошибка при получении заявок",
    });
  }
});
