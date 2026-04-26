<template>
  <div class="max-w-2xl space-y-6">
    <Head>
      <Title>{{ isNew ? 'Nouvelle catégorie' : 'Modifier catégorie' }} – Admin</Title>
    </Head>

    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/categories" class="btn-ghost btn-icon">
        <AppIcon name="arrow-left" />
      </NuxtLink>
      <h2 class="section-title">{{ isNew ? 'Nouvelle catégorie' : 'Modifier la catégorie' }}</h2>
    </div>

    <div v-if="loading" class="flex justify-center py-16"><AppIcon name="loader" class="text-4xl text-gold-500" /></div>

    <div v-else class="card p-6">
      <AdminCategoryForm :initial="category ?? undefined" @saved="onSaved" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useCategories'

definePageMeta({ layout: 'admin', middleware: 'admin', ssr: false })

const route    = useRoute()
const isNew    = computed(() => route.params.id === 'new')
const loading  = ref(!isNew.value)
const category = ref<Partial<Category> | null>(null)

const { getCategory } = useCategories()

onMounted(async () => {
  if (!isNew.value) {
    try { category.value = await getCategory(route.params.id as string) }
    catch { navigateTo('/admin/categories') }
    finally { loading.value = false }
  }
})

const onSaved = () => navigateTo('/admin/categories')
</script>
