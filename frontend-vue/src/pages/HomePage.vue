<template>
  <div>
    <!-- Immersive Hero Section with Video Background -->
    <div class="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
      <video autoplay loop muted playsinline class="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 z-0">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4" type="video/mp4">
      </video>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"></div>
      <div class="relative z-20 px-4">
        <h1 class="text-5xl sm:text-7xl lg:text-8xl font-black font-serif tracking-tight text-white">
          <span class="text-cyan-400">Unforgettable</span> Journeys Await
        </h1>
        <p class="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
          Discover curated tours designed for the modern adventurer. Your next story begins here.
        </p>
      </div>
    </div>

    <!-- Tours Section -->
    <div class="bg-slate-900 py-16 sm:py-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-black font-serif text-center mb-12">Explore Our Adventures</h2>
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
        <div v-if="error" class="text-center text-xl text-red-400 bg-red-900/20 p-4 rounded-lg">
          <p class="font-bold">Failed to load adventures</p><p class="text-sm">{{ error }}</p>
        </div>
        <div v-if="tours.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TourCard v-for="tour in tours" :key="tour.id" :tour="tour" class="list-item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TourCard from '../components/TourCard.vue';
const tours = ref([]);
const loading = ref(true);
const error = ref(null);

const handleScroll = () => {
  const items = document.querySelectorAll('.list-item');
  items.forEach(item => {
    if (item.getBoundingClientRect().top < window.innerHeight - 100) {
      item.classList.add('visible');
    }
  });
};

onMounted(async () => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/tours`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Could not connect to the server. Please ensure the backend is running.');
    tours.value = await response.json();
    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>