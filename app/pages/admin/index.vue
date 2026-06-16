<template>
  <v-container class="py-8" fluid>
    <div class="text-h5 mb-6">Все заявки</div>

    <v-card elevation="2">
      <v-card-title class="pa-4 d-flex align-center gap-2">
        Заявки пользователей
        <v-chip size="small" color="primary">{{ bookings?.length ?? 0 }}</v-chip>
      </v-card-title>

      <v-skeleton-loader v-if="pending" type="table-row@5" class="pa-2" />

      <v-table v-else-if="bookings && bookings.length > 0" fixed-header>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Пользователь</th>
            <th class="text-left">Помещение</th>
            <th class="text-left">Дата</th>
            <th class="text-left">Способ оплаты</th>
            <th class="text-left" style="min-width: 220px">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bookings" :key="b.id">
            <td class="text-medium-emphasis">{{ b.id }}</td>
            <td>
              <div class="text-body-2 font-weight-medium">{{ b.user.full_name }}</div>
              <div class="text-caption text-medium-emphasis">{{ b.user.login }} · {{ b.user.phone }}</div>
            </td>
            <td>{{ b.room }}</td>
            <td>{{ formatDate(b.date) }}</td>
            <td>{{ formatEnum(b.payment_method) }}</td>
            <td>
              <v-select
                :model-value="b.status"
                :items="statuses"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="compact"
                hide-details
                :loading="saving === b.id"
                :disabled="saving !== null && saving !== b.id"
                @update:model-value="updateStatus(b.id, $event)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-else class="pa-6 text-medium-emphasis">Заявок пока нет.</div>
    </v-card>
  </v-container>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { data: bookings, pending, refresh } = await useFetch('/api/admin/bookings')

const saving = ref<number | null>(null)
const snackbar = reactive({ show: false, message: '', color: 'success' })

const statuses = [
  { label: 'Новая', value: 'Новая' },
  { label: 'Мероприятие назначено', value: 'Мероприятие_назначено' },
  { label: 'Мероприятие завершено', value: 'Мероприятие_завершено' },
]

function formatDate(d: string | Date) {
  const date = new Date(d)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getFullYear()}`
}

function formatEnum(value: string) {
  return value.replace(/_/g, ' ')
}

async function updateStatus(id: number, status: string) {
  saving.value = id
  try {
    await $fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      body: { status },
    })
    await refresh()
    snackbar.message = 'Статус обновлён'
    snackbar.color = 'success'
    snackbar.show = true
  } catch (error: any) {
    snackbar.message = error.data?.message ?? 'Ошибка при обновлении'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    saving.value = null
  }
}
</script>
