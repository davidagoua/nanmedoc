<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-slate-700/60 bg-slate-800/40">
    <!-- Voice selector -->
    <select v-model="voice" class="select sm:w-40 shrink-0" required>
      <option value="" disabled>Voix…</option>
      <option v-for="opt in voiceOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <!-- File input -->
    <label class="flex-1 flex items-center gap-2 cursor-pointer group">
      <div
        class="flex-1 border-2 border-dashed border-slate-600 group-hover:border-gold-500/60
               rounded-xl px-4 py-3 text-sm text-slate-400 transition-colors text-center sm:text-left"
      >
        <span v-if="!file">
          <AppIcon name="upload" class="inline mr-1" /> Choisir un fichier audio (MP3/OGG)
        </span>
        <span v-else class="text-gold-400 font-medium">{{ file.name }}</span>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="audio/mpeg,audio/ogg,audio/mp3,.mp3,.ogg"
        class="sr-only"
        @change="onFileChange"
      />
    </label>

    <!-- Remove row button -->
    <button
      type="button"
      class="btn-icon text-red-400 hover:text-red-300 shrink-0"
      title="Supprimer cette voix"
      @click="emit('remove')"
    >
      <AppIcon name="x" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: { voice: string; file: File | null } }>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: { voice: string; file: File | null }): void
  (e: 'remove'): void
}>()

const voiceOptions = [
  { value: 'soprano', label: 'Soprano' },
  { value: 'alto',    label: 'Alto' },
  { value: 'tenor',   label: 'Ténor' },
  { value: 'basse',   label: 'Basse' },
  { value: 'piano',   label: 'Piano' },
  { value: 'mixte',   label: 'Mixte' },
]

const voice = ref(props.modelValue?.voice ?? '')
const file  = ref<File | null>(props.modelValue?.file ?? null)

const onFileChange = (e: Event) => {
  file.value = (e.target as HTMLInputElement).files?.[0] ?? null
  emit('update:modelValue', { voice: voice.value, file: file.value })
}

watch(voice, (v) => {
  emit('update:modelValue', { voice: v, file: file.value })
})
</script>
