import type { ZodTypeAny } from 'zod'

export function zodFieldRule(schema: ZodTypeAny) {
  return (value: unknown): true | string => {
    const result = schema.safeParse(value)
    if (result.success) return true
    return result.error.issues[0]?.message ?? 'Ошибка'
  }
}
