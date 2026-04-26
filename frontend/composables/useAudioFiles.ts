import type { AudioFile } from './useSongs'

export const useAudioFiles = () => {
  const pb = usePocketBase()

  /** Get audio file public URL */
  const getAudioUrl = (track: AudioFile): string => {
    return pb.files.getURL(track, track.file)
  }

  /** Upload a new audio track and link it to a song */
  const uploadAudioTrack = async (opts: {
    songId: string
    voice: AudioFile['voice']
    file: File
  }): Promise<AudioFile> => {
    const formData = new FormData()
    formData.append('song', opts.songId)
    formData.append('voice', opts.voice)
    formData.append('file', opts.file)

    const audioRecord = await pb.collection('audiofiles').create<AudioFile>(formData)

    // Link the audiofile record to the song's audio_tracks relation field
    await pb.collection('songs').update(opts.songId, {
      'audio_tracks+': audioRecord.id,
    })

    return audioRecord
  }

  /** Delete a single audio track and unlink it from the song */
  const deleteAudioTrack = async (track: AudioFile): Promise<void> => {
    // Unlink from song first
    await pb.collection('songs').update(track.song, {
      'audio_tracks-': track.id,
    })
    // Then delete the record (PocketBase removes the file automatically)
    await pb.collection('audiofiles').delete(track.id)
  }

  /** List all audio tracks for a given song */
  const listAudioTracks = async (songId: string): Promise<AudioFile[]> => {
    return pb.collection('audiofiles').getFullList<AudioFile>({
      filter: `song = "${songId}"`,
      sort: 'voice',
    })
  }

  return { getAudioUrl, uploadAudioTrack, deleteAudioTrack, listAudioTracks }
}
