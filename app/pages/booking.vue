<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">

        <div class="text-h5 mb-6">Оформление заявки</div>

        <!-- Слайдер -->
        <v-carousel
          cycle
          :interval="3000"
          height="260"
          class="mb-6 rounded-lg"
          show-arrows="hover"
        >
          <v-carousel-item v-for="slide in slides" :key="slide.color">
            <v-sheet :color="slide.color" height="100%" class="d-flex align-center justify-center">
              <div class="text-center">
                <v-icon size="48" color="white" class="mb-2">{{ slide.icon }}</v-icon>
                <div class="text-h6 text-white">{{ slide.label }}</div>
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>

        <!-- Форма -->
        <v-card class="pa-6" elevation="2">
          <v-card-title class="pa-0 mb-4">Выберите параметры</v-card-title>

          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-select
              v-model="formData.room"
              label="Помещение"
              :items="rooms"
              :rules="rules.room"
              variant="outlined"
              class="mb-2"
            />

            <v-menu v-model="dateMenu" :close-on-content-click="false">
              <template #activator="{ props }">
                <v-text-field
                  v-model="formData.date"
                  label="Дата начала конференции"
                  :rules="rules.date"
                  variant="outlined"
                  class="mb-2"
                  placeholder="ДД.ММ.ГГГГ"
                  readonly
                  v-bind="props"
                  append-inner-icon="mdi-calendar"
                />
              </template>
              <v-date-picker
                v-model="datePickerValue"
                @update:model-value="onDateSelect"
              />
            </v-menu>

            <v-select
              v-model="formData.paymentMethod"
              label="Способ оплаты"
              :items="paymentMethods"
              :rules="rules.paymentMethod"
              variant="outlined"
              class="mb-4"
            />

            <v-btn type="submit" color="primary" block size="large" :loading="loading">
              Подать заявку
            </v-btn>
          </v-form>
        </v-card>

      </v-col>
    </v-row>
  </v-container>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const form = ref()
const loading = ref(false)

const slides = [
  { color: 'blue-darken-2', label: 'Аудитория', icon: 'mdi-school' },
  { color: 'teal-darken-2', label: 'Коворкинг', icon: 'mdi-desk' },
  { color: 'purple-darken-2', label: 'Кинозал', icon: 'mdi-movie' },
  { color: 'orange-darken-2', label: 'Конференции.РФ', icon: 'mdi-calendar-star' },
]

const rooms = ['Аудитория', 'Коворкинг', 'Кинозал']
const paymentMethods = ['Наличные', 'Банковская карта', 'Безналичный расчёт']

const formData = reactive({
  room: '',
  date: '',
  paymentMethod: '',
})

const snackbar = reactive({ show: false, message: '', color: 'error' })
const dateMenu = ref(false)
const datePickerValue = ref<Date | null>(null)

function showSnackbar(message: string, color = 'error') {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

function onDateSelect(date: Date) {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  formData.date = `${d}.${m}.${y}`
  dateMenu.value = false
}

const rules = {
  room: [(v: string) => !!v || 'Выберите помещение'],
  date: [(v: string) => !!v || 'Укажите дату'],
  paymentMethod: [(v: string) => !!v || 'Выберите способ оплаты'],
}

async function handleSubmit() {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await $fetch('/api/bookings/create', {
      method: 'POST',
      body: formData,
    })
    showSnackbar('Заявка успешно подана', 'success')
    await navigateTo('/profile')
  } catch (error: any) {
    showSnackbar(error.data?.message ?? 'Ошибка при подаче заявки')
  } finally {
    loading.value = false
  }
}
</script>
