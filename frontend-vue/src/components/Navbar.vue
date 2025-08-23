<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-lg border-b border-slate-700/50">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
      <div class="flex items-center gap-3 text-2xl font-bold text-cyan-400 cursor-pointer" @click="scrollToTop">
        <Globe class="animate-spin-slow" />
        <h1 class="font-serif">WanderQuest</h1>
      </div>
      <div class="hidden md:flex items-center space-x-8 text-slate-300 font-semibold">
        <a href="#tours" @click.prevent="scrollToSection('#tours')" class="hover:text-cyan-400 transition-colors">Tours</a>
        <a href="#reviews" @click.prevent="scrollToSection('#reviews')" class="hover:text-cyan-400 transition-colors">Reviews</a>
        <a href="#contact" @click.prevent="scrollToSection('#contact')" class="hover:text-cyan-400 transition-colors">Contact</a>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { Globe } from 'lucide-vue-next';

const scrollToSection = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin 20s linear infinite; }
</style>