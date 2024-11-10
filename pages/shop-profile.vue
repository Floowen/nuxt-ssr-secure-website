<template>
    <div class="layout-container">
      <!-- Kontainer utama dengan sidebar dan konten -->
      <div class="main-container">
        <!-- Sidebar -->
        <div class="sidebar">
          <Sidebar />
        </div>
  
        <!-- Konten Utama -->
        <div class="content">
          <v-container class="store-profile-container py-10">
            <div class="box">
              <div class="header">
                <h1 class="title">Store Profile</h1>
              </div>
              <div class="details">
                <div class="detail-item">
                  <span class="label">Store Name</span>
                  <span class="value">Mendoan</span>
                </div>
                <div class="detail-item">
                  <span class="label">Store Description</span>
                  <p class="value description">
                    Mendoan is a restaurant that offers a variety of "mendoan" dishes. On this website, customers will find attractive offers, including discounts and free food, starting from 6:00 PM onwards.
                  </p>
                </div>
                <div class="detail-item">
                  <span class="label">Store Logo</span>
                  <img class="store-logo" alt="Store Logo" src="/path/to/logo.png" />
                </div>
              </div>
            </div>
          </v-container>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/Sidebar.vue';
  
  export default {
    components: {
      Sidebar,
    },
  };
  </script>
  
  <style scoped>
  .layout-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .main-container {
    display: flex;
    flex: 1;
    height: calc(100vh - 64px); /* Sesuaikan dengan tinggi navbar */
  }
  
  .content {
    flex: 1;
    padding: 24px;
  }
  
  .box {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    padding: 32px;
  }
  
  .header {
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  
  .title {
    font-family: "Nunito Sans-Bold", Helvetica;
    font-size: 26px;
    font-weight: 700;
    color: #333;
  }
  
  .details {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .detail-item {
    display: flex;
    justify-content: flex-start; /* Mengatur agar konten rata kiri */
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding: 12px 0;
  }
  
  .label {
    font-family: "Nunito Sans-Regular", Helvetica;
    font-size: 18px;
    font-weight: 600;
    color: #555;
    min-width: 150px; /* Menambahkan lebar minimum untuk label */
  }
  
  .value {
    font-family: "Nunito Sans-Regular", Helvetica;
    font-size: 18px;
    color: #333;
    margin-left: 40px; /* Menambahkan jarak antara label dan nilai */
  }
  
  .description {
    max-width: 600px;
    line-height: 1.6;
  }
  
  .store-logo {
    width: 100px;
    height: auto;
    object-fit: cover;
  }
  </style>
  