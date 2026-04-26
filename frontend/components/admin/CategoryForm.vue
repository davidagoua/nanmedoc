<template>
  <form class="space-y-6" @submit.prevent="submit">
    <!-- Title -->
    <div>
      <label class="label" for="cat-name">Nom <span class="text-red-400">*</span></label>
      <input id="cat-name" v-model="form.name" type="text" class="input" required @input="autoSlug" />
    </div>

    <!-- Slug -->
    <div>
      <label class="label" for="cat-slug">Slug (URL)</label>
      <input id="cat-slug" v-model="form.slug" type="text" class="input font-mono text-sm" />
      <p class="text-xs text-slate-500 mt-1">Généré automatiquement depuis le nom.</p>
    </div>

    <!-- Description -->
    <div>
      <label class="label" for="cat-desc">Description</label>
      <textarea id="cat-desc" v-model="form.description" rows="3" class="textarea" placeholder="Description optionnelle…" />
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3 pt-2">
      <button type="submit" :disabled="saving" class="btn-primary">
        <AppIcon :name="saving ? 'loader' : 'check'" />
        {{ saving ? 'Enregistrement…' : (isEdit ? 'Mettre à jour' : 'Créer') }}
      </button>
      <NuxtLink to="/admin/categories" class="btn-secondary">Annuler</NuxtLink>
    </div>

    <p v-if="error" class="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
      {{ error }}
    </p>
  </form>
</template>

<script setup lang="ts">
import slugify from 'slugify'
import type { Category } from '~/composables/useCategories'

const props = defineProps<{ initial?: Partial<Category> }>()
const emit  = defineEmits<{ (e: 'saved', cat: Category): void }>()

const { createCategory, updateCategory } = useCategories()

const isEdit = computed(() => !!props.initial?.id)
const saving = ref(false)
const error  = ref('')

const form = reactive({
  name: props.initial?.name ?? '',
  slug: props.initial?.slug ?? '',
  description: props.initial?.description ?? '',
})

const autoSlug = () => {
  form.slug = slugify(form.name, { lower: true, strict: true })
}

const submit = async () => {
  saving.value = true
  error.value  = ''
  try {
    let cat: Category
    if (isEdit.value && props.initial?.id) {
      cat = await updateCategory(props.initial.id, form)
    } else {
      cat = await createCategory(form)
    }
    emit('saved', cat)
  } catch (err: any) {
    error.value = err?.message ?? 'Une erreur est survenue'
  } finally {
    saving.value = false
  }
}
</script>
