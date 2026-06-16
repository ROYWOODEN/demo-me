import { bookingSchema } from "#shared/validation/booking";
import { prisma } from "../../utils/prisma";

const paymentMap: Record<string, string> = {
  Наличные: "Наличные",
  "Банковская карта": "Банковская_карта",
  "Безналичный расчёт": "Безналичный_расчёт",
};

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: "Не авторизован" });
  }

  const body = await readBody(event);
  const result = bookingSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues[0]?.message,
    });
  }

  const { room, date, paymentMethod } = result.data;

  const parts = date.split(".");
  const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  try {
    const booking = await prisma.bookings.create({
      data: {
        user_id: session.user.id,
        room: room as any,
        date: new Date(isoDate),
        payment_method: paymentMap[paymentMethod] as any,
        status: "Новая" as any,
      },
    });

    return { success: true, id: booking.id };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("[bookings/create]", error);
    throw createError({
      statusCode: 500,
      message: error?.message ?? "Ошибка при создании заявки",
    });
  }
});
