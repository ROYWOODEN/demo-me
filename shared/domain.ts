// =============================================================================
//  ДОМЕННЫЕ ЗНАЧЕНИЯ ПОРТАЛА — единый источник правды.
//
//  Чтобы переключить проект на другой вариант ТЗ (другой портал), меняешь
//  значения ТОЛЬКО здесь + соответствующие enum'ы в prisma/schema.prisma,
//  затем выполняешь `npx prisma db push`. Больше нигде править не нужно.
//
//  Правило значений С ПРОБЕЛОМ: в коде используем имя с подчёркиванием
//  (ровно как в Prisma-клиенте), а человекочитаемую подпись задаём в *_LABELS.
//  Пример: value "Мероприятие_завершено" → подпись "Мероприятие завершено".
//  Если значение без пробела (помещения) — value и подпись совпадают.
// =============================================================================

// --- Помещения (в этом варианте без пробелов: value === подпись) ---
export const ROOMS = ["Аудитория", "Коворкинг", "Кинозал"] as const;

// --- Способы оплаты: value = имя enum в Prisma, подпись = в PAYMENT_LABELS ---
export const PAYMENT_VALUES = [
  "Наличные",
  "Банковская_карта",
  "Безналичный_расчёт",
] as const;
export const PAYMENT_LABELS: Record<string, string> = {
  Наличные: "Наличные",
  Банковская_карта: "Банковская карта",
  Безналичный_расчёт: "Безналичный расчёт",
};

// --- Статусы заявки: value = имя enum, подпись = LABELS, цвет чипа = COLORS ---
export const STATUS_VALUES = [
  "Новая",
  "Мероприятие_назначено",
  "Мероприятие_завершено",
] as const;
export const STATUS_LABELS: Record<string, string> = {
  Новая: "Новая",
  Мероприятие_назначено: "Мероприятие назначено",
  Мероприятие_завершено: "Мероприятие завершено",
};
export const STATUS_COLORS: Record<string, string> = {
  Новая: "blue",
  Мероприятие_назначено: "orange",
  Мероприятие_завершено: "green",
};

// --- Ключевые статусы ---
export const INITIAL_STATUS = "Новая"; // статус, который присваивается новой заявке
export const REVIEW_STATUS = "Мероприятие_завершено"; // при нём пользователь может оставить отзыв

// --- Готовые списки для <v-select> (Vuetify по умолчанию ждёт { title, value }) ---
export const ROOM_ITEMS = ROOMS.map((r) => ({ title: r, value: r }));
export const PAYMENT_ITEMS = PAYMENT_VALUES.map((v) => ({
  title: PAYMENT_LABELS[v],
  value: v,
}));
export const STATUS_ITEMS = STATUS_VALUES.map((v) => ({
  title: STATUS_LABELS[v],
  value: v,
}));

// --- Хелперы для отображения (value enum → подпись/цвет) ---
export const paymentLabel = (v: string) => PAYMENT_LABELS[v] ?? v;
export const statusLabel = (v: string) => STATUS_LABELS[v] ?? v;
export const statusColor = (v: string) => STATUS_COLORS[v] ?? "grey";
