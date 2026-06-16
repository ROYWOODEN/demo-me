<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>Конференции.РФ</v-app-bar-title>

      <template v-if="!mobile" #append>
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

const { mobile } = useDisplay();

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  await navigateTo("/login");
}
</script>
