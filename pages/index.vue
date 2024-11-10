<template>
  <div>
    <SectionHero
      hero-title="EAT WELL, SPEND LESS: AFFORDABLE DINING AT YOUR FINGERTIPS"
      title="Find your favorite meals at prices that won't break the bank. Start your journey to budget-friendly dining today!"
      background-image="/img/LandingPage/hero-section.png"
      :button="{ text: 'Order Now', href: 'https://nuxtjs.org/' }"
    ></SectionHero>
    <SectionBenefitsIcons
      :cards="sectionBenefitsIconsCards"
    ></SectionBenefitsIcons>
    <SectionFood
      title="READY TO EAT"
      button-text="Beli Sekarang"
      :cards="sectionfoodCards"
      background-image="/img/bg_white_geometric.jpg"
    ></SectionFood>
    <SectionBenefits
      title="Our Happy Customer"
      sub-title="We are grateful for the trust our customers have in us"
      :cards="customerReviews"
      background-image="/img/background.jpg"
      background-color="#f9fafd"
    ></SectionBenefits>

    <v-snackbar v-model="sb.open" top rounded :color="sb.color">
      {{ sb.text }}
      <template #action="{ attrs }">
        <v-btn
          color="#ddd"
          text
          min-width="30px"
          class="body-1"
          v-bind="attrs"
          @click="sb.open = false"
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  middleware: 'authorize',

  data() {
    return {
          sectionfoodCards: [
      {
        title: 'Nasi Ayam Geprek',
        discountPrice: 'Rp13.000',
        originalPrice: 'Rp25.000',
        restaurantName: 'Daun Pisang Restaurant',
        image: '/img/LandingPage/makanan.png',
        href: 'https://nuxtjs.org/',
        rating: 4, // Rating out of 5
      },
      {
        title: 'Nasi Ayam Geprek',
        discountPrice: 'Rp13.000',
        originalPrice: 'Rp25.000',
        restaurantName: 'Daun Pisang Restaurant',
        image: '/img/LandingPage/makanan.png',
        href: 'https://nuxtjs.org/',
        rating: 4, // Rating out of 5
      },
      {
        title: 'Nasi Ayam Geprek',
        discountPrice: 'Rp13.000',
        originalPrice: 'Rp25.000',
        restaurantName: 'Daun Pisang Restaurant',
        image: '/img/LandingPage/makanan.png',
        href: 'https://nuxtjs.org/',
        rating: 4, // Rating out of 5
      },
      {
        title: 'Nasi Ayam Geprek',
        discountPrice: 'Rp13.000',
        originalPrice: 'Rp25.000',
        restaurantName: 'Daun Pisang Restaurant',
        image: '/img/LandingPage/makanan.png',
        href: 'https://expressjs.com/',
        rating: 4,
      },
      {
        title: 'Nasi Ayam Geprek',
        discountPrice: 'Rp13.000',
        originalPrice: 'Rp25.000',
        restaurantName: 'Daun Pisang Restaurant',
        image: '/img/LandingPage/makanan.png',
        href: 'https://vuetifyjs.com/en/',
        rating: 4,
      },
      {
        title: 'Nasi Ayam Geprek',
        discountPrice: 'Rp13.000',
        originalPrice: 'Rp25.000',
        restaurantName: 'Daun Pisang Restaurant',
        image: '/img/LandingPage/makanan.png',
        href: 'http://knexjs.org/',
        rating: 4,
      },
      {
        title: 'Nasi Ayam Geprek',
        discountPrice: 'Rp13.000',
        originalPrice: 'Rp25.000',
        restaurantName: 'Daun Pisang Restaurant',
        image: '/img/LandingPage/makanan.png',
        href: 'https://joi.dev/api/?v=17.4.0',
        rating: 4,
      },
      {
        title: 'Nasi Ayam Geprek',
        discountPrice: 'Rp13.000',
        originalPrice: 'Rp25.000',
        restaurantName: 'Daun Pisang Restaurant',
        image: '/img/LandingPage/makanan.png',
        href: 'https://blog.logrocket.com/es-modules-in-node-today/',
        rating: 4,
      },
      // Tambahkan lebih banyak objek jika diperlukan...
    ],


      sectionBenefitsIconsCards: [
        {
          icon: '/img/LandingPage/logobrand.png',
        },
        {
          icon: '/img/LandingPage/logobrand.png',
        },
        {
          icon: '/img/LandingPage/logobrand.png',
        },
        {
          icon: '/img/LandingPage/logobrand.png',
        },
        {
          icon: '/img/LandingPage/logobrand.png',
        },
        {
          icon: '/img/LandingPage/logobrand.png',
        },
      ],

      customerReviews: [
      {
          name: 'John Doe',
          review:
            '“Lorem ipsum awai yuki no youni futari to ochiteku zutto anata wa asu wa monogatari suida anata ni nogoshitta negai sakura no you ni ima wa tada fukareru sucikara hokorie kasaneta hibi wo”',
        },
        {
          name: 'John Doe',
          review:
            '“Lorem ipsum awai yuki no youni futari to ochiteku zutto anata wa asu wa monogatari suida anata ni nogoshitta negai sakura no you ni ima wa tada fukareru sucikara hokorie kasaneta hibi wo”',
        },
        {
          name: 'John Doe',
          review:
            '“Lorem ipsum awai yuki no youni futari to ochiteku zutto anata wa asu wa monogatari suida anata ni nogoshitta negai sakura no you ni ima wa tada fukareru sucikara hokorie kasaneta hibi wo”',
        },
        {
          name: 'John Doe',
          review:
            '“Lorem ipsum awai yuki no youni futari to ochiteku zutto anata wa asu wa monogatari suida anata ni nogoshitta negai sakura no you ni ima wa tada fukareru sucikara hokorie kasaneta hibi wo”',
        },
        {
          name: 'Jane Smith',
          review:
            '“Another wonderful review text that shows how satisfied our customers are with our service.”',
        },
      ],

      sb: { open: false, color: 'success', text: '' },
    }
  },

  mounted() {
    if (this.$route.query.login === 'yes') {
      this.sb.color = 'success'
      this.sb.text = 'You are signed in.'
      return (this.sb.open = true)
    }
    if (this.$route.query.logout === 'yes') {
      this.sb.color = 'success'
      this.sb.text = 'You are signed out.'
      return (this.sb.open = true)
    }
    if (this.$route.query.logout === 'error') {
      this.sb.color = 'error'
      this.sb.text = 'Sign-out error. Please try again.'
      return (this.sb.open = true)
    }
  },
}
</script>
