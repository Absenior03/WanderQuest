<template>
  <div>
    <!-- Hero Section -->
    <div class="hero-section">
      <video autoplay loop muted playsinline class="hero-video">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4" type="video/mp4">
      </video>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-title-accent">Unforgettable</span> Journeys Await
        </h1>
        <p class="hero-subtitle">
          Discover curated tours designed for the modern adventurer. Your next story begins here.
        </p>
      </div>
    </div>

    <!-- Tours Section -->
    <div class="tours-section">
      <div class="tours-container">
        <h2 class="section-title">Explore Our Adventures</h2>
        <div v-if="loading" class="loading-spinner-container">
          <div class="spinner"></div>
        </div>
        <div v-if="error" class="error-message">
          <p><strong>Failed to load adventures:</strong> {{ error }}</p>
        </div>
        <div v-if="tours.length" class="tours-grid">
          <TourCard v-for="tour in tours" :key="tour.id" :tour="tour" class="list-item" />
        </div>
      </div>
    </div>

    <!-- New Sections -->
    <FeaturedCarousel />
    <ReviewsSection />
    <ContactSection />
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TourCard from '../components/TourCard.vue';
import FeaturedCarousel from '../components/FeaturedCarousel.vue';
import ReviewsSection from '../components/ReviewsSection.vue';
import ContactSection from '../components/ContactSection.vue';
import Footer from '../components/Footer.vue';

// The script setup remains the same as the last version
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
    const response = await fetch('http://localhost:4001/tours');
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