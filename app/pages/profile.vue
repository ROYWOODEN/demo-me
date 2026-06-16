<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">

        <div class="d-flex align-center justify-space-between mb-6">
          <div class="text-h5">Личный кабинет</div>
          <v-btn variant="outlined" color="error" @click="logout">Выйти</v-btn>
        </div>

        <!-- Данные профиля -->
        <v-card class="pa-6 mb-6" elevation="2" v-if="user">
          <v-card-title class="pa-0 mb-4">Данные профиля</v-card-title>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="text-caption text-medium-emphasis">ФИО</div>
              <div class="text-body-1">{{ user.full_name }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-caption text-medium-emphasis">Логин</div>
              <div class="text-body-1">{{ user.login }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-caption text-medium-emphasis">Телефон</div>
              <div class="text-body-1">{{ user.phone }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-caption text-medium-emphasis">E-mail</div>
              <div class="text-body-1">{{ user.email }}</div>
            </v-col>
          </v-row>
        </v-card>

        <v-skeleton-loader v-else-if="pending" type="card" class="mb-6" />

        <!-- Заявки -->
        <v-card class="pa-6" elevation="2">
          <div class="d-flex align-center justify-space-between mb-4">
            <v-card-title class="pa-0">Мои заявки</v-card-title>
            <v-btn variant="tonal" color="primary" size="small" to="/booking">
              + Новая заявка
            </v-btn>
          </div>

          <v-skeleton-loader v-if="bookingsPending" type="list-item-three-line" />

          <template v-else-if="bookings && bookings.length > 0">
            <v-card
              v-for="b in bookings"
              :key="b.id"
              variant="outlined"
              class="mb-3 pa-4"
            >
              <div class="d-flex align-center justify-space-between flex-wrap gap-2">
                <div>
                  <div class="text-body-1 font-weight-medium">{{ b.room }}</div>
                  <div class="text-body-2 text-medium-emphasis mt-1">
                    {{ formatDate(b.date) }} · {{ formatEnum(b.payment_method) }}
                  </div>
                </div>
                <v-chip :color="statusColor(b.status)" size="small">
                  {{ formatEnum(b.status) }}
                </v-chip>
              </div>
            </v-card>
          </template>

          <div v-else class="text-medium-emphasis">
            У вас пока нет заявок.
          </div>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { pending } = await useCurrentUser()
const user = computed(() => useUserStore().user)

const { data: bookings, pending: bookingsPending } = await useFetch('/api/bookings')

function formatDate(d: string | Date) {
  const date = new Date(d)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

function formatEnum(value: string) {
  return value.replace(/_/g, ' ')
}

function statusColor(status: string) {
  if (status === 'Новая') return 'blue'
  if (status.includes('назначено')) return 'orange'
  if (status.includes('завершено')) return 'green'
  return 'grey'
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  useUserStore().clear()
  await navigateTo('/login')
}
</script>
