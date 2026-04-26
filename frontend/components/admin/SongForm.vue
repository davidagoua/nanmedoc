<template>
  <form class="space-y-6" @submit.prevent="submit">
    <!-- Title -->
    <div>
      <label class="label" for="song-title">Titre <span class="text-red-400">*</span></label>
      <input id="song-title" v-model="form.title" type="text" class="input" required />
    </div>

    <!-- Category -->
    <div>
      <label class="label" for="song-cat">Catégorie <span class="text-red-400">*</span></label>
      <select id="song-cat" v-model="form.category" class="select" required>
        <option value="" disabled>Sélectionner une catégorie</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>

    <!-- Composer -->
    <div>
      <label class="label" for="song-composer">Compositeur</label>
      <input id="song-composer" v-model="form.composer" type="text" class="input" placeholder="Nom du compositeur" />
    </div>

    <!-- Lyrics -->
    <div>
      <label class="label" for="song-lyrics">Paroles</label>
      <textarea id="song-lyrics" v-model="form.lyrics" rows="6" class="textarea" placeholder="Saisissez les paroles ici…" />
    </div>

    <!-- Partition upload -->
    <div>
      <label class="label">Partition (PDF ou image — max 10 Mo)</label>
      <label class="block cursor-pointer">
        <div
          class="border-2 border-dashed border-slate-600 hover:border-gold-500/60
                 rounded-xl p-6 text-center transition-colors"
          :class="partitionFile ? 'border-gold-500/40 bg-gold-500/5' : ''"
        >
          <AppIcon name="upload" class="text-2xl text-slate-400 mx-auto mb-2" />
          <p class="text-sm text-slate-400">
            <span v-if="partitionFile" class="text-gold-400 font-medium">{{ partitionFile.name }}</span>
            <span v-else-if="initial?.partition" class="text-slate-300">
              Fichier actuel : <span class="text-gold-400">{{ initial.partition }}</span>
              <br /><span class="text-xs text-slate-500">Choisir un nouveau fichier pour remplacer</span>
            </span>
            <span v-else>Cliquez ou déposez votre fichier ici</span>
          </p>
        </div>
        <input type="file" accept=".pdf,image/*" class="sr-only" @change="onPartitionChange" />
      </label>
    </div>

    <!-- Audio tracks -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="label mb-0">Fichiers audio par voix</label>
        <button type="button" class="btn-secondary text-xs" @click="addTrack">
          <AppIcon name="plus" /> Ajouter une voix
        </button>
      </div>

      <!-- Existing tracks (edit mode) -->
      <div v-if="existingTracks.length" class="space-y-2">
        <div
          v-for="track in existingTracks"
          :key="track.id"
          class="flex items-center gap-3 p-3 rounded-xl border border-slate-700/60 bg-slate-800/30"
        >
          <span class="badge-gold uppercase text-xs">{{ voiceLabel(track.voice) }}</span>
          <span class="text-sm text-slate-300 flex-1 truncate">{{ track.file }}</span>
          <button
            type="button"
            class="btn-icon text-red-400 hover:text-red-300"
            title="Supprimer cette piste"
            :disabled="deletingTrackId === track.id"
            @click="removeExistingTrack(track)"
          >
            <AppIcon :name="deletingTrackId === track.id ? 'loader' : 'trash'" />
          </button>
        </div>
      </div>

      <!-- New tracks -->
      <AudioUploadRow
        v-for="(row, idx) in newTracks"
        :key="idx"
        v-model="newTracks[idx]"
        @remove="newTracks.splice(idx, 1)"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
      {{ error }}
    </p>

    <!-- Progress -->
    <div v-if="uploadProgress" class="text-sm text-gold-400 bg-gold-500/10 border border-gold-500/30 rounded-xl px-4 py-3">
      {{ uploadProgress }}
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3 pt-2">
      <button type="submit" :disabled="saving" class="btn-primary">
        <AppIcon :name="saving ? 'loader' : 'check'" />
        {{ saving ? 'Enregistrement…' : (isEdit ? 'Mettre à jour' : 'Créer le morceau') }}
      </button>
      <NuxtLink to="/admin/songs" class="btn-secondary">Annuler</NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Song, AudioFile } from '~/composables/useSongs'
import type { Category } from '~/composables/useCategories'

const props = defineProps<{
  initial?: Partial<Song>
  categories: Category[]
}>()
const emit = defineEmits<{ (e: 'saved', song: Song): void }>()

const { createSong, updateSong } = useSongs()
const { uploadAudioTrack, deleteAudioTrack, listAudioTracks } = useAudioFiles()

const isEdit = computed(() => !!props.initial?.id)
const saving = ref(false)
const error  = ref('')
const uploadProgress = ref('')
const deletingTrackId = ref('')

const form = reactive({
  title:    props.initial?.title    ?? '',
  category: props.initial?.category ?? '',
  composer: props.initial?.composer ?? '',
  lyrics:   props.initial?.lyrics   ?? '',
})
const partitionFile = ref<File | null>(null)

// Existing audio tracks (for edit mode)
const existingTracks = ref<AudioFile[]>([])
onMounted(async () => {
  if (isEdit.value && props.initial?.id) {
    existingTracks.value = await listAudioTracks(props.initial.id)
  }
})

// New tracks to upload
const newTracks = ref<{ voice: string; file: File | null }[]>([])
const addTrack = () => newTracks.value.push({ voice: '', file: null })

const onPartitionChange = (e: Event) => {
  partitionFile.value = (e.target as HTMLInputElement).files?.[0] ?? null
}

const voiceLabels: Record<string, string> = {
  soprano: 'Soprano', alto: 'Alto', tenor: 'Ténor',
  basse: 'Basse', piano: 'Piano', mixte: 'Mixte',
}
const voiceLabel = (v: string) => voiceLabels[v] ?? v

const removeExistingTrack = async (track: AudioFile) => {
  deletingTrackId.value = track.id
  try {
    await deleteAudioTrack(track)
    existingTracks.value = existingTracks.value.filter(t => t.id !== track.id)
  } catch (e: any) {
    error.value = e?.message ?? 'Erreur lors de la suppression'
  } finally {
    deletingTrackId.value = ''
  }
}

const submit = async () => {
  saving.value = true
  error.value  = ''
  uploadProgress.value = ''
  try {
    let song: Song
    if (isEdit.value && props.initial?.id) {
      song = await updateSong(props.initial.id, { ...form, partition: partitionFile.value })
    } else {
      song = await createSong({ ...form, partition: partitionFile.value })
    }

    // Upload new audio tracks one by one
    for (let i = 0; i < newTracks.value.length; i++) {
      const row = newTracks.value[i]
      if (!row.file || !row.voice) continue
      uploadProgress.value = `Upload voix ${i + 1}/${newTracks.value.length}…`
      await uploadAudioTrack({ songId: song.id, voice: row.voice as any, file: row.file })
    }

    uploadProgress.value = ''
    emit('saved', song)
  } catch (err: any) {
    error.value = err?.message ?? 'Une erreur est survenue'
  } finally {
    saving.value = false
  }
}
</script>
