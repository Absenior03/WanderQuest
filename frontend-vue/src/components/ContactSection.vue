<template>
  <div class="contact-section">
    <div class="contact-container">
      <div class="contact-text">
        <h2 class="section-title">Ready for Your Next Adventure?</h2>
        <p class="contact-subtitle">
          Have questions or a custom trip in mind? Our travel experts are here to help you craft the journey of a lifetime. Reach out and let's start planning.
        </p>
      </div>
      <div class="contact-form-wrapper">
        <form @submit.prevent="handleSubmit" class="contact-form">
          <input type="text" placeholder="Your Name" class="form-input" required />
          <input type="email" placeholder="Your Email" class="form-input" required />
          <textarea placeholder="Your Message" rows="4" class="form-input" required></textarea>
          <button type="submit" class="form-button">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleSubmit = () => {
  alert('Thank you for your message! We will get back to you shortly.');
  // In a real app, you would handle form submission here.
};
</script>