<template>
  <div class="max-w-3xl space-y-6">
    <Head>
      <Title>{{ isNew ? 'Nouveau morceau' : 'Modifier morceau' }} – Admin</Title>
    </Head>

    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/songs" class="btn-ghost btn-icon">
        <AppIcon name="arrow-left" />
      </NuxtLink>
      <h2 class="section-title">{{ isNew ? 'Nouveau morceau' : 'Modifier le morceau' }}</h2>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <AppIcon name="loader" class="text-4xl text-gold-500" />
    </div>

    <div v-else class="card p-6">
      <AdminSongForm
        :initial="song ?? undefined"
        :categories="categories"
        @saved="onSaved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '~/composables/useSongs'
import type { Category } from '~/composables/useCategories'

definePageMeta({ layout: 'admin', middleware: 'admin', ssr: false })

const route    = useRoute()
const isNew    = computed(() => route.params.id === 'new')
const loading  = ref(true)
const song     = ref<Partial<Song> | null>(null)
const categories = ref<Category[]>([])

const { getSong } = useSongs()
const { listCategories } = useCategories()

onMounted(async () => {
  categories.value = await listCategories().catch(() => [])
  if (!isNew.value) {
    try { song.value = await getSong(route.params.id as string) }
    catch { navigateTo('/admin/songs') }
  }
  loading.value = false
})

const onSaved = (savedSong: Song) => {
  navigateTo('/admin/songs')
}
</script>
