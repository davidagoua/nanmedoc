export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created: string
  updated: string
}

export const useCategories = () => {
  const pb = usePocketBase()

  /** List all categories (public) */
  const listCategories = async (): Promise<Category[]> => {
    const records = await pb.collection('categories').getFullList<Category>({
      sort: 'name',
    })
    return records
  }

  /** Get a single category by ID */
  const getCategory = async (id: string): Promise<Category> => {
    return pb.collection('categories').getOne<Category>(id)
  }

  /** Create a new category (admin) */
  const createCategory = async (data: Partial<Category>): Promise<Category> => {
    return pb.collection('categories').create<Category>(data)
  }

  /** Update a category (admin) */
  const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
    return pb.collection('categories').update<Category>(id, data)
  }

  /** Delete a category (admin) */
  const deleteCategory = async (id: string): Promise<void> => {
    await pb.collection('categories').delete(id)
  }

  return { listCategories, getCategory, createCategory, updateCategory, deleteCategory }
}
