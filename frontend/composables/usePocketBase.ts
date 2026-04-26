/** Returns the PocketBase instance injected by the plugin */
export const usePocketBase = () => {
  const { $pb } = useNuxtApp()
  return $pb
}
