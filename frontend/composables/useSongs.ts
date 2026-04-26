import type { Category } from './useCategories'

export interface AudioFile {
  id: string
  voice: 'soprano' | 'alto' | 'tenor' | 'basse' | 'piano' | 'mixte'
  file: string
  song: string
  collectionId: string
  created: string
  updated: string
}

export interface Song {
  id: string
  title: string
  category: string
  expand?: { category?: Category; audio_tracks?: AudioFile[] }
  composer?: string
  lyrics?: string
  partition?: string
  audio_tracks: string[]
  collectionId: string
  created: string
  updated: string
}

export const useSongs = () => {
  const pb = usePocketBase()

  /** Search songs (public) */
  const listSongs = async (opts?: {
    query?: string
    category?: string
    composer?: string
    page?: number
    perPage?: number
  }) => {
    const { query = '', category = '', composer = '', page = 1, perPage = 20 } = opts ?? {}

    const filters: string[] = []
    if (query)    filters.push(`(title ~ "${query}" || composer ~ "${query}")`)
    if (category) filters.push(`category = "${category}"`)
    if (composer) filters.push(`composer ~ "${composer}"`)

    return pb.collection('songs').getList<Song>(page, perPage, {
      filter: filters.join(' && ') || undefined,
      expand: 'category,audio_tracks',
      sort: 'title',
    })
  }

  /** Get single song with expanded relations */
  const getSong = async (id: string): Promise<Song> => {
    return pb.collection('songs').getOne<Song>(id, {
      expand: 'category,audio_tracks',
    })
  }

  /** Create song (admin) – partition is a File object */
  const createSong = async (data: {
    title: string
    category: string
    composer?: string
    lyrics?: string
    partition?: File | null
  }): Promise<Song> => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('category', data.category)
    if (data.composer) formData.append('composer', data.composer)
    if (data.lyrics)   formData.append('lyrics', data.lyrics)
    if (data.partition) formData.append('partition', data.partition)
    return pb.collection('songs').create<Song>(formData)
  }

  /** Update song (admin) */
  const updateSong = async (
    id: string,
    data: {
      title?: string
      category?: string
      composer?: string
      lyrics?: string
      partition?: File | null
    },
  ): Promise<Song> => {
    const formData = new FormData()
    if (data.title    !== undefined) formData.append('title', data.title)
    if (data.category !== undefined) formData.append('category', data.category)
    if (data.composer !== undefined) formData.append('composer', data.composer)
    if (data.lyrics   !== undefined) formData.append('lyrics', data.lyrics)
    if (data.partition)              formData.append('partition', data.partition)
    return pb.collection('songs').update<Song>(id, formData)
  }

  /** Delete song and its audio tracks (admin) */
  const deleteSong = async (id: string): Promise<void> => {
    // PocketBase cascades file deletion, but we must delete audiofile records manually
    const song = await getSong(id)
    if (song.audio_tracks?.length) {
      await Promise.all(
        song.audio_tracks.map((trackId: string) =>
          pb.collection('audiofiles').delete(trackId).catch(() => {}),
        ),
      )
    }
    await pb.collection('songs').delete(id)
  }

  /** Build the public URL for the song partition */
  const getPartitionUrl = (song: Song): string | null => {
    if (!song.partition) return null
    return pb.files.getURL(song, song.partition)
  }

  return { listSongs, getSong, createSong, updateSong, deleteSong, getPartitionUrl }
}
