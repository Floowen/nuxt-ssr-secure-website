<template>
    <v-container class="section-product-detail" fluid>
      <v-row class="py-10" justify="center">
        <!-- Product Image -->
        <v-col cols="12" md="5">
          <v-img :src="product.image" alt="Product Image" class="rounded-lg"></v-img>
        </v-col>
  
        <!-- Product Details -->
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold">{{ product.title }}</h1>
          <p class="text-body-2 text--secondary mb-2">{{ product.restaurantName }}</p>
          <v-rating :value="product.rating" dense readonly color="amber" class="mb-2"></v-rating>
          <div class="text-body-2">{{ product.rating }}/5</div>
  
          <h4 class="mt-4 font-weight-bold">Description :</h4>
          <p class="text-body-2 text--secondary">{{ product.description }}</p>
  
          <h4 class="mt-4 text-success font-weight-bold text-h5">{{ product.discountPrice }}</h4>
          <div class="text-decoration-line-through text-body-2 text--secondary mb-2">{{ product.originalPrice }}</div>
  
          <p class="text-body-2 text--secondary">Consumable Time : {{ product.consumableTime }}</p>
  
          <!-- Custom Button Component -->
          <Button
            color="success"
            class="mt-4"
            :href="'#'"
          >
            Add to Cart
          </Button>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import Button from '@/components/Button.vue'; // Adjust the path to your Button component
  
  export default {
    components: {
      Button,
    },
    data() {
      return {
        product: {
          image: '/img/Products/nasi-goreng.png',
          title: 'Nasi Goreng',
          restaurantName: 'Nasi Goreng Jakarta',
          rating: 4,
          description: 'Lorem ipsum awai yuki no youni futari to ochiteku zutto anata wa asu wa monogatari...',
          discountPrice: 'Rp10.000',
          originalPrice: 'Rp25.000',
          consumableTime: '12/12/2004 19.00',
        },
      };
    },
  };
  </script>
  
  <style scoped>
  .section-product-detail {
    background-color: #fff;
    min-height: 100vh;
  }
  
  .rounded-lg {
    border-radius: 8px;
  }
  
  .text-decoration-line-through {
    text-decoration: line-through;
  }
  
  .text-success {
    color: #28a745;
  }
  </style>
  