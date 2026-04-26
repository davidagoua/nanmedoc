<template>
  <NuxtLink
    :to="`/song/${song.id}`"
    class="flex flex-col rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1"
    style="box-shadow: var(--shadow-card);"
    @mouseenter="$el.style.boxShadow = 'var(--shadow-card-hover)'"
    @mouseleave="$el.style.boxShadow = 'var(--shadow-card)'"
  >
    <!-- Image Header -->
    <div class="relative h-48 w-full bg-slate-100 overflow-hidden">
      <!-- Image Placeholder (Random abstract landscape for visual match) -->
      <img src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover opacity-90" alt="Cover" />
      
      <!-- Gradient overlay to make text readable -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
      
      <!-- Category Badge on Image -->
      <div v-if="categoryName" class="absolute bottom-4 left-5">
        <span class="text-[10px] font-bold tracking-widest text-white uppercase">{{ categoryName }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col">
      <!-- Blue Accent Text (like price in mockup) -->
      <div class="text-[var(--color-accent)] font-semibold mb-2 text-[15px]">
        {{ audioCount > 0 ? `${audioCount} voix disponibles` : 'Aucune voix' }}
      </div>
      
      <!-- Title -->
      <h2 class="text-[17px] font-bold text-gray-900 mb-1 leading-snug line-clamp-2">
        {{ song.title }}
      </h2>
      
      <!-- Meta -->
      <div class="text-xs text-gray-500 mb-4 space-y-1">
        <p v-if="song.composer">Compositeur: {{ song.composer }}</p>
        <p class="flex items-center gap-1 mt-1">
          <span v-if="song.partition" class="flex items-center gap-1">
            <AppIcon name="download" class="w-3.5 h-3.5" /> Partition dispo
          </span>
          <span v-if="song.partition && song.lyrics" class="mx-1">•</span>
          <span v-if="song.lyrics">Paroles incluses</span>
        </p>
      </div>
    </div>

    <!-- Bottom Action Button -->
    <div class="bg-[var(--color-accent)] text-white text-center py-4 font-semibold text-[15px] transition-colors hover:bg-[var(--color-accent-hover)] w-full">
      Voir les détails
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Song } from '~/composables/useSongs'

const props = defineProps<{ song: Song }>()

const categoryName = computed(
  () => props.song.expand?.category?.name ?? '',
)
const audioCount = computed(
  () => props.song.expand?.audio_tracks?.length ?? props.song.audio_tracks?.length ?? 0,
)
</script>
