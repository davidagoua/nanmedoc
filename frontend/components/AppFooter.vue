<template>
  <footer class="mt-16 border-t border-slate-700/60 bg-slate-900/40">
    <div class="page-container py-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-gold-500 font-bold text-lg">♪</span>
          <span class="font-display font-semibold text-slate-300">RepertoryHub</span>
        </div>
        <p class="text-slate-500 text-sm text-center">
          Répertoire musical — consultation publique
        </p>
        <p class="text-slate-600 text-xs">
          {{ new Date().getFullYear() }}
        </p>
      </div>
    </div>
  </footer>
</template>
