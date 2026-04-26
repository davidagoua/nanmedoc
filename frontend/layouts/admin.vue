<template>
  <div class="min-h-screen flex bg-[var(--color-bg)]">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col',
        'transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <AppIcon name="music" class="text-[var(--color-accent)] text-xl" />
        <span class="font-display font-bold text-gray-900 text-lg">RepertoryHub Admin</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NuxtLink to="/admin/dashboard" class="nav-link" active-class="nav-link-active">
          <AppIcon name="grid" /> Tableau de bord
        </NuxtLink>
        <NuxtLink to="/admin/songs" class="nav-link" active-class="nav-link-active">
          <AppIcon name="music" /> Morceaux
        </NuxtLink>
        <NuxtLink to="/admin/categories" class="nav-link" active-class="nav-link-active">
          <AppIcon name="folder" /> Catégories
        </NuxtLink>
        <div class="pt-4 border-t border-gray-200 mt-4">
          <NuxtLink to="/" target="_blank" class="nav-link">
            <AppIcon name="eye" /> Voir le site
          </NuxtLink>
        </div>
      </nav>

      <!-- Admin info + logout -->
      <div class="px-4 py-4 border-t border-gray-200">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <span class="text-[var(--color-accent)] text-xs font-bold">A</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-gray-900 truncate">Administrateur</p>
            <p class="text-xs text-gray-500 truncate">{{ auth.adminModel?.email }}</p>
          </div>
        </div>
        <button class="btn-danger w-full text-xs" @click="auth.logout()">
          Se déconnecter
        </button>
      </div>
    </aside>

    <!-- Overlay on mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/20 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header class="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <button class="btn-icon lg:hidden text-gray-500" @click="sidebarOpen = !sidebarOpen">
          <AppIcon name="menu" />
        </button>
        <div class="flex-1">
          <h1 class="text-sm font-semibold text-gray-900">{{ pageTitle }}</h1>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 animate-fade-in">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)

const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('/songs'))      return 'Gestion des morceaux'
  if (path.includes('/categories')) return 'Gestion des catégories'
  return 'Tableau de bord'
})

// Close sidebar on route change
watch(() => route.path, () => { sidebarOpen.value = false })
</script>
