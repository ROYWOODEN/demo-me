export const ROOMS = ["Автобус", "Электробус", "Трамвай"] as const;

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
  "Идет_обучение",
  "Обучение_завершено",
] as const;
export const STATUS_LABELS: Record<string, string> = {
  Новая: "Новая",
  Идет_обучение: "Идет обучение",
  Обучение_завершено: "Обучение завершено",
};
export const STATUS_COLORS: Record<string, string> = {
  Новая: "blue",
  Идет_обучение: "orange",
  Обучение_завершено: "green",
};

export const INITIAL_STATUS = "Новая";
export const REVIEW_STATUS = "Обучение_завершено";

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
