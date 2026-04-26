<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-bg)]">
    <AppHeader />
    <main class="flex-1 animate-fade-in">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
