<template>
  <div>
    <label v-if="label" class="label">{{ label }}</label>
    <select
      :value="modelValue"
      class="select"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Toutes les catégories</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useCategories'

withDefaults(defineProps<{
  modelValue?: string
  categories: Category[]
  label?: string
}>(), {
  modelValue: '',
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()
</script>
