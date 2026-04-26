<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
    <div class="page-container h-20 flex items-center justify-between">
      
      <!-- Left side: Logo & Main Nav -->
      <div class="flex items-center gap-8">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <AppIcon name="music" class="text-[var(--color-accent)] text-2xl" />
          <span class="font-display font-bold text-gray-900 text-[22px] hidden sm:block tracking-tight">RepertoryHub</span>
        </NuxtLink>

        <!-- Desktop Main Nav -->
        <nav class="hidden md:flex items-center gap-6 mt-1">
          <NuxtLink to="/" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
            Morceaux
            <AppIcon name="chevron-down" class="w-3 h-3 text-gray-400" />
          </NuxtLink>
          <NuxtLink to="/" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
            Catégories
            <AppIcon name="chevron-down" class="w-3 h-3 text-gray-400" />
          </NuxtLink>
        </nav>
      </div>

      <!-- Right side: Login & CTA -->
      <div class="hidden md:flex items-center gap-5">
        <NuxtLink to="/admin/login" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Login
        </NuxtLink>
        
        <NuxtLink to="/admin/dashboard" class="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-5 py-2.5 rounded text-sm font-medium transition-colors flex items-center gap-2">
          Administration
        </NuxtLink>
      </div>

      <!-- Mobile burger -->
      <div class="md:hidden flex items-center gap-3">
        <NuxtLink to="/admin/dashboard" class="bg-[var(--color-accent)] text-white px-3 py-1.5 rounded-md text-xs font-medium">Admin</NuxtLink>
        <button
          class="text-gray-500 hover:text-gray-900 p-2"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'x' : 'menu'" class="text-xl" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
        <nav class="flex flex-col p-4 space-y-4">
          <NuxtLink to="/" class="text-sm font-medium text-gray-600" @click="menuOpen = false">Morceaux</NuxtLink>
          <NuxtLink to="/" class="text-sm font-medium text-gray-600" @click="menuOpen = false">Catégories</NuxtLink>
          <div class="w-full h-px bg-gray-100"></div>
          <NuxtLink to="/admin/login" class="text-sm font-medium text-gray-600" @click="menuOpen = false">Login</NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from,
.slide-down-leave-to    { opacity: 0; transform: translateY(-8px); }
</style>
