<template>
  <v-footer class="footer-bg" padless>
    <v-container class="py-10">
      <v-row justify="center" align="start" class="mx-0">
        <!-- Logo dan Deskripsi -->
        <v-col cols="12" md="3" class="text-center text-md-left mb-6 mb-md-0">
          <v-img
            src="/favicon.ico"
            alt="Logo"
            contain
            max-width="50"
            max-height="50"
            class="mb-4"
          ></v-img>
          <p class="footer-text">
            We offer a variety of delicious dishes that suit both your taste and budget, ensuring you can enjoy a satisfying meal without breaking the bank.
          </p>
          <div class="social-icons">
            <v-btn
              v-for="item in socialIcons"
              :key="item.icon"
              icon
              :href="item.link"
              class="mx-2"
            >
              <v-icon size="24px">{{ item.icon }}</v-icon>
            </v-btn>
          </div>
        </v-col>

        <!-- Links - Company, Help, FAQ, Resources -->
        <v-col cols="6" md="2" v-for="section in footerSections" :key="section.title" class="mb-6 mb-md-0">
          <h4 class="footer-heading">{{ section.title }}</h4>
          <ul class="footer-list">
            <li v-for="link in section.links" :key="link.name">
              <a :href="link.url" class="footer-link">{{ link.name }}</a>
            </li>
          </ul>
        </v-col>
      </v-row>

      <!-- Copyright -->
      <v-row justify="center" class="mt-6">
        <v-col cols="12" class="text-center caption">
          © {{ new Date().getFullYear() }} — FoodEase, All rights reserved
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      socialIcons: [
        { icon: 'mdi-facebook', link: 'https://facebook.com' },
        { icon: 'mdi-twitter', link: 'https://twitter.com' },
        { icon: 'mdi-instagram', link: 'https://instagram.com' },
        { icon: 'mdi-github', link: 'https://github.com' },
      ],
      footerSections: [
        {
          title: 'Company',
          links: [
            { name: 'About', url: '/about' },
            { name: 'Features', url: '/features' },
          ],
        },
        {
          title: 'Help',
          links: [
            { name: 'Customer Support', url: '/support' },
            { name: 'Delivery Details', url: '/delivery' },
            { name: 'Terms & Conditions', url: '/terms' },
            { name: 'Privacy Policy', url: '/privacy' },
          ],
        },
        {
          title: 'FAQ',
          links: [
            { name: 'Account', url: '/account' },
            { name: 'Manage Deliveries', url: '/deliveries' },
            { name: 'Orders', url: '/orders' },
            { name: 'Payments', url: '/payments' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { name: 'Development Tutorial', url: '/tutorial' },
            { name: 'How to - Blog', url: '/blog' },
            { name: 'Youtube Playlist', url: '/youtube' },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>


.footer-heading {
  color: white;
  font-weight: bold;
  margin-bottom: 1rem;
}

.footer-text {
  color: #c4c4c4;
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  color: #c4c4c4;
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: white;
}

.social-icons {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  color: white !important;
}

.caption {
  font-size: 0.8rem;
  color: #c4c4c4;
}

.footer-bg {
  background-color: #13412F !important;
  position: relative; /* Pastikan footer tidak menggunakan posisi tetap */
  width: 100%;
}


/* Tambahkan margin bawah untuk memastikan jarak yang konsisten */

</style>
