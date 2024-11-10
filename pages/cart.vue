<template>
    <v-container class="cart-page py-12" fluid>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="text-h4 font-weight-bold mb-6 text-left">Your Cart</h1>
  
          <!-- Header Cart -->
          <v-row class="cart-header mb-4">
            <v-col cols="5">Products</v-col>
            <v-col cols="2" class="text-center">Price</v-col>
            <v-col cols="2" class="text-center">QTY</v-col>
            <v-col cols="2" class="text-center">Unit Price</v-col>
          </v-row>
  
          <!-- Cart Items -->
          <v-row
            v-for="(item, index) in cartItems"
            :key="index"
            class="cart-item align-center mb-4"
          >
            <v-col cols="5" class="d-flex align-center">
              <v-btn icon @click="removeItem(index)" class="mr-4">
                <v-icon color="red">mdi-close</v-icon>
              </v-btn>
              <v-img :src="item.image" alt="Product Image" max-width="80" class="rounded mr-4"></v-img>
              <div>
                <h4 class="font-weight-bold mb-1">{{ item.title }}</h4>
                <p class="text-body-2 text--secondary">{{ item.description }}</p>
              </div>
            </v-col>
  
            <v-col cols="2" class="text-center text-success font-weight-bold">{{ item.price }}</v-col>
  
            <v-col cols="2" class="text-center d-flex align-center justify-center">
              <v-btn icon @click="decreaseQuantity(index)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="mx-2">{{ item.quantity }}</span>
              <v-btn icon @click="increaseQuantity(index)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
  
            <v-col cols="2" class="text-center">{{ item.unitPrice }}</v-col>
          </v-row>
  
          <!-- Cart Summary -->
          <v-row class="cart-summary mt-6 justify-end">
            <v-col cols="12" md="4" class="text-right">
              <div class="mb-2">Subtotal: <span class="font-weight-bold">{{ subtotal }}</span></div>
              <div class="total text-h5 font-weight-bold mb-4">TOTAL: {{ total }}</div>
                <Button class="button-next" color="success">Next</Button>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import Button from '@/components/Button.vue';
  
  export default {
    components: {
      Button,
    },
    data() {
      return {
        cartItems: [
          {
            image: '/path/to/image1.jpg',
            title: 'Nasi Goreng',
            description: 'Nasi Goreng with egg and ...',
            price: 'Rp10.000',
            quantity: 1,
            unitPrice: 'Rp10.000',
          },
          {
            image: '/path/to/image2.jpg',
            title: 'Nasi Bebek Rica-rica',
            description: 'Rice with duck and salted egg ...',
            price: 'Rp13.000',
            quantity: 1,
            unitPrice: 'Rp13.000',
          },
        ],
      };
    },
    computed: {
      subtotal() {
        return this.cartItems.reduce(
          (total, item) => total + parseInt(item.price.replace('Rp', '').replace('.', '')),
          0
        );
      },
      total() {
        return `Rp${this.subtotal.toLocaleString()}`;
      },
    },
    methods: {
      removeItem(index) {
        this.cartItems.splice(index, 1);
      },
      decreaseQuantity(index) {
        if (this.cartItems[index].quantity > 1) {
          this.cartItems[index].quantity--;
        }
      },
      increaseQuantity(index) {
        this.cartItems[index].quantity++;
      },
    },
  };
  </script>
  
  <style scoped>
  .cart-page {
    background-color: #ffffff;
    min-height: 100vh;
  }
  
  .cart-header,
  .cart-item {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 1rem;
  }
  
  .cart-summary {
    border-top: 1px solid #e0e0e0;
    padding-top: 1rem;
  }
  
  .total {
    color: #276749;
  }

  .button-next {
  display: block;
  margin-left: auto;
  margin-right: 0;
}
  </style>
  