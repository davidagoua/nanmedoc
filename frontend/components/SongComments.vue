<template>
  <div class="space-y-8">
    <div class="flex items-center gap-3">
      <h3 class="font-display text-xl font-bold text-gray-900">Commentaires</h3>
      <span class="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs font-bold">{{ comments.length }}</span>
    </div>

    <!-- Comment Form -->
    <div class="card p-6 bg-stone-50/50 border-stone-100">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="name" class="label">Votre nom</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="input bg-white"
              placeholder="Ex: Jean Dupont"
              required
            />
          </div>
        </div>
        <div>
          <label for="content" class="label">Votre commentaire</label>
          <textarea
            id="content"
            v-model="form.content"
            class="input bg-white min-h-[100px] py-3"
            placeholder="Dites-nous ce que vous pensez de ce morceau..."
            required
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="submitting"
            class="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <AppIcon v-if="submitting" name="loader" class="animate-spin" />
            {{ submitting ? 'Envoi...' : 'Publier le commentaire' }}
          </button>
        </div>
        <p v-if="success" class="text-green-600 text-sm font-medium animate-fade-in">✓ Commentaire publié avec succès !</p>
        <p v-if="error" class="text-red-600 text-sm font-medium">{{ error }}</p>
      </form>
    </div>

    <!-- Comments List -->
    <div v-if="loading" class="flex justify-center py-10">
      <AppIcon name="loader" class="text-3xl text-stone-300 animate-spin" />
    </div>
    <div v-else-if="comments.length === 0" class="text-center py-12 border-2 border-dashed border-stone-100 rounded-xl">
      <p class="text-stone-400">Soyez le premier à laisser un commentaire !</p>
    </div>
    <div v-else class="space-y-6">
      <div v-for="comment in comments" :key="comment.id" class="flex gap-4 group animate-fade-in">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold">
          {{ comment.name.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 space-y-1">
          <div class="flex items-center gap-3">
            <h4 class="font-bold text-gray-900 text-sm">{{ comment.name }}</h4>
            <span class="text-[10px] text-stone-400 uppercase tracking-wider">{{ formatDate(comment.created) }}</span>
          </div>
          <p class="text-gray-700 text-sm leading-relaxed">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/composables/useComments'

const props = defineProps<{
  songId: string
}>()

const { listComments, createComment } = useComments()

const comments = ref<Comment[]>([])
const loading = ref(true)
const submitting = ref(false)
const success = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  content: '',
})

const fetchComments = async () => {
  loading.value = true
  try {
    comments.value = await listComments(props.songId)
  } catch (e) {
    console.error('Failed to fetch comments', e)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''
  success.value = false
  
  try {
    const newComment = await createComment({
      song: props.songId,
      name: form.name,
      content: form.content,
    })
    
    // Add to list and clear form
    comments.value.unshift(newComment)
    form.content = ''
    success.value = true
    
    // Hide success message after 3 seconds
    setTimeout(() => { success.value = false }, 3000)
  } catch (e: any) {
    error.value = "Une erreur est survenue lors de l'envoi du commentaire."
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(() => {
  fetchComments()
})
</script>
