<template>
    <v-container class="section-food-page" fluid>
      <!-- Judul Halaman Produk -->
      <v-container class="py-12 text-center">
        <h1 class="display-1 font-weight-bold">Our Delicious Products</h1>
        <p class="subtitle-1">Explore our affordable and tasty meals!</p>
      </v-container>
  
      <!-- Daftar Produk -->
      <v-container>
        <v-row>
          <v-col v-for="(card, i) in cards" :key="i" cols="12" md="3">
            <v-hover v-slot="{ hover }">
              <v-card shaped :class="`${hover ? 'on-hover' : ''}`">
                <v-img :src="card.image" height="180px" class="rounded-top"></v-img>
                <v-card-text>
                  <div class="font-weight-bold text-body-1 mb-2">{{ card.title }}</div>
                  <div class="text-success font-weight-bold text-h6">{{ card.discountPrice }}</div>
                  <div class="text-decoration-line-through text-body-2 text--secondary mb-2">{{ card.originalPrice }}</div>
                  <div class="text-body-2 text--secondary">{{ card.restaurantName }}</div>
                  <div class="d-flex align-items-center mt-2">
                    <v-rating :value="card.rating" dense readonly color="amber" class="mr-2"></v-rating>
                    <div class="text-body-2">{{ card.rating }}/5</div>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <nuxt-link :to="card.to" class="ml-2 mb-1 text-body2 link-styles">
                    {{ buttonText }}
                    <v-icon small class="link-styles">mdi-chevron-right</v-icon>
                  </nuxt-link>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cards: [
          {
            title: 'Nasi Ayam Geprek',
            discountPrice: 'Rp15.000',
            originalPrice: 'Rp25.000',
            restaurantName: 'Jodir',
            image: '/img/Products/nasi-ayam-geprek.png',
            to: '/detail-product',
            rating: 4,
          },
          {
            title: 'Nasi Goreng',
            discountPrice: 'Rp10.000',
            originalPrice: 'Rp25.000',
            restaurantName: 'Nasi Goreng Jakarta',
            image: '/img/Products/nasi-goreng.png',
            to: '/detail-product',
            rating: 4,
          },
          {
            title: 'Nasi Sate Ayam',
            discountPrice: 'Rp8.000',
            originalPrice: 'Rp25.000',
            restaurantName: 'Sate Ayam Padang',
            image: '/img/Products/nasi-sate-ayam.png',
            to: '/detail-product',
            rating: 4,
          },
          {
            title: 'Nasi Bebek Rica-rica',
            discountPrice: 'Rp13.000',
            originalPrice: 'Rp25.000',
            restaurantName: 'Daun Pisang Restaurant',
            image: '/img/Products/nasi-bebek-rica-rica.png',
            to: '/detail-product',
            rating: 4,
          },
          {
            title: 'Nasi Ayam Geprek',
            discountPrice: 'Rp15.000',
            originalPrice: 'Rp25.000',
            restaurantName: 'Jodir',
            image: '/img/Products/nasi-ayam-geprek.png',
            to: '/detail-product',
            rating: 4,
          },
          {
            title: 'Nasi Goreng',
            discountPrice: 'Rp10.000',
            originalPrice: 'Rp25.000',
            restaurantName: 'Nasi Goreng Jakarta',
            image: '/img/Products/nasi-goreng.png',
            to: '/detail-product',
            rating: 4,
          },
          {
            title: 'Nasi Sate Ayam',
            discountPrice: 'Rp8.000',
            originalPrice: 'Rp25.000',
            restaurantName: 'Sate Ayam Padang',
            image: '/img/Products/nasi-sate-ayam.png',
            to: '/detail-product',
            rating: 4,
          },
          {
            title: 'Nasi Bebek Rica-rica',
            discountPrice: 'Rp13.000',
            originalPrice: 'Rp25.000',
            restaurantName: 'Daun Pisang Restaurant',
            image: '/img/Products/nasi-bebek-rica-rica.png',
            to: '/detail-product',
            rating: 4,
          },
          // Tambahkan lebih banyak produk sesuai kebutuhan...
        ],
        buttonText: 'Order Now',
      };
    },
  };
  </script>
  
  <style scoped>
.section-food-page {
  background-color: #f9fafd;
  min-height: 100vh;
}

.v-card {
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 15px 35px 0px rgba(112, 144, 176, 0.2);
}

.v-img {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.text-decoration-line-through {
  text-decoration: line-through;
}

.link-styles {
  color: #929db6;
}

.link-styles:hover {
  color: #47536b;
}

.on-hover {
  box-shadow: 0px 15px 35px 0px rgba(112, 144, 176, 0.4);
  transform: scale(1.03);
}
  </style>
  