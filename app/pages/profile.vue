<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">

        <div class="d-flex align-center justify-space-between mb-6">
          <div class="text-h5">Личный кабинет</div>
          <v-btn variant="outlined" color="error" @click="logout">Выйти</v-btn>
        </div>

        <!-- Слайдер -->
        <v-carousel
          cycle
          :interval="3000"
          height="280"
          class="mb-6 rounded-lg"
          show-arrows="hover"
        >
          <v-carousel-item v-for="slide in slides" :key="slide.color">
            <v-sheet :color="slide.color" height="100%" class="d-flex align-center justify-center">
              <span class="text-h6 text-white">{{ slide.label }}</span>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>

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
          <v-card-title class="pa-0 mb-4">Мои заявки</v-card-title>
          <v-card-text class="pa-0 text-medium-emphasis">
            У вас пока нет заявок.
            <NuxtLink to="/booking">Оформить заявку</NuxtLink>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { pending } = await useCurrentUser()
const user = computed(() => useUserStore().user)

const slides = [
  { color: 'blue-darken-2', label: 'Фото 1' },
  { color: 'teal-darken-2', label: 'Фото 2' },
  { color: 'purple-darken-2', label: 'Фото 3' },
  { color: 'orange-darken-2', label: 'Фото 4' },
]

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  useUserStore().clear()
  await navigateTo('/login')
}
</script>
