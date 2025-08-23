<template>
  <div>
    <!-- The new, dynamic morphing background -->
    <div id="morphing-background" class="morphing-bg"></div>

    <!-- Hero Section -->
    <div class="hero-section">
      <video autoplay loop muted playsinline class="hero-video">
        <source src="https://videos.pexels.com/video-files/2794731/2794731-hd_1920_1080_25fps.mp4" type="video/mp4"></source>
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

    <!-- All sections are now wrapped in a single container to sit above the background -->
    <div class="relative z-10">
      <div id="tours" class="content-section">
        <div class="content-container">
          <h2 class="section-title">Explore Our Adventures</h2>
          <div v-if="loading" class="loading-spinner-container"><div class="spinner"></div></div>
          <div v-if="error" class="error-message">
            <p><strong>Failed to load adventures:</strong> {{ error }}</p>
          </div>
          <div v-if="tours.length" class="tours-grid">
            <TourCard v-for="tour in tours" :key="tour.id" :tour="tour" class="list-item" />
          </div>
        </div>
      </div>

      <div id="featured" class="content-section">
        <FeaturedCarousel />
      </div>

      <div id="reviews" class="content-section">
        <ReviewsSection />
      </div>
      
      <div id="contact" class="content-section">
        <ContactSection />
      </div>
      
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TourCard from '../components/TourCard.vue';
import FeaturedCarousel from '../components/FeaturedCarousel.vue';
import ReviewsSection from '../components/ReviewsSection.vue';
import ContactSection from '../components/ContactSection.vue';
import Footer from '../components/Footer.vue';

const tours = ref([]);
const loading = ref(true);
const error = ref(null);

// --- New Logic for Seamless Morphing Background ---
const handleScroll = () => {
  const bg = document.getElementById('morphing-background');
  if (!bg) return;

  // Animate scroll-to-reveal for cards
  const cards = document.querySelectorAll('.list-item');
  cards.forEach(card => {
    if (card.getBoundingClientRect().top < window.innerHeight - 100) {
      card.classList.add('visible');
    }
  });

  // Animate background morphing
  const scrollY = window.scrollY;
  bg.style.setProperty('--y', `${scrollY}px`);

  const sections = [
    { id: '#tours', colors: ['34, 211, 238', '14, 116, 144'] }, // Cyan
    { id: '#featured', colors: ['168, 85, 247', '107, 33, 168'] }, // Purple
    { id: '#reviews', colors: ['132, 204, 22', '77, 124, 15'] }, // Lime
    { id: '#contact', colors: ['234, 88, 12', '154, 52, 18'] } // Orange
  ];

  let currentSection = sections[0];
  for (const section of sections) {
    const el = document.querySelector(section.id);
    if (el && el.offsetTop <= scrollY + window.innerHeight / 2) {
      currentSection = section;
    }
  }
  
  bg.style.setProperty('--color-one', currentSection.colors[0]);
  bg.style.setProperty('--color-two', currentSection.colors[1]);
};

onMounted(async () => {
  try {
    const response = await fetch('https://vwypfdkziv.us-east-1.awsapprunner.com/tours');
    if (!response.ok) throw new Error('Could not connect to the server. Please ensure the backend is running.');
    tours.value = await response.json();
    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>