<template>
  <div class="tour-page-wrapper">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    <div v-if="error" class="error-overlay">{{ error }}</div>

    <template v-if="tour">
      <!-- Parallax Background Layer -->
      <div class="parallax-bg" :style="{ backgroundImage: `url(${tour.imageUrl})` }"></div>

      <!-- Parallax Header Layer -->
      <header class="parallax-header">
        <h1 class="text-7xl md:text-9xl font-black tracking-tighter text-white mix-blend-difference">{{ tour.title }}</h1>
        <div class="flex items-center gap-2 text-slate-300 mt-4 text-xl">
          <MapPin :size="20" />
          <span>{{ tour.destination }}</span>
        </div>
      </header>

      <!-- Main Content Layer -->
      <div class="content-container bg-slate-900">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <router-link to="/" class="back-link">
            <ArrowLeft :size="20" />
            Back to all tours
          </router-link>

          <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-8">
            <!-- Left Column: Details -->
            <div class="lg:col-span-3">
              <h2 class="content-title">About the Journey</h2>
              <p class="text-slate-300 text-lg leading-relaxed">{{ tour.description }}</p>
              
              <!-- AI Itinerary Section -->
              <div class="mt-16">
                <h2 class="content-title">Your Personalized Itinerary</h2>
                <div v-if="!itinerary && !isAiLoading" class="text-center">
                    <button @click="generateItinerary" class="ai-button">
                        View My Itinerary
                    </button>
                </div>
                <div v-if="isAiLoading" class="flex justify-center items-center h-48">
                    <div class="spinner"></div>
                </div>
                <div v-if="aiError" class="ai-error">{{ aiError }}</div>
                <transition-group name="list" tag="div" class="space-y-4 mt-8">
                    <div v-for="day in itinerary" :key="day.day" class="itinerary-day">
                        <h3 class="text-2xl font-bold text-cyan-400">Day {{ day.day }}: {{ day.title }}</h3>
                        <p class="mt-2 text-slate-300">{{ day.description }}</p>
                    </div>
                </transition-group>
              </div>
            </div>

            <!-- Right Column: Customization -->
            <div class="lg:col-span-2">
              <div class="sticky top-28 bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-slate-700">
                <h2 class="text-3xl font-bold mb-6 border-b border-slate-700 pb-4">Customize Your Trip</h2>
                <div class="space-y-6">
                  <div v-for="custom in tour.customizations" :key="custom.id">
                    <label class="block text-lg font-semibold text-slate-300 mb-2">{{ custom.name }}</label>
                    <div class="flex flex-wrap gap-2">
                      <button 
                        v-for="(option, index) in custom.options" 
                        :key="option"
                        @click="updateSelection(custom.id, index)"
                        :class="['option-button', selections[custom.id] === index ? 'active' : '']"
                      >
                        {{ option }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="border-t border-slate-700 mt-8 pt-6">
                  <div class="flex justify-between items-center text-3xl font-black">
                    <span class="text-slate-300">Total Price:</span>
                    <span class="text-cyan-400">${{ totalPrice }}</span>
                  </div>
                  <button class="book-now-button">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// ... (script setup remains the same as the last version)
import { ref, onMounted, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowLeft, MapPin, Sparkles } from 'lucide-vue-next';

const props = defineProps({
  id: String,
});

const tour = ref(null);
const loading = ref(true);
const error = ref(null);
const selections = ref({});

const isAiLoading = ref(false);
const aiError = ref(null);
const itinerary = ref(null);

const totalPrice = computed(() => {
  if (!tour.value) return 0;
  let total = tour.value.basePrice;
  for (const customId in selections.value) {
    const custom = tour.value.customizations.find(c => c.id === customId);
    const selectedOptionIndex = selections.value[customId];
    if (custom && custom.priceModifier[selectedOptionIndex] !== undefined) {
      total += custom.priceModifier[selectedOptionIndex];
    }
  }
  return total;
});

const updateSelection = (customId, optionIndex) => {
  selections.value[customId] = optionIndex;
};

// Watch for changes in selections to reset itinerary
watch(selections, () => {
    itinerary.value = null;
}, { deep: true });


const generateItinerary = async () => {
    isAiLoading.value = true;
    aiError.value = null;
    itinerary.value = null;

    const selectedFocusOption = selections.value['focus'];
    const tripFocus = tour.value.customizations.find(c => c.id === 'focus')?.options[selectedFocusOption] || 'general sightseeing';

    try {
        const aiServiceUrl='https://g8nswcxag7.execute-api.eu-north-1.amazonaws.com/default/WanderQuest-AI-Itinerary';
        
        const response = await fetch(aiServiceUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destination: tour.value.destination,
                duration: tour.value.durationDays,
                focus: tripFocus,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'The AI service failed to generate an itinerary.');
        }

        const data = await response.json();
        itinerary.value = data.itinerary;

    } catch (err) {
        aiError.value = err.message;
    } finally {
        isAiLoading.value = false;
    }
};

onMounted(async () => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/tours/${props.id}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Tour not found.');
    }
    tour.value = await response.json();
    tour.value.customizations.forEach(custom => {
        selections.value[custom.id] = 0;
    });
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>