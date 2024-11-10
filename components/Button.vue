<!-- BaseButton.vue -->
<template>
    <v-btn
      :color="color"
      :href="href"
      class="base-button"
      v-bind="attributes"
      :elevation="elevation"
      :rounded="rounded"
    >
      <slot></slot>
    </v-btn>
  </template>
  
  <script>
  export default {
    props: {
      color: {
        type: String,
        default: 'primary', // Warna default, bisa disesuaikan
      },
      href: {
        type: String,
        default: '',
      },
      elevation: {
        type: [Number, String],
        default: 2, // Elevasi default
      },

      attributes: {
        type: Object,
        default: () => ({}),
      },
    },
  };
  </script>
  
  <style scoped>
  .base-button {
    font-size: 1.2rem;
    font-weight: 600; /* Atur gaya huruf */
    text-transform: none; /* Nonaktifkan transformasi teks */
    padding: 24px 48px; /* Atur padding */
    transition: background-color 0.3s ease; /* Efek transisi */
    all: unset;
    align-items: center;
    background-color: var(--primary-600);
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    gap: 10px;
    justify-content: center;
    padding: 48px 24px;
    position: relative;
    width: 205px;
    cursor: pointer;
  }
  
  .base-button:hover {
    background-color: #276749; /* Warna saat hover */
  }
  </style>
  