<template>
  <div class="space-y-6">
    <Head><Title>Morceaux – Admin</Title></Head>

    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 class="section-title">Morceaux</h2>
        <p class="text-slate-400 text-sm mt-1">{{ totalItems }} morceau{{ totalItems !== 1 ? 'x' : '' }}</p>
      </div>
      <NuxtLink to="/admin/songs/new" class="btn-primary">
        <AppIcon name="plus" /> Nouveau morceau
      </NuxtLink>
    </div>

    <!-- Search -->
    <div class="card p-4">
      <SearchBar v-model="query" placeholder="Rechercher dans les morceaux…" @search="loadSongs" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16"><AppIcon name="loader" class="text-4xl text-gold-500" /></div>

    <!-- Empty -->
    <div v-else-if="!songs.length" class="card p-10 text-center text-slate-500">
      <p class="text-4xl mb-3">🎵</p>
      <p>Aucun morceau. <NuxtLink to="/admin/songs/new" class="text-gold-400 underline">Créer le premier</NuxtLink>.</p>
    </div>

    <!-- Table -->
    <div v-else class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Titre</th>
            <th class="hidden sm:table-cell">Catégorie</th>
            <th class="hidden md:table-cell">Compositeur</th>
            <th class="hidden lg:table-cell">Voix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in songs" :key="song.id">
            <td class="font-medium text-white">{{ song.title }}</td>
            <td class="hidden sm:table-cell">
              <span class="badge-gold">{{ song.expand?.category?.name ?? '—' }}</span>
            </td>
            <td class="hidden md:table-cell text-slate-400">{{ song.composer || '—' }}</td>
            <td class="hidden lg:table-cell text-slate-400">
              {{ song.audio_tracks?.length ?? 0 }} piste{{ (song.audio_tracks?.length ?? 0) !== 1 ? 's' : '' }}
            </td>
            <td>
              <div class="flex items-center gap-2">
                <NuxtLink :to="`/song/${song.id}`" target="_blank" class="btn-icon text-slate-400 hover:text-gold-400" title="Voir">
                  <AppIcon name="eye" />
                </NuxtLink>
                <NuxtLink :to="`/admin/songs/${song.id}`" class="btn-icon text-slate-400 hover:text-white" title="Modifier">
                  <AppIcon name="edit" />
                </NuxtLink>
                <button class="btn-icon text-red-400 hover:text-red-300" title="Supprimer" @click="confirmDelete(song)">
                  <AppIcon name="trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-3">
      <button :disabled="page <= 1" class="btn-secondary" @click="page--; loadSongs()">← Préc.</button>
      <span class="flex items-center text-sm text-slate-400">{{ page }}/{{ totalPages }}</span>
      <button :disabled="page >= totalPages" class="btn-secondary" @click="page++; loadSongs()">Suiv. →</button>
    </div>

    <!-- Delete modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="card p-6 max-w-sm w-full animate-slide-up">
          <h3 class="font-semibold text-white mb-2">Supprimer ce morceau ?</h3>
          <p class="text-slate-400 text-sm mb-6">
            <strong class="text-white">{{ deleteTarget.title }}</strong> et tous ses fichiers associés seront supprimés.
          </p>
          <div class="flex gap-3">
            <button class="btn-danger flex-1" :disabled="deleting" @click="doDelete">
              <AppIcon :name="deleting ? 'loader' : 'trash'" /> Supprimer
            </button>
            <button class="btn-secondary flex-1" @click="deleteTarget = null">Annuler</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '~/composables/useSongs'

definePageMeta({ layout: 'admin', middleware: 'admin', ssr: false })

const { listSongs, deleteSong } = useSongs()

const loading      = ref(true)
const songs        = ref<Song[]>([])
const totalItems   = ref(0)
const totalPages   = ref(1)
const page         = ref(1)
const query        = ref('')
const deleteTarget = ref<Song | null>(null)
const deleting     = ref(false)

const loadSongs = async () => {
  loading.value = true
  try {
    const res = await listSongs({ query: query.value, page: page.value, perPage: 20 })
    songs.value      = res.items
    totalItems.value = res.totalItems
    totalPages.value = res.totalPages
  } finally {
    loading.value = false
  }
}

onMounted(loadSongs)

const confirmDelete = (song: Song) => { deleteTarget.value = song }

const doDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await deleteSong(deleteTarget.value.id)
    deleteTarget.value = null
    await loadSongs()
  } finally {
    deleting.value = false
  }
}
</script>
