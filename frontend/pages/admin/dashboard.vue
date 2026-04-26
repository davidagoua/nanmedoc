<template>
  <div class="space-y-6">
    <Head><Title>Tableau de bord – Admin</Title></Head>

    <div class="flex items-center justify-between">
      <div>
        <h2 class="section-title">Tableau de bord</h2>
        <p class="text-slate-400 text-sm mt-1">Vue d'ensemble du répertoire</p>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card p-6">
        <p class="text-slate-400 text-sm uppercase tracking-wider mb-1">Morceaux</p>
        <p v-if="statsLoading" class="text-3xl font-bold text-white">…</p>
        <p v-else class="text-3xl font-bold text-white">{{ stats.songs }}</p>
        <p class="text-slate-500 text-xs mt-1">dans le répertoire</p>
      </div>
      <div class="card p-6">
        <p class="text-slate-400 text-sm uppercase tracking-wider mb-1">Catégories</p>
        <p v-if="statsLoading" class="text-3xl font-bold text-gold-400">…</p>
        <p v-else class="text-3xl font-bold text-gold-400">{{ stats.categories }}</p>
        <p class="text-slate-500 text-xs mt-1">groupes musicaux</p>
      </div>
      <div class="card p-6">
        <p class="text-slate-400 text-sm uppercase tracking-wider mb-1">Fichiers audio</p>
        <p v-if="statsLoading" class="text-3xl font-bold text-blue-400">…</p>
        <p v-else class="text-3xl font-bold text-blue-400">{{ stats.audioFiles }}</p>
        <p class="text-slate-500 text-xs mt-1">pistes disponibles</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="card p-6">
      <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Actions rapides</h3>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/admin/songs/new" class="btn-primary">
          <AppIcon name="plus" /> Ajouter un morceau
        </NuxtLink>
        <NuxtLink to="/admin/categories/new" class="btn-secondary">
          <AppIcon name="plus" /> Ajouter une catégorie
        </NuxtLink>
        <NuxtLink to="/" target="_blank" class="btn-ghost">
          <AppIcon name="eye" /> Voir le site public
        </NuxtLink>
      </div>
    </div>

    <!-- Recent songs -->
    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">Derniers morceaux ajoutés</h3>
        <NuxtLink to="/admin/songs" class="text-xs text-gold-400 hover:text-gold-300">Voir tout →</NuxtLink>
      </div>
      <div v-if="recentLoading" class="p-8 text-center">
        <AppIcon name="loader" class="text-3xl text-gold-500" />
      </div>
      <div v-else-if="!recentSongs.length" class="p-8 text-center text-slate-500 text-sm">
        Aucun morceau pour l'instant. <NuxtLink to="/admin/songs/new" class="text-gold-400 underline">Créer le premier</NuxtLink>.
      </div>
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th class="hidden sm:table-cell">Catégorie</th>
              <th class="hidden md:table-cell">Compositeur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="song in recentSongs" :key="song.id">
              <td class="font-medium">{{ song.title }}</td>
              <td class="hidden sm:table-cell">
                <span class="badge-gold">{{ song.expand?.category?.name ?? '—' }}</span>
              </td>
              <td class="hidden md:table-cell text-slate-400">{{ song.composer || '—' }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <NuxtLink :to="`/admin/songs/${song.id}`" class="btn-icon text-slate-400 hover:text-white">
                    <AppIcon name="edit" />
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '~/composables/useSongs'

definePageMeta({ layout: 'admin', middleware: 'admin', ssr: false })

const { listSongs } = useSongs()
const { listCategories } = useCategories()
const pb = usePocketBase()

const statsLoading = ref(true)
const recentLoading = ref(true)
const stats = reactive({ songs: 0, categories: 0, audioFiles: 0 })
const recentSongs = ref<Song[]>([])

onMounted(async () => {
  try {
    const [songsRes, cats, audios] = await Promise.all([
      listSongs({ perPage: 5 }),
      listCategories(),
      pb.collection('audiofiles').getList(1, 1),
    ])
    stats.songs      = songsRes.totalItems
    stats.categories = cats.length
    stats.audioFiles = audios.totalItems
    recentSongs.value = songsRes.items
  } finally {
    statsLoading.value  = false
    recentLoading.value = false
  }
})
</script>
