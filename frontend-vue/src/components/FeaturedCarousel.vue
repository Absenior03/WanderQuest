<template>
  <div class="carousel-container">
    <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="image in images" :key="image.alt" class="carousel-item">
        <img :src="image.src" :alt="image.alt" class="carousel-image" />
        <div class="carousel-caption">{{ image.alt }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const images = ref([
  { src: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop', alt: 'Santorini, Greece' },
  { src: 'https://images.unsplash.com/photo-1519954737015-465830593644?q=80&w=1974&auto=format&fit=crop', alt: 'Kyoto, Japan' },
  { src: 'https://images.unsplash.com/photo-1567182652513-862812f3702a?q=80&w=1974&auto=format&fit=crop', alt: 'Machu Picchu, Peru' },
  { src: 'https://images.unsplash.com/photo-1604928141068-a183f21768d7?q=80&w=2070&auto=format&fit=crop', alt: 'Cairo, Egypt' },
]);

const currentIndex = ref(0);
let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }, 4000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>