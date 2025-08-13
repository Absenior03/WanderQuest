<template>
  <router-link :to="{ name: 'tour', params: { id: tour.id } }" class="block">
    <div class="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-2 group">
      <div class="relative">
        <img :src="tour.imageUrl" :alt="tour.title" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <h3 class="absolute bottom-4 left-4 text-2xl font-serif font-bold text-white group-hover:text-cyan-300 transition-colors">{{ tour.title }}</h3>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-2 text-slate-400 mb-4"><MapPin :size="16" /><span>{{ tour.destination }}</span></div>
        <div class="flex justify-between items-center text-slate-300">
          <div class="flex items-center gap-2"><Calendar :size="16" /><span>{{ tour.durationDays }} Days</span></div>
          <div class="flex items-center gap-2 text-xl font-bold text-cyan-400">
            <span class="text-xs font-normal text-slate-400">From</span><DollarSign :size="16" /><span>{{ tour.basePrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script setup>
import { MapPin, Calendar, DollarSign } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
defineProps({ tour: Object });
</script>