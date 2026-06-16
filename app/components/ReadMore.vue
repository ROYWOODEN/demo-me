<template>
  <div>
    <span class="text-body-2" style="white-space: pre-line">{{ displayText }}</span>
    <v-btn
      v-if="isLong"
      variant="text"
      size="x-small"
      color="primary"
      class="px-1"
      @click="expanded = !expanded"
    >
      {{ expanded ? "Свернуть" : "Читать далее" }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{ text: string; limit?: number }>(),
  { limit: 120 },
);

const expanded = ref(false);
const isLong = computed(() => props.text.length > props.limit);
const displayText = computed(() =>
  !isLong.value || expanded.value
    ? props.text
    : props.text.slice(0, props.limit).trimEnd() + "…",
);
</script>
