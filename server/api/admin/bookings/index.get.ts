import { prisma } from "../../../utils/prisma";
import { requireAdmin } from "../../../utils/requireAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  try {
    const bookings = await prisma.bookings.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { full_name: true, login: true, phone: true, email: true },
        },
      },
    });
    return bookings;
  } catch (error: any) {
    console.error("[admin/bookings]", error);
    throw createError({
      statusCode: 500,
      message: error?.message ?? "Ошибка при получении заявок",
    });
  }
});
