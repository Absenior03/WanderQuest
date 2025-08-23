<template>
  <div class="min-h-screen text-white font-sans bg-slate-900">
    <Header @logo-click="goHome" />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import Header from './components/Navbar.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const goHome = () => router.push('/');
</script>