<template>
  <div class="reviews-section">
    <div class="reviews-container">
      <h2 class="section-title">What Our Adventurers Say</h2>
      <div class="reviews-grid">
        <div v-for="review in reviews" :key="review.name" class="review-card list-item">
          <p class="review-text">"{{ review.quote }}"</p>
          <div class="review-author">
            <img :src="review.avatar" :alt="review.name" class="review-avatar" />
            <div>
              <p class="review-name">{{ review.name }}</p>
              <p class="review-trip">{{ review.trip }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const reviews = ref([
  { name: 'Elena Rodriguez', trip: 'Parisian Dreams', quote: 'An absolutely magical experience from start to finish. The attention to detail was impeccable. WanderQuest made our dream trip a reality!', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Kenji Tanaka', trip: 'Tokyo Neon Nights', quote: 'The perfect blend of modern marvels and ancient traditions. The AI itinerary was surprisingly brilliant and took us to hidden gems we would have missed.', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Marcus Cole', trip: 'Roman Holiday', quote: 'Walking through history was breathtaking. The guides were knowledgeable and passionate. I felt completely immersed in the culture. Highly recommended!', avatar: 'https://i.pravatar.cc/150?img=8' },
]);
</script>