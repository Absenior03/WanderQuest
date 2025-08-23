<template>
  <div>
    <div id="morphing-background" class="morphing-bg"></div>

    <div class="hero-section">
      <video autoplay loop muted playsinline class="hero-video">
        <source src="https://videos.pexels.com/video-files/2794731/2794731-hd_1920_1080_25fps.mp4" type="video/mp4">
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

    <div class="relative z-10">
      <div id="tours" class="content-section">
        <div class="tours-container">
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

const handleScroll = () => {
  const bg = document.getElementById('morphing-background');
  if (!bg) return;
  
  const cards = document.querySelectorAll('.list-item');
  cards.forEach(card => {
    if (card.getBoundingClientRect().top < window.innerHeight - 100) {
      card.classList.add('visible');
    }
  });

  const scrollY = window.scrollY;
  const screenHeight = window.innerHeight;
  
  const toursSection = document.getElementById('tours');
  const featuredSection = document.getElementById('featured');
  const reviewsSection = document.getElementById('reviews');
  const contactSection = document.getElementById('contact');

  const toursTop = toursSection.offsetTop;
  const featuredTop = featuredSection.offsetTop;
  const reviewsTop = reviewsSection.offsetTop;
  const contactTop = contactSection.offsetTop;

  if (scrollY < featuredTop - screenHeight / 1.5) {
    bg.style.setProperty('--color-one', '34, 211, 238'); // Cyan
    bg.style.setProperty('--color-two', '14, 116, 144');
  } else if (scrollY < reviewsTop - screenHeight / 1.5) {
    bg.style.setProperty('--color-one', '168, 85, 247'); // Purple
    bg.style.setProperty('--color-two', '107, 33, 168');
  } else if (scrollY < contactTop - screenHeight / 1.5) {
    bg.style.setProperty('--color-one', '132, 204, 22'); // Lime
    bg.style.setProperty('--color-two', '77, 124, 15');
  } else {
    bg.style.setProperty('--color-one', '234, 88, 12'); // Orange
    bg.style.setProperty('--color-two', '154, 52, 18');
  }
  
  bg.style.setProperty('--y', `${scrollY}px`);
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