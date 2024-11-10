<template>
  <v-container
    class="section-food"
    :style="`background-image: url('${backgroundImage}'); 
             background-color: ${backgroundColor}`"
    fluid
  >
    <v-container class="py-12">
      <span class="ma-auto">
        <h1
          v-if="heroTitle"
          class="text-h2 mb-6 text-center"
          style="color: #4a556d; font-weight: 100; text-shadow: 1px 1px 0 #4a556d;"
        >
          {{ heroTitle }}
        </h1>
        <h2
          v-if="title"
          class="text-h3 text-center mb-12"
          style="color: #4a556d; font-weight: 2000; text-shadow: 1px 1px 0 #4a556d;"
        >
          {{ title }}
        </h2>
      </span>
      <v-row>
        <v-col v-for="(card, i) in cards" :key="i" cols="12" md="3">
          <v-hover v-slot="{ hover }">
            <v-card shaped :class="`${hover ? 'on-hover' : ''}`">
              <!-- Menggunakan v-img untuk gambar kartu -->
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
                <a :href="card.href" class="ml-2 mb-1 text-body2 link-styles">
                  {{ buttonText }}
                  <v-icon small class="link-styles">mdi-chevron-right</v-icon>
                </a>
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
    cards: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    buttonText: {
      type: String,
      required: true,
      default: '',
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
.section-food {
  min-height: 400px;
  background-position: center;
  background-size: cover;
  .v-card {
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 15px 35px 0px rgba(112, 144, 176, 0.2);
    .v-img {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .text-decoration-line-through {
      text-decoration: line-through;
    }
    .title-styles {
      font-weight: 500 !important;
      color: #47536b;
    }
    .subtitle-styles {
      font-size: 1.02em;
      line-height: 1.5em;
      color: #6b7b9c;
    }
    .link-styles {
      color: #929db6;
      &:hover {
        color: #47536b;
      }
    }
  }
  .on-hover {
    box-shadow: 0px 15px 35px 0px rgba(112, 144, 176, 0.4);
    transform: scale(1.03);
  }
}
</style>
