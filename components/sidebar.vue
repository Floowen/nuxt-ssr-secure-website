<template>
    <div class="layout-container">
      <!-- Tombol untuk membuka/tutup sidebar -->
      <v-btn icon class="menu-button" @click="toggleSidebar">
        <v-icon>mdi-menu</v-icon> <!-- Ikon menu -->
      </v-btn>
  
      <!-- Sidebar -->
      <v-navigation-drawer
        app
        v-model="isSidebarOpen"
        class="sidebar"
      >
        <v-list>
          <v-list-item-group>
            <v-list-item :to="'/shop-profile'" class="nav-item">
              <v-icon left>mdi-store</v-icon>
              <span>Shop Profile</span>
            </v-list-item>
            <v-list-item :to="'/my-products'" class="nav-item">
              <v-icon left>mdi-basket</v-icon>
              <span>My Products</span>
            </v-list-item>
            <v-list-item :to="'/add-products'" class="nav-item">
              <v-icon left>mdi-plus-box</v-icon>
              <span>Add Products</span>
            </v-list-item>
            <v-list-item :to="'/my-orders'" class="nav-item">
              <v-icon left>mdi-file-document</v-icon>
              <span>My Order</span>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
  
      <!-- App Bar -->
      <v-app-bar app color="#377F61" dark>
        <v-toolbar-title>My Application</v-toolbar-title>
      </v-app-bar>
  
      <!-- Main Content -->
      <div class="content">
        <slot></slot> <!-- Konten halaman Anda -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isSidebarOpen: false, // Sidebar default tertutup
      };
    },
    methods: {
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen; // Buka/tutup sidebar
      },
    },
  };
  </script>
  
  <style scoped>
  .layout-container {
    display: flex;
    height: 100vh;
  }
  
  .menu-button {
    position: absolute; /* Letakkan tombol di atas sendiri */
    top: 10px; /* Jarak dari atas */
    left: 10px; /* Jarak dari kiri */
    z-index: 1100; /* Pastikan tombol berada di atas elemen lainnya */
  }
  
  .sidebar {
    z-index: 100;
    width: 250px;
  }
  
  .content {
    flex: 1;
    padding: 24px;
  }
  </style>
  