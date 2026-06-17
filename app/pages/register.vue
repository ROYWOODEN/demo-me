<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-6" elevation="4">
          <v-card-title class="text-h5 text-center pb-1"
            >Конференции.РФ</v-card-title
          >
          <v-card-subtitle class="text-center pb-6"
            >Регистрация</v-card-subtitle
          >

          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="formData.login"
              label="Логин"
              :rules="rules.login"
              variant="outlined"
              class="mb-2"
              hint="Только латинские буквы и цифры, минимум 6 символов"
            />
            <v-text-field
              v-model="formData.password"
              label="Пароль"
              type="password"
              :rules="rules.password"
              variant="outlined"
              class="mb-2"
              hint="Минимум 8 символов"
            />
            <v-text-field
              v-model="formData.fullName"
              label="ФИО"
              :rules="rules.fullName"
              variant="outlined"
              class="mb-2"
            />
            <v-menu v-model="birthMenu" :close-on-content-click="false">
              <template #activator="{ props }">
                <v-text-field
                  v-model="formData.birthDate"
                  label="Дата рождения"
                  :rules="rules.birthDate"
                  variant="outlined"
                  class="mb-2"
                  placeholder="ДД.ММ.ГГГГ"
                  readonly
                  v-bind="props"
                  append-inner-icon="mdi-calendar"
                />
              </template>
              <v-date-picker
                v-model="birthPickerValue"
                :max="maxBirthDate"
                @update:model-value="onBirthSelect"
              />
            </v-menu>
            <v-text-field
              v-model="formData.phone"
              label="Контактный номер телефона"
              :rules="rules.phone"
              variant="outlined"
              class="mb-2"
              maxlength="11"
              @input="formData.phone = formData.phone.replace(/\D/g, '')"
            />
            <v-text-field
              v-model="formData.email"
              label="E-mail"
              :rules="rules.email"
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
              Зарегистрироваться
            </v-btn>
          </v-form>

          <div class="text-center mt-4">
            <NuxtLink to="/login">Уже зарегистрированы? Войти</NuxtLink>
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

import { registerSchema } from "#shared/validation/auth";
import { zodFieldRule } from "#shared/validation/utils";

const form = ref();
const loading = ref(false);

const formData = reactive({
  login: "",
  password: "",
  fullName: "",
  birthDate: "",
  phone: "",
  email: "",
});

const birthMenu = ref(false);
const birthPickerValue = ref<Date | null>(null);

const maxBirthDate = computed(() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
});

function onBirthSelect(date: Date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  formData.birthDate = `${d}.${m}.${y}`;
  birthMenu.value = false;
}

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
  login: [zodFieldRule(registerSchema.shape.login)],
  password: [zodFieldRule(registerSchema.shape.password)],
  fullName: [zodFieldRule(registerSchema.shape.fullName)],
  birthDate: [zodFieldRule(registerSchema.shape.birthDate)],
  phone: [
    (v: string) =>
      /^\d{11}$/.test(v.replace(/\D/g, "")) ||
      "Введите 11-значный номер телефона",
  ],
  email: [zodFieldRule(registerSchema.shape.email)],
};

async function handleSubmit() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await $fetch("/api/auth/register", { method: "POST", body: formData });
    showSnackbar("Регистрация прошла успешно", "success");
    await navigateTo("/profile");
  } catch (error: any) {
    showSnackbar(error.data?.message ?? "Ошибка регистрации");
  } finally {
    loading.value = false;
  }
}
</script>
