<template>
  <div>
    <!-- The new, dynamic "Aurora" background -->
    <div class="aurora-background">
      <div id="aurora-blob-1" class="aurora-blob"></div>
      <div id="aurora-blob-2" class="aurora-blob"></div>
    </div>

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

    <!-- All sections are now wrapped in a container to sit above the background -->
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

// --- Logic for Aurora Background ---
const handleMouseMove = (event) => {
  const blob2 = document.getElementById('aurora-blob-2');
  if (blob2) {
    const { clientX, clientY } = event;
    blob2.style.transform = `translate(${clientX}px, ${clientY}px)`;
  }
};

const handleScroll = () => {
  const blob1 = document.getElementById('aurora-blob-1');
  if (!blob1) return;

  // Animate scroll-to-reveal for cards
  const cards = document.querySelectorAll('.list-item');
  cards.forEach(card => {
    if (card.getBoundingClientRect().top < window.innerHeight - 100) {
      card.classList.add('visible');
    }
  });

  // Animate background morphing
  const scrollY = window.scrollY;
  const screenHeight = window.innerHeight;
  
  const sections = [
    { el: document.getElementById('tours'), colors: ['#06b6d4', '#0891b2'] }, // Cyan
    { el: document.getElementById('featured'), colors: ['#a855f7', '#7e22ce'] }, // Purple
    { el: document.getElementById('reviews'), colors: ['#84cc16', '#4d7c0f'] }, // Lime
    { el: document.getElementById('contact'), colors: ['#f97316', '#b45309'] } // Orange
  ];

  let currentSection = sections[0];
  for (const section of sections) {
    if (section.el && section.el.offsetTop <= scrollY + screenHeight / 2) {
      currentSection = section;
    }
  }
  
  blob1.style.setProperty('--color-1', currentSection.colors[0]);
  blob1.style.setProperty('--color-2', currentSection.colors[1]);
  blob1.style.transform = `translateY(${scrollY * 0.7}px)`;
};

onMounted(async () => {
  try {
    const response = await fetch('https://vwypfdkziv.us-east-1.awsapprunner.com/tours');
    if (!response.ok) throw new Error('Could not connect to the server. Please ensure the backend is running.');
    tours.value = await response.json();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    setTimeout(handleScroll, 100);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>