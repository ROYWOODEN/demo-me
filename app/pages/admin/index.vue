<template>
  <v-container class="py-8" fluid>
    <div class="text-h5 mb-6">Все заявки</div>

    <!-- Фильтры -->
    <v-card elevation="2" class="mb-4">
      <v-card-text>
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="search"
              label="Поиск по ФИО или логину"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="4" md="3">
            <v-select
              v-model="filterRoom"
              label="Помещение"
              :items="ROOM_ITEMS"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="4" md="3">
            <v-select
              v-model="filterStatus"
              label="Статус"
              :items="STATUS_ITEMS"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4" md="2">
            <v-btn
              variant="text"
              color="medium-emphasis"
              :disabled="!hasActiveFilters"
              block
              @click="resetFilters"
            >
              Сбросить
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Таблица -->
    <v-card elevation="2">
      <v-card-title class="pa-4 d-flex align-center ga-2">
        Заявки пользователей
        <v-chip size="small" color="primary">{{ processed.length }}</v-chip>
      </v-card-title>

      <v-skeleton-loader v-if="pending" type="table-row@5" class="pa-2" />

      <v-table v-else-if="paged.length > 0" fixed-header>
        <thead>
          <tr>
            <th class="text-left cursor-pointer" @click="toggleSort('id')">
              # <v-icon size="x-small">{{ sortIcon("id") }}</v-icon>
            </th>
            <th class="text-left">Пользователь</th>
            <th class="text-left">Помещение</th>
            <th class="text-left cursor-pointer" @click="toggleSort('date')">
              Дата <v-icon size="x-small">{{ sortIcon("date") }}</v-icon>
            </th>
            <th class="text-left">Способ оплаты</th>
            <th
              class="text-left cursor-pointer"
              @click="toggleSort('created_at')"
            >
              Подана
              <v-icon size="x-small">{{ sortIcon("created_at") }}</v-icon>
            </th>
            <th class="text-left" style="min-width: 220px">Статус</th>
            <th class="text-left">Отзыв</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in paged" :key="b.id">
            <td class="text-medium-emphasis">{{ b.id }}</td>
            <td>
              <div class="text-body-2 font-weight-medium">
                {{ b.user.full_name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ b.user.login }} · {{ b.user.phone }}
              </div>
            </td>
            <td>{{ b.room }}</td>
            <td>{{ formatDate(b.date) }}</td>
            <td>{{ paymentLabel(b.payment_method) }}</td>
            <td class="text-medium-emphasis">
              {{ formatDateTime(b.created_at) }}
            </td>
            <td>
              <v-select
                :model-value="b.status"
                :items="STATUS_ITEMS"
                variant="outlined"
                density="compact"
                hide-details
                :loading="saving === b.id"
                :disabled="saving !== null && saving !== b.id"
                @update:model-value="updateStatus(b.id, $event)"
              />
            </td>
            <td>
              <div style="max-width: 260px">
                <ReadMore v-if="b.review" :text="b.review" :limit="60" />
                <span v-else class="text-medium-emphasis">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-else-if="hasActiveFilters" class="pa-6 text-medium-emphasis">
        Ничего не найдено по выбранным фильтрам.
      </div>
      <div v-else class="pa-6 text-medium-emphasis">Заявок пока нет.</div>

      <!-- Пагинация -->
      <div v-if="totalPages > 1" class="d-flex justify-center pa-4">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="5"
          density="comfortable"
          rounded="circle"
        />
      </div>
    </v-card>
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
definePageMeta({ middleware: "admin" });

import { ROOM_ITEMS, STATUS_ITEMS, paymentLabel } from "#shared/domain";

const perPage = 10;

// Все заявки тянем один раз, дальше фильтруем/сортируем/листаем на клиенте
const {
  data: bookings,
  pending,
  refresh,
} = await useFetch("/api/admin/bookings", {
  default: () => [],
});

const search = ref("");
const filterRoom = ref<string | null>(null);
const filterStatus = ref<string | null>(null);
const sortBy = ref<"id" | "date" | "created_at">("created_at");
const sortOrder = ref<"asc" | "desc">("desc");
const page = ref(1);

const hasActiveFilters = computed(
  () => !!(search.value || filterRoom.value || filterStatus.value),
);

// Фильтрация + сортировка
const processed = computed(() => {
  let list = [...bookings.value];

  if (filterRoom.value) list = list.filter((b) => b.room === filterRoom.value);
  if (filterStatus.value)
    list = list.filter((b) => b.status === filterStatus.value);
  if (search.value?.trim()) {
    const q = search.value.trim().toLowerCase();
    list = list.filter(
      (b) =>
        b.user.full_name.toLowerCase().includes(q) ||
        b.user.login.toLowerCase().includes(q),
    );
  }

  list.sort((a, b) => {
    let cmp = 0;
    if (sortBy.value === "id") {
      cmp = a.id - b.id;
    } else if (sortBy.value === "date") {
      cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return sortOrder.value === "asc" ? cmp : -cmp;
  });

  return list;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(processed.value.length / perPage)),
);

const paged = computed(() => {
  const start = (page.value - 1) * perPage;
  return processed.value.slice(start, start + perPage);
});

// При смене фильтров возвращаемся на первую страницу
watch([search, filterRoom, filterStatus], () => {
  page.value = 1;
});

// Если страниц стало меньше (после фильтра или смены статуса) — не зависаем на пустой
watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp;
});

function resetFilters() {
  search.value = "";
  filterRoom.value = null;
  filterStatus.value = null;
  page.value = 1;
}

function toggleSort(col: "id" | "date" | "created_at") {
  if (sortBy.value === col) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = col;
    sortOrder.value = "asc";
  }
}

function sortIcon(col: string) {
  if (sortBy.value !== col) return "mdi-unfold-more-horizontal";
  return sortOrder.value === "asc" ? "mdi-arrow-up" : "mdi-arrow-down";
}

const saving = ref<number | null>(null);
const snackbar = reactive({ show: false, message: "", color: "success" });

function formatDate(d: string | Date) {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

function formatDateTime(d: string | Date) {
  const date = new Date(d);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${formatDate(d)} ${h}:${m}`;
}

async function updateStatus(id: number, status: string) {
  saving.value = id;
  try {
    await $fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      body: { status },
    });
    await refresh();
    snackbar.message = "Статус обновлён";
    snackbar.color = "success";
    snackbar.show = true;
  } catch (error: any) {
    snackbar.message = error.data?.message ?? "Ошибка при обновлении";
    snackbar.color = "error";
    snackbar.show = true;
  } finally {
    saving.value = null;
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  user-select: none;
}
</style>
