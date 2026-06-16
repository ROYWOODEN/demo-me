<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>
        Конференции.РФ
        <v-chip size="x-small" color="warning" class="ml-2">Администратор</v-chip>
      </v-app-bar-title>

      <template #append>
        <v-btn to="/" variant="text" class="mr-1">На сайт</v-btn>
        <v-btn variant="outlined" color="error" class="mr-2" @click="logout">Выйти</v-btn>
      </template>
    </v-app-bar>

    <v-main style="padding-top: 64px">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const { fetch: refreshSession } = useUserSession();

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  useUserStore().clear()
  await refreshSession()
  await navigateTo('/login')
}
</script>
