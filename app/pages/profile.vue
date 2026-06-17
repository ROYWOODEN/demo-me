<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <div class="d-flex align-center justify-space-between mb-6">
          <div class="text-h5">Личный кабинет</div>
          <v-btn variant="outlined" color="error" @click="logout">Выйти</v-btn>
        </div>

        <v-carousel
          cycle
          :interval="3000"
          height="280"
          class="mb-6 rounded-lg"
          show-arrows="always"
        >
          <v-carousel-item
            v-for="slide in slides"
            :key="slide.label"
            :src="slide.img"
            cover
          >
            <div
              class="d-flex flex-column align-center justify-center fill-height"
            >
              <v-icon size="72" color="white" class="mb-3">{{ slide.icon }}</v-icon>
              <div class="text-h5 font-weight-bold text-white">
                {{ slide.label }}
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>

        <v-card class="pa-6 mb-6" elevation="2" v-if="user">
          <v-card-title class="pa-0 mb-4">Данные профиля</v-card-title>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="text-caption text-medium-emphasis">ФИО</div>
              <div class="text-body-1">{{ user.full_name }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-caption text-medium-emphasis">Дата рождения</div>
              <div class="text-body-1">
                {{ user.birth_date ? formatDate(user.birth_date) : "—" }}
              </div>
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

        <v-card class="pa-6" elevation="2">
          <div class="d-flex align-center justify-space-between mb-4">
            <v-card-title class="pa-0">Мои заявки</v-card-title>
            <v-btn variant="tonal" color="primary" size="small" to="/booking">
              + Новая заявка
            </v-btn>
          </div>

          <v-skeleton-loader
            v-if="bookingsPending"
            type="list-item-three-line"
          />

          <template v-else-if="bookings && bookings.length > 0">
            <v-card
              v-for="b in bookings"
              :key="b.id"
              variant="outlined"
              class="mb-3 pa-4"
            >
              <div
                class="d-flex align-center justify-space-between flex-wrap gap-2"
              >
                <div>
                  <div class="text-body-1 font-weight-medium">{{ b.room }}</div>
                  <div class="text-body-2 text-medium-emphasis mt-1">
                    {{ formatDate(b.date) }} ·
                    {{ paymentLabel(b.payment_method) }}
                  </div>
                </div>
                <v-chip :color="statusColor(b.status)" size="small">
                  {{ statusLabel(b.status) }}
                </v-chip>
              </div>

              <template v-if="b.review">
                <v-divider class="my-3" />
                <div class="text-caption text-medium-emphasis mb-1">
                  Ваш отзыв
                </div>
                <ReadMore :text="b.review" :limit="160" />
                <div class="d-flex ga-3 mt-2">
                  <v-btn
                    variant="text"
                    size="small"
                    color="primary"
                    class="px-0"
                    @click="openReview(b)"
                  >
                    Изменить
                  </v-btn>
                  <v-btn
                    variant="text"
                    size="small"
                    color="error"
                    class="px-0"
                    @click="confirmDelete(b)"
                  >
                    Удалить
                  </v-btn>
                </div>
              </template>

              <template v-else-if="b.status === REVIEW_STATUS">
                <v-divider class="my-3" />
                <v-btn
                  variant="tonal"
                  size="small"
                  color="primary"
                  prepend-icon="mdi-comment-quote-outline"
                  @click="openReview(b)"
                >
                  Оставить отзыв
                </v-btn>
              </template>
            </v-card>
          </template>

          <div v-else class="text-medium-emphasis">У вас пока нет заявок.</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="reviewDialog" max-width="500">
    <v-card>
      <v-card-title class="pt-4">Отзыв об обучении</v-card-title>
      <v-card-text>
        <div v-if="activeBooking" class="text-body-2 text-medium-emphasis mb-3">
          {{ activeBooking.room }} · {{ formatDate(activeBooking.date) }}
        </div>
        <v-textarea
          v-model="reviewText"
          label="Ваш отзыв"
          variant="outlined"
          rows="4"
          counter="1000"
          maxlength="1000"
          autofocus
          hide-details="auto"
        />
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="reviewDialog = false">Отмена</v-btn>
        <v-btn
          color="primary"
          :loading="reviewSaving"
          :disabled="!reviewText.trim()"
          @click="submitReview"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="pt-4">Удалить отзыв?</v-card-title>
      <v-card-text>Отзыв будет удалён без возможности восстановления.</v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="deleteDialog = false">Отмена</v-btn>
        <v-btn color="error" :loading="deleting" @click="doDeleteReview">
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
definePageMeta({ middleware: "auth" });

import {
  REVIEW_STATUS,
  statusColor,
  statusLabel,
  paymentLabel,
} from "#shared/domain";

const user = computed(() => useUserStore().user);

const slides = [
  { img: "/img/bus.svg", icon: "mdi-bus", label: "Автобус" },
  { img: "/img/electrobus.svg", icon: "mdi-bus-electric", label: "Электробус" },
  { img: "/img/tram.svg", icon: "mdi-tram", label: "Трамвай" },
  { img: "/img/about.svg", icon: "mdi-steering", label: "Пассажирам.РФ" },
];

const {
  data: bookings,
  pending: bookingsPending,
  refresh: refreshBookings,
} = await useFetch("/api/bookings");

function formatDate(d: string | Date) {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const reviewDialog = ref(false);
const activeBooking = ref<any>(null);
const reviewText = ref("");
const reviewSaving = ref(false);
const snackbar = reactive({ show: false, message: "", color: "success" });

function openReview(b: any) {
  activeBooking.value = b;
  reviewText.value = b.review ?? "";
  reviewDialog.value = true;
}

async function submitReview() {
  if (!reviewText.value.trim() || !activeBooking.value) return;
  reviewSaving.value = true;
  try {
    await $fetch(`/api/bookings/${activeBooking.value.id}/review`, {
      method: "PATCH",
      body: { review: reviewText.value.trim() },
    });
    await refreshBookings();
    reviewDialog.value = false;
    snackbar.message = "Отзыв сохранён";
    snackbar.color = "success";
    snackbar.show = true;
  } catch (error: any) {
    snackbar.message = error.data?.message ?? "Ошибка при сохранении отзыва";
    snackbar.color = "error";
    snackbar.show = true;
  } finally {
    reviewSaving.value = false;
  }
}

const deleteDialog = ref(false);
const deleteTarget = ref<any>(null);
const deleting = ref(false);

function confirmDelete(b: any) {
  deleteTarget.value = b;
  deleteDialog.value = true;
}

async function doDeleteReview() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await $fetch(`/api/bookings/${deleteTarget.value.id}/review`, {
      method: "DELETE",
    });
    await refreshBookings();
    deleteDialog.value = false;
    snackbar.message = "Отзыв удалён";
    snackbar.color = "success";
    snackbar.show = true;
  } catch (error: any) {
    snackbar.message = error.data?.message ?? "Ошибка при удалении отзыва";
    snackbar.color = "error";
    snackbar.show = true;
  } finally {
    deleting.value = false;
  }
}

const { fetch: refreshSession } = useUserSession();

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  useUserStore().clear();
  await refreshSession();
  await navigateTo("/login");
}
</script>
