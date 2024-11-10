<template>
  <v-container
    class="section-benefits-icons"
    :style="`background-image: url('${backgroundImage}'); background-color: ${backgroundColor}`"
    fluid
  >
    <v-container class="py-0">
      <v-row justify="space-around" align="center">
        <v-col v-for="(card, i) in cards" :key="i" cols="12" md="2" class="d-flex justify-center">
          <v-card flat>
            <div class="d-flex flex-column align-center">
              <v-avatar size="120" color="transparant" class="mt-4">
                <!-- Gunakan v-img untuk menampilkan gambar sebagai ikon -->
                <v-img :src="card.icon" :alt="card.title" style="width: 90px; height: 90px;" contain></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  props: {
    cards: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    backgroundImage: {
      type: String,
      required: false,
      default: '',
    },
    backgroundColor: {
      type: String,
      required: false,
      default: '#13412F',
    },
  },
};
</script>

<style lang="scss" scoped>
.section-benefits-icons {
  background-position: center;
  background-size: cover;
  .v-card {
    background-color: transparent;
    .v-avatar {
      box-shadow: 0px 15px 35px 0px rgba(70, 90, 109, 0.3);
    }
  }
}
</style>
