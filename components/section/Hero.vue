<template>
  <v-container
    class="section-hero"
    :style="`background-image: url('${backgroundImage}');`"
    fluid
  >
    <v-container class="mt-8 d-flex" style="height: 40vh; width: 1000px">
      <span>
        <h1 v-if="heroTitle" class="hero-title">
          {{ heroTitle }}
        </h1>
        <h2 v-if="title" class="hero-subtitle">
          {{ title }}
        </h2>
        <!-- Gunakan BaseButton sebagai tombol -->
        <BaseButton v-if="button" color="success" :href="button.href">
          {{ button.text }}
        </BaseButton>
      </span>
    </v-container>
  </v-container>
</template>

<script>
import BaseButton from '@/components/Button.vue'; // Pastikan path ini benar

export default {
  components: {
    BaseButton,
  },
  props: {
    heroTitle: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    backgroundImage: {
      type: String,
      required: false,
      default: '',
    },
    button: {
      type: Object,
      required: false,
      default: () => ({
        text: 'Order Now',
        href: '#',
      }),
    },
  },
};
</script>

<style scoped>
.section-hero {
  min-height: 720px;
  background-position: center;
  background-size: cover;
}

.hero-title {
  font-size: 3.5rem;
  color: #000000;
  font-weight: 900;
  text-align: left;
  margin-bottom: 1.5rem;
  width: 800px;
  line-height: 1.2;
}

.hero-subtitle {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #000000;
  text-align: left;
  width: 800px;
}

.mt-8 {

  padding-top: 5rem;
  margin-top: 24rem;
  margin-left: 10rem;
}


</style>
