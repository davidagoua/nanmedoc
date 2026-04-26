export interface Comment {
  id: string
  song: string
  name: string
  content: string
  created: string
}

export const useComments = () => {
  const { $pb } = useNuxtApp()

  const listComments = async (songId: string) => {
    return await $pb.collection('pb_comments').getFullList<Comment>({
      filter: `song = "${songId}"`,
      sort: '-created',
    })
  }

  const createComment = async (data: { song: string; name: string; content: string }) => {
    return await $pb.collection('pb_comments').create<Comment>(data)
  }

  return {
    listComments,
    createComment,
  }
}
