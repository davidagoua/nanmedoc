<template>
  <div class="card p-5 space-y-4">
    <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
      <AppIcon name="play" class="text-gold-500" /> Écouter par voix
    </h3>

    <!-- Voice selector chips -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="track in tracks"
        :key="track.id"
        :class="['voice-btn', activeTrackId === track.id && 'voice-btn-active']"
        @click="selectTrack(track)"
      >
        {{ voiceLabel(track.voice) }}
      </button>
    </div>

    <!-- Audio element -->
    <div v-if="currentSrc" class="space-y-2">
      <div class="flex items-center gap-2 text-xs text-gold-400 font-medium">
        <AppIcon name="play" class="text-xs" />
        {{ voiceLabel(activeVoice) }}
      </div>
      <audio
        ref="audioEl"
        :src="currentSrc"
        controls
        preload="metadata"
        class="w-full rounded-2xl"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-4 text-slate-500 text-sm">
      Sélectionnez une voix pour écouter
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AudioFile } from '~/composables/useSongs'

const props = defineProps<{ tracks: AudioFile[] }>()

const { getAudioUrl } = useAudioFiles()

const audioEl = ref<HTMLAudioElement>()
const activeTrackId = ref<string>('')
const activeVoice = ref<AudioFile['voice'] | ''>('')
const currentSrc = ref<string>('')

const voiceLabels: Record<AudioFile['voice'], string> = {
  soprano: 'Soprano',
  alto: 'Alto',
  tenor: 'Ténor',
  basse: 'Basse',
  piano: 'Piano',
  mixte: 'Mixte',
}
const voiceLabel = (v: string) => voiceLabels[v as AudioFile['voice']] ?? v

const selectTrack = async (track: AudioFile) => {
  activeTrackId.value = track.id
  activeVoice.value = track.voice
  currentSrc.value = getAudioUrl(track)
  await nextTick()
  audioEl.value?.play().catch(() => {})
}

// Auto-select first track if only one voice
onMounted(() => {
  if (props.tracks.length === 1) selectTrack(props.tracks[0])
})
</script>
