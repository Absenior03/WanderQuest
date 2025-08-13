<template>
  <header class="header">
    <nav class="header-nav">
      <div class="logo" @click="$emit('logo-click')">
        <Globe />
        <h1>WanderQuest</h1>
      </div>
    </nav>
  </header>
</template>
<script setup>
import { Globe } from 'lucide-vue-next';
defineEmits(['logo-click']);
</script>