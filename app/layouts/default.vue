<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>Пассажирам.РФ</v-app-bar-title>

      <template v-if="!mobile" #append>
        <v-btn
          v-if="isAdmin"
          to="/admin"
          variant="tonal"
          color="warning"
          class="mr-1"
        >
          Администратор
        </v-btn>
        <v-btn to="/profile" variant="text">Личный кабинет</v-btn>
        <v-btn to="/booking" variant="text">Подать заявку</v-btn>
        <v-btn
          variant="outlined"
          color="error"
          class="ml-2 mr-2"
          @click="logout"
        >
          Выйти
        </v-btn>
      </template>
    </v-app-bar>

    <v-main style="padding-top: 64px">
      <slot />
    </v-main>

    <ClientOnly>
      <v-bottom-navigation v-if="mobile" grow>
        <v-btn v-if="isAdmin" to="/admin" color="warning">
          <v-icon>mdi-shield-account</v-icon>
          <span>Админ</span>
        </v-btn>
        <v-btn to="/profile">
          <v-icon>mdi-account</v-icon>
          <span>Кабинет</span>
        </v-btn>
        <v-btn to="/booking">
          <v-icon>mdi-plus-circle</v-icon>
          <span>Заявка</span>
        </v-btn>
        <v-btn @click="logout" color="error">
          <v-icon>mdi-logout</v-icon>
          <span>Выйти</span>
        </v-btn>
      </v-bottom-navigation>
    </ClientOnly>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { CurrentUser } from "~/stores/user";

const { mobile } = useDisplay();
const store = useUserStore();
const { fetch: refreshSession } = useUserSession();
const requestFetch = useRequestFetch();

if (!store.user) {
  try {
    store.user = await requestFetch<CurrentUser>("/api/user/me");
  } catch {
    store.user = null;
  }
}

const isAdmin = computed(() => store.user?.role === "admin");

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  store.clear();
  await refreshSession();
  await navigateTo("/login");
}
</script>
