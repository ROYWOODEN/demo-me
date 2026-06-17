<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-6" elevation="4">
          <v-card-title class="text-h5 text-center pb-1"
            >Пассажирам.РФ</v-card-title
          >
          <v-card-subtitle class="text-center pb-6"
            >Вход в систему</v-card-subtitle
          >

          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="formData.login"
              label="Логин"
              :rules="rules.login"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="formData.password"
              label="Пароль"
              type="password"
              :rules="rules.password"
              variant="outlined"
              class="mb-4"
            />

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
            >
              Войти
            </v-btn>
          </v-form>

          <div class="text-center mt-4">
            <NuxtLink to="/register"
              >Еще не зарегистрированы? Регистрация</NuxtLink
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
    location="top"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth", middleware: "guest" });

import { loginSchema } from "#shared/validation/auth";
import { zodFieldRule } from "#shared/validation/utils";

const form = ref();
const loading = ref(false);

const formData = reactive({
  login: "",
  password: "",
});

const snackbar = reactive({
  show: false,
  message: "",
  color: "error",
});

function showSnackbar(message: string, color = "error") {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
}

const rules = {
  login: [zodFieldRule(loginSchema.shape.login)],
  password: [zodFieldRule(loginSchema.shape.password)],
};

const { fetch: refreshSession } = useUserSession();

async function handleSubmit() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await $fetch("/api/auth/login", { method: "POST", body: formData });
    await refreshSession();
    await navigateTo("/profile");
  } catch (error: any) {
    showSnackbar(error.data?.message ?? "Ошибка входа");
  } finally {
    loading.value = false;
  }
}
</script>
