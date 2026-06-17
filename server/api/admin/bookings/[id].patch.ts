import { z } from "zod";
import { STATUS_VALUES } from "#shared/domain";
import { prisma } from "../../../utils/prisma";
import { requireAdmin } from "../../../utils/requireAdmin";

const schema = z.object({
  status: z.enum(STATUS_VALUES),
});

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  if (!id || isNaN(id))
    throw createError({ statusCode: 400, message: "Некорректный ID" });

  const body = await readBody(event);
  const result = schema.safeParse(body);
  if (!result.success)
    throw createError({
      statusCode: 400,
      message: result.error.issues[0]?.message,
    });

  try {
    const booking = await prisma.bookings.update({
      where: { id },
      data: { status: result.data.status as any },
    });
    return { success: true, id: booking.id };
  } catch (error: any) {
    console.error("[admin/bookings/update]", error);
    throw createError({
      statusCode: 500,
      message: error?.message ?? "Ошибка при обновлении статуса",
    });
  }
});
