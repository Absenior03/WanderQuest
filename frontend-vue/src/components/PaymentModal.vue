<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-xl p-8 w-full max-w-md m-4" @click.stop>
      <h2 class="text-2xl font-bold font-serif mb-4">Complete Your Booking</h2>
      <p class="text-slate-400 mb-6">Enter your payment details below to confirm your trip for ${{ amount }}.</p>
      
      <form @submit.prevent="handleSubmit">
        <div class="bg-white p-4 rounded-md">
          <stripe-elements ref="elementsRef" :stripe="stripe" :options="elementsOptions" />
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Processing...' : `Pay $${amount}` }}
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-400 text-center mt-4">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { StripeElements } from "vue-stripe";
import { loadStripe } from '@stripe/stripe-js';

const props = defineProps({
  amount: Number,
  clientSecret: String,
});
const emit = defineEmits(['close', 'payment-success']);

const stripe = ref(null);
const elementsRef = ref();
const isLoading = ref(false);
const errorMessage = ref('');

const elementsOptions = {
  clientSecret: props.clientSecret,
  appearance: {
    theme: 'night',
    labels: 'floating',
    variables: {
      colorPrimary: '#06b6d4', // cyan
      colorBackground: '#1e293b', // slate-800
      colorText: '#e2e8f0', // slate-200
      colorDanger: '#f87171', // red-400
      fontFamily: 'Lato, sans-serif',
      borderRadius: '8px',
    },
  },
};

onMounted(async () => {
  stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
});

const handleSubmit = async () => {
  if (!stripe.value || !elementsRef.value?.elements) return;
  
  isLoading.value = true;
  errorMessage.value = '';

  const { error } = await stripe.value.confirmPayment({
    elements: elementsRef.value.elements,
    confirmParams: {
      return_url: window.location.href, // Redirect back to the same page
    },
  });

  if (error) {
    errorMessage.value = error.message;
    isLoading.value = false;
  } else {
    // This part is usually handled by Stripe's redirect, but we can emit success here
    // if the redirect doesn't happen (e.g., for 3D Secure).
    emit('payment-success');
  }
};
</script>