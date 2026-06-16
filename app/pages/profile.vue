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


async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  useUserStore().clear()
  await navigateTo('/login')
}
</script>
