<template>
  <v-container
    class="section-benefits"
    :style="`background-image: url('${backgroundImage}'); background-color: ${backgroundColor}`"
    fluid
  >
    <v-container class="py-10">
      <span class="ma-auto">
        <h2 class="text-h4 text-center" style="color: #4a556d">
          {{ title }}
        </h2>
        <h3 class="text-center mt-4 subtitle-big" style="color: #6b7b9c">
          {{ subTitle }}
        </h3>
      </span>

      <!-- Menggunakan v-slide-group untuk membuat carousel -->
      <v-slide-group show-arrows class="mt-10">
        <v-slide-item
          v-for="(card, i) in cards"
          :key="i"
          class="d-flex"
        >
          <!-- Ubah md="6" menjadi md="4" untuk menampilkan 3 kartu atau md="3" untuk 4 kartu -->
          <v-col cols="12" md="2">
            <v-card flat class="px-6 py-4">
              <div class="d-flex align-center mb-2">
                <!-- Bintang Rating -->
                <v-icon color="amber" v-for="n in 5" :key="n">mdi-star</v-icon>
              </div>
              <div class="d-flex align-center mb-2">
                <!-- Ikon Centang -->
                <v-icon color="green" class="mr-2">mdi-check-circle</v-icon>
              </div>
              <!-- Nama Pelanggan -->
              <p class="font-weight-bold" style="color: #47536b;">
                {{ card.name }}
              </p>
              <!-- Teks Ulasan -->
              <p class="text-body-2" style="color: #47536b;">
                {{ card.review }}
              </p>
            </v-card>
          </v-col>
        </v-slide-item>
      </v-slide-group>

    </v-container>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    subTitle: {
      type: String,
      required: false,
      default: '',
    },
    cards: {
      type: Array,
      required: true,
      default() {},
    },
    backgroundImage: {
      type: String,
      required: false,
      default: '',
    },
    backgroundColor: {
      type: String,
      required: false,
      default: '#f9fafd',
    },
  },
};
</script>

<style lang="scss" scoped>
.section-benefits {
  min-height: 400px;
  background-position: center;
  background-size: cover;
  .v-card {
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 15px 35px 0px rgba(112, 144, 176, 0.2);
    width: 600px;
    .text-body-2 {
      font-size: 1.02em;
      line-height: 1.5em;
      color: #6b7b9c;
      width: 100%;
    }
  }
  .v-icon {
    font-size: 20px;
  }
}
</style>
