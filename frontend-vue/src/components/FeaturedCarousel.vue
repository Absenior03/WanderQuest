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
  { src: 'https://images.pexels.com/photos/161853/santorini-greece-village-church-161853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'Santorini, Greece' },
  { src: 'https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'Kyoto, Japan' },
  { src: 'https://images.pexels.com/photos/681387/pexels-photo-681387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'Machu Picchu, Peru' },
  { src: 'https://images.pexels.com/photos/5472242/pexels-photo-5472242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', alt: 'Cairo, Egypt' },
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