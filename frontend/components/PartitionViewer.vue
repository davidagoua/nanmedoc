<template>
  <div class="card p-5 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">
        📄 Partition
      </h3>
      <a
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        :download="filename"
        class="btn-secondary text-xs !px-3 !py-1.5"
      >
        <AppIcon name="download" /> Télécharger
      </a>
    </div>

    <!-- PDF embed -->
    <div v-if="isPdf" class="rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900">
      <embed
        :src="url"
        type="application/pdf"
        class="w-full"
        style="min-height: 480px;"
      />
    </div>

    <!-- Image embed -->
    <div v-else class="rounded-xl overflow-hidden border border-slate-700/60">
      <img :src="url" :alt="`Partition – ${filename}`" class="w-full h-auto" loading="lazy" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ url: string; filename?: string }>()

const isPdf = computed(() =>
  props.url.toLowerCase().includes('.pdf') ||
  (props.filename ?? '').toLowerCase().endsWith('.pdf'),
)
</script>
