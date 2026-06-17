export const ROOMS = ["Аудитория", "Коворкинг", "Кинозал"] as const;

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

export const INITIAL_STATUS = "Новая";
export const REVIEW_STATUS = "Мероприятие_завершено";

export const ROOM_ITEMS = ROOMS.map((r) => ({ title: r, value: r }));
export const PAYMENT_ITEMS = PAYMENT_VALUES.map((v) => ({
  title: PAYMENT_LABELS[v],
  value: v,
}));
export const STATUS_ITEMS = STATUS_VALUES.map((v) => ({
  title: STATUS_LABELS[v],
  value: v,
}));

export const paymentLabel = (v: string) => PAYMENT_LABELS[v] ?? v;
export const statusLabel = (v: string) => STATUS_LABELS[v] ?? v;
export const statusColor = (v: string) => STATUS_COLORS[v] ?? "grey";
