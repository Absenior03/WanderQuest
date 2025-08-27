<template>
  <div class="tour-page-wrapper">
    <div v-if="loading" class="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
    <div v-if="error" class="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 text-xl text-red-400 p-8">{{ error }}</div>

    <template v-if="tour">
      <div class="parallax-bg" :style="{ backgroundImage: `url(${tour.imageUrl})` }"></div>
      <header class="parallax-header">
        <h1 class="text-7xl md:text-9xl font-black font-serif tracking-tighter text-white mix-blend-difference">{{ tour.title }}</h1>
        <div class="flex items-center gap-2 text-slate-300 mt-4 text-xl"><MapPin :size="20" /><span>{{ tour.destination }}</span></div>
      </header>

      <div class="content-container bg-slate-900">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <router-link to="/" class="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors w-fit font-semibold mb-8">
            <ArrowLeft :size="20" />Back to all tours
          </router-link>
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div class="lg:col-span-3">
              <h2 class="text-4xl font-black font-serif tracking-tight mb-6 border-l-4 border-cyan-400 pl-4">About the Journey</h2>
              <p class="text-slate-300 text-lg leading-relaxed">{{ tour.description }}</p>
              <div class="mt-16">
                <h2 class="text-4xl font-black font-serif text-center mb-8">Your Personalized Itinerary</h2>
                <div v-if="!itinerary && !isAiLoading" class="text-center">
                  <button @click="generateItinerary" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform hover:scale-105 flex items-center gap-3 mx-auto">
                    <Sparkles :size="20"/>View My Custom Itinerary
                  </button>
                </div>
                <div v-if="isAiLoading" class="flex justify-center items-center h-48"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div></div>
                <div v-if="aiError" class="text-center text-lg text-red-400 bg-red-900/20 p-4 rounded-lg">{{ aiError }}</div>
                <div v-if="itinerary" class="space-y-4">
                  <div v-for="(day, index) in itinerary" :key="day.day" class="bg-slate-800/50 p-6 rounded-lg border border-slate-700 list-item" :style="{ transitionDelay: `${index * 100}ms` }">
                    <h3 class="text-2xl font-bold text-cyan-400 font-serif">Day {{ day.day }}: {{ day.title }}</h3>
                    <p class="mt-2 text-slate-300">{{ day.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:col-span-2">
              <div class="sticky top-28 bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-slate-700">
                <h2 class="text-3xl font-bold font-serif mb-6 border-b border-slate-700 pb-4">Customize Your Trip</h2>
                <div class="space-y-6">
                  <div v-for="custom in tour.customizations" :key="custom.id">
                    <label class="block text-lg font-semibold text-slate-300 mb-2">{{ custom.name }}</label>
                    <div class="flex flex-wrap gap-2">
                      <button v-for="(option, index) in custom.options" :key="option" @click="updateSelection(custom.id, index)" :class="['px-4 py-2 rounded-full text-sm font-semibold transition-colors', selections[custom.id] === index ? 'bg-cyan-500 text-white ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-500' : 'bg-slate-700 hover:bg-slate-600']">{{ option }}</button>
                    </div>
                  </div>
                </div>
                <div class="border-t border-slate-700 mt-8 pt-6">
                  <div class="flex justify-between items-center text-3xl font-black"><span class="text-slate-300">Total Price:</span><span class="text-cyan-400">${{ totalPrice }}</span></div>
                   <button @click="startBookingProcess" class="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg transition-transform hover:scale-105">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
     <!-- Payment Modal -->
    <transition name="fade">
      <PaymentModal 
        v-if="showPaymentModal" 
        :amount="totalPrice" 
        :client-secret="paymentClientSecret"
        @close="showPaymentModal = false"
        @payment-success="handlePaymentSuccess"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowLeft, MapPin, Sparkles } from 'lucide-vue-next';
import PaymentModal from '../components/PaymentModal.vue';

const props = defineProps({ id: String });

const tour = ref(null);
const loading = ref(true);
const error = ref(null);
const selections = ref({});
const showPaymentModal = ref(false);
const paymentClientSecret = ref(null);
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

watch(selections, () => {
    itinerary.value = null;
}, { deep: true });

const startBookingProcess = async () => {
  try {
    console.log("Creating order for tour:", props.id, "with price:", totalPrice.value);
    const paymentsServiceUrl = 'https://gekyvmxmys.us-east-1.awsapprunner.com/create-payment-intent';
    const response = await fetch(paymentsServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice.value }),
    });
    if (!response.ok) {
      throw new Error('Could not initialize payment.');
    }
    const data = await response.json();
    paymentClientSecret.value = data.clientSecret;
    showPaymentModal.value = true;
  } catch (err) {
    console.error("Booking Error:", err);
    alert(err.message);
  }
};

const handlePaymentSuccess = () => {
    showPaymentModal.value = false;
    alert('Payment successful! Your tour is booked.');
};

const generateItinerary = async () => {
    isAiLoading.value = true;
    aiError.value = null;
    itinerary.value = null;
    const selectedFocusOption = selections.value['focus'];
    const tripFocus = tour.value.customizations.find(c => c.id === 'focus')?.options[selectedFocusOption] || 'general sightseeing';
    try {
        const aiServiceUrl = 'https://g8nswcxag7.execute-api.eu-north-1.amazonaws.com/default/WanderQuest-AI-Itinerary';
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
        setTimeout(() => {
            const items = document.querySelectorAll('.list-item');
            items.forEach(item => item.classList.add('visible'));
        }, 100);
    } catch (err) {
        aiError.value = err.message;
    } finally {
        isAiLoading.value = false;
    }
};

onMounted(async () => {
  try {
    const response = await fetch(`https://vwypfdkziv.us-east-1.awsapprunner.com/tours/${props.id}`);
    if (!response.ok) throw new Error('Tour not found.');
    tour.value = await response.json();
    tour.value.customizations.forEach(custom => { selections.value[custom.id] = 0; });
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>