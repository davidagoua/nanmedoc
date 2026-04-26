<template>
  <div>
    <Head>
      <Title>Répertoire de chant en langue</Title>
      <Meta name="description" content="Recherchez et consultez les morceaux de musique du répertoire." />
    </Head>

    <!-- Hero section (Mockup inspired) -->
    <section class="page-container pt-20 pb-12 sm:pt-28 sm:pb-16">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-800 leading-tight mb-12">
          Répertoire de <span class="text-[var(--color-accent)] font-medium border-b-2 border-[var(--color-accent)]/30 pb-1">chant</span><br class="hidden sm:block mt-2" />
          en <span class="text-[var(--color-accent)] font-medium border-b-2 border-[var(--color-accent)]/30 pb-1">langue</span>
        </h1>
      </div>
    </section>

    <!-- Search & Filters -->
    <section class="page-container pb-10 border-b border-gray-100 mb-10">
      <div class="max-w-4xl mx-auto space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SearchBar
            v-model="query"
            label="Titre ou compositeur"
            class="sm:col-span-2 lg:col-span-2 shadow-sm"
            @search="doSearch"
          />
          <CategoryFilter
            v-model="selectedCategory"
            :categories="categories"
            label="Catégorie"
            class="shadow-sm"
            @update:model-value="doSearch"
          />
        </div>

        <!-- Active filters -->
        <div v-if="query || selectedCategory" class="flex items-center justify-center gap-3 flex-wrap pt-2">
          <span class="text-sm text-gray-400">Filtres actifs :</span>
          <span v-if="query" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[var(--color-accent)] text-sm font-medium border border-blue-100">
            "{{ query }}"
            <button class="hover:text-blue-800" @click="query = ''; doSearch()"><AppIcon name="x" class="w-3.5 h-3.5" /></button>
          </span>
          <span v-if="selectedCategory" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[var(--color-accent)] text-sm font-medium border border-blue-100">
            {{ categories.find(c => c.id === selectedCategory)?.name }}
            <button class="hover:text-blue-800" @click="selectedCategory = ''; doSearch()"><AppIcon name="x" class="w-3.5 h-3.5" /></button>
          </span>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="page-container pb-16">
      <!-- Loading -->
      <div v-if="pending" class="flex justify-center py-20">
        <AppIcon name="loader" class="text-4xl text-gold-500" />
      </div>

      <!-- Error -->
      <div v-else-if="fetchError" class="card p-8 text-center text-red-400">
        <p>{{ fetchError }}</p>
      </div>

      <!-- Empty -->
      <div v-else-if="!songs.length" class="text-center py-20">
        <p class="text-5xl mb-4">🎵</p>
        <p class="text-gray-500 text-lg font-medium">Aucun morceau trouvé</p>
        <p class="text-gray-400 text-sm mt-1">Essayez d'autres termes de recherche.</p>
      </div>

      <!-- Grid -->
      <div v-else>
        <p class="text-gray-500 text-sm mb-6 font-medium">
          {{ totalResults }} morceau{{ totalResults > 1 ? 'x' : '' }} trouvé{{ totalResults > 1 ? 's' : '' }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <SongCard v-for="song in songs" :key="song.id" :song="song" />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
          <button
            :disabled="page <= 1"
            class="btn-secondary !px-4"
            @click="page--; doSearch()"
          >
            ← Précédent
          </button>
          <span class="flex items-center px-4 text-sm text-slate-400">
            {{ page }} / {{ totalPages }}
          </span>
          <button
            :disabled="page >= totalPages"
            class="btn-secondary !px-4"
            @click="page++; doSearch()"
          >
            Suivant →
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '~/composables/useSongs'
import type { Category } from '~/composables/useCategories'

definePageMeta({ layout: 'default' })

const { listSongs } = useSongs()
const { listCategories } = useCategories()

const query           = ref('')
const selectedCategory = ref('')
const page            = ref(1)
const perPage         = 18
const songs           = ref<Song[]>([])
const totalResults    = ref(0)
const totalPages      = ref(1)
const pending         = ref(true)
const fetchError      = ref('')
const categories      = ref<Category[]>([])

// Load categories for filter
onMounted(async () => {
  categories.value = await listCategories().catch(() => [])
})

const doSearch = async () => {
  pending.value = true
  fetchError.value = ''
  try {
    const result = await listSongs({
      query: query.value,
      category: selectedCategory.value,
      page: page.value,
      perPage,
    })
    songs.value       = result.items
    totalResults.value = result.totalItems
    totalPages.value  = result.totalPages
  } catch (e: any) {
    fetchError.value = e?.message ?? 'Erreur de chargement'
  } finally {
    pending.value = false
  }
}

// Initial load
doSearch()

// Reset to page 1 on new search
watch([query, selectedCategory], () => { page.value = 1 })
</script>
