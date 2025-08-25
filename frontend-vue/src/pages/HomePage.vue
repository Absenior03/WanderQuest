<template>
  <div>
    <div id="morphing-background" class="aurora-background">
      <div id="aurora-blob-1" class="aurora-blob"></div>
      <div id="aurora-blob-2" class="aurora-blob"></div>
    </div>

    <div class="relative h-[100vh] flex items-center justify-center text-center overflow-hidden">
      <video autoplay loop muted playsinline class="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 z-0 opacity-15">
        <source src="https://videos.pexels.com/video-files/2794731/2794-hd_1920_1080_25fps.mp4" type="video/mp4">
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

    <div class="relative z-10 bg-slate-900">
      <div id="tours" class="content-section py-16 sm:py-24">
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
  const bg = document.querySelector('.aurora-background');
  if (bg) {
    const { clientX, clientY } = event;
    bg.style.setProperty('--x', `${clientX}px`);
    bg.style.setProperty('--y', `${clientY}px`);
  }
};

const handleScroll = () => {
  const bg = document.querySelector('.aurora-background');
  if (!bg) return;

  // Animate scroll-to-reveal for cards
  const items = document.querySelectorAll('.list-item');
  items.forEach(item => {
    if (item.getBoundingClientRect().top < window.innerHeight - 100) {
      item.classList.add('visible');
    }
  });

  // Animate background color morphing
  const scrollY = window.scrollY;
  const screenHeight = window.innerHeight;
  
  const sections = [
    { el: document.getElementById('tours'), colors: ['#06b6d4', '#0891b2', '#a855f7', '#7e22ce'] },
    { el: document.getElementById('featured'), colors: ['#a855f7', '#7e22ce', '#84cc16', '#4d7c0f'] },
    { el: document.getElementById('reviews'), colors: ['#84cc16', '#4d7c0f', '#f97316', '#b45309'] },
    { el: document.getElementById('contact'), colors: ['#f97316', '#b45309', '#ef4444', '#991b1b'] }
  ];

  let currentSection = sections[0];
  // Find the current section that is most visible in the viewport
  for (const section of sections) {
    if (section.el && section.el.offsetTop <= scrollY + screenHeight / 2) {
      currentSection = section;
    }
  }
  
  // Update the CSS variables with the new colors
  bg.style.setProperty('--color-1', currentSection.colors[0]);
  bg.style.setProperty('--color-2', currentSection.colors[1]);
  bg.style.setProperty('--color-3', currentSection.colors[2]);
  bg.style.setProperty('--color-4', currentSection.colors[3]);
};

onMounted(async () => {
  try {
    const response = await fetch('https://vwypfdkziv.us-east-1.awsapprunner.com/tours');
    if (!response.ok) throw new Error('Could not connect to the server.');
    tours.value = await response.json();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initial check
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