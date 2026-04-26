<template>
  <div class="space-y-6">
    <Head><Title>Catégories – Admin</Title></Head>

    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 class="section-title">Catégories</h2>
        <p class="text-slate-400 text-sm mt-1">{{ categories.length }} catégorie{{ categories.length !== 1 ? 's' : '' }}</p>
      </div>
      <NuxtLink to="/admin/categories/new" class="btn-primary">
        <AppIcon name="plus" /> Nouvelle catégorie
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16"><AppIcon name="loader" class="text-4xl text-gold-500" /></div>

    <!-- Empty -->
    <div v-else-if="!categories.length" class="card p-10 text-center text-slate-500">
      <p class="text-4xl mb-3">📂</p>
      <p>Aucune catégorie. <NuxtLink to="/admin/categories/new" class="text-gold-400 underline">Créer la première</NuxtLink>.</p>
    </div>

    <!-- Table -->
    <div v-else class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th class="hidden sm:table-cell">Slug</th>
            <th class="hidden md:table-cell">Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td class="font-medium text-white">{{ cat.name }}</td>
            <td class="hidden sm:table-cell font-mono text-xs text-slate-400">{{ cat.slug }}</td>
            <td class="hidden md:table-cell text-slate-400 max-w-xs truncate">{{ cat.description || '—' }}</td>
            <td>
              <div class="flex items-center gap-2">
                <NuxtLink :to="`/admin/categories/${cat.id}`" class="btn-icon text-slate-400 hover:text-white" title="Modifier">
                  <AppIcon name="edit" />
                </NuxtLink>
                <button class="btn-icon text-red-400 hover:text-red-300" title="Supprimer" @click="confirmDelete(cat)">
                  <AppIcon name="trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirm modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="card p-6 max-w-sm w-full animate-slide-up">
          <h3 class="font-semibold text-white mb-2">Supprimer la catégorie ?</h3>
          <p class="text-slate-400 text-sm mb-6">
            La catégorie <strong class="text-white">{{ deleteTarget.name }}</strong> sera supprimée définitivement.
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
import type { Category } from '~/composables/useCategories'

definePageMeta({ layout: 'admin', middleware: 'admin', ssr: false })

const { listCategories, deleteCategory } = useCategories()

const loading      = ref(true)
const categories   = ref<Category[]>([])
const deleteTarget = ref<Category | null>(null)
const deleting     = ref(false)

onMounted(async () => {
  categories.value = await listCategories().catch(() => [])
  loading.value = false
})

const confirmDelete = (cat: Category) => { deleteTarget.value = cat }

const doDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await deleteCategory(deleteTarget.value.id)
    categories.value = categories.value.filter(c => c.id !== deleteTarget.value?.id)
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}
</script>
