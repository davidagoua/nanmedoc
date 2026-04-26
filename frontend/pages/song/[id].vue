<template>
  <div>
    <!-- Loading -->
    <div v-if="pending" class="flex justify-center py-32">
      <AppIcon name="loader" class="text-5xl text-gold-500" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="page-container py-20 text-center">
      <p class="text-red-400">Morceau introuvable.</p>
      <NuxtLink to="/" class="btn-secondary mt-4">← Retour</NuxtLink>
    </div>

    <!-- Content -->
    <template v-else-if="song">
      <Head>
        <Title>{{ song.title }}</Title>
        <Meta name="description" :content="`${song.title}${song.composer ? ' – ' + song.composer : ''}`" />
      </Head>

      <!-- Top bar -->
      <div class="bg-[var(--color-accent)] border-b border-transparent">
        <div class="page-container py-4">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors font-medium">
            <AppIcon name="arrow-left" /> Retour au répertoire
          </NuxtLink>
        </div>
      </div>

      <div class="page-container py-8 space-y-6 animate-slide-up">
        <!-- Header card -->
        <div class="card p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="space-y-2">
              <span v-if="song.expand?.category" class="badge-blue">
                {{ song.expand.category.name }}
              </span>
              <h1 class="font-display text-fluid-xl font-bold text-gray-900 leading-tight">
                {{ song.title }}
              </h1>
              <p v-if="song.composer" class="text-gray-600 text-fluid-base">
                🎼 {{ song.composer }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Left column -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Audio player -->
            <AudioPlayer
              v-if="audioTracks.length"
              :tracks="audioTracks"
            />
            <div v-else class="card p-5 text-center text-slate-500 text-sm">
              Aucun fichier audio disponible pour ce morceau.
            </div>

            <!-- Partition -->
            <PartitionViewer
              v-if="partitionUrl"
              :url="partitionUrl"
              :filename="song.partition"
            />
          </div>

          <!-- Right column: lyrics -->
          <div v-if="song.lyrics" class="lg:col-span-2">
            <div class="card p-6 h-full">
              <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                ✦ Paroles
              </h2>
              <pre class="text-black text-base font-sans whitespace-pre-wrap leading-relaxed">{{ song.lyrics }}</pre>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AudioFile } from '~/composables/useSongs'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { getSong, getPartitionUrl } = useSongs()

const pending = ref(true)
const error   = ref(false)
const song    = ref<Awaited<ReturnType<typeof getSong>> | null>(null)

onMounted(async () => {
  try {
    song.value  = await getSong(route.params.id as string)
  } catch {
    error.value = true
  } finally {
    pending.value = false
  }
})

const audioTracks = computed<AudioFile[]>(
  () => (song.value?.expand?.audio_tracks as AudioFile[] | undefined) ?? [],
)
const partitionUrl = computed(() =>
  song.value ? getPartitionUrl(song.value) : null,
)
</script>
