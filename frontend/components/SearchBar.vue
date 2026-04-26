<template>
  <div class="relative">
    <label v-if="label" :for="inputId" class="label">{{ label }}</label>
    <div class="relative">
      <AppIcon name="search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
      <input
        :id="inputId"
        v-model="query"
        type="search"
        :placeholder="placeholder"
        class="input pl-10 pr-4"
        autocomplete="off"
        @input="onInput"
        @keydown.enter.prevent="emit('search', query)"
      />
      <button
        v-if="query"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Effacer"
        @click="clear"
      >
        <AppIcon name="x" class="text-sm" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  label?: string
  debounce?: number
}>(), {
  modelValue: '',
  placeholder: 'Rechercher un morceau…',
  label: '',
  debounce: 300,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'search', val: string): void
}>()

const inputId = useId()
const query = ref(props.modelValue)

let timer: ReturnType<typeof setTimeout>
const onInput = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    emit('update:modelValue', query.value)
    emit('search', query.value)
  }, props.debounce)
}

const clear = () => {
  query.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}

watch(() => props.modelValue, (v) => { query.value = v })
</script>
