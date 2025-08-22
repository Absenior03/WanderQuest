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
  { src: 'https://unsplash.com/photos/people-riding-on-boat-on-river-during-daytime-wJvUBkLU0pA', alt: 'Kyoto, Japan' },
  { src: 'https://unsplash.com/photos/green-mountain-under-white-cloudy-sky-during-daytime-lRNW1UsIHXA', alt: 'Machu Picchu, Peru' },
  { src: 'https://unsplash.com/photos/a-group-of-people-riding-horses-in-front-of-the-pyramids-e4EcnfvtWGE', alt: 'Cairo, Egypt' },
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