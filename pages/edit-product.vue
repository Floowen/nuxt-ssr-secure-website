<template>
    <div class="layout-container">
      <!-- Main Container with Sidebar and Content -->
      <div class="main-container">
        <!-- Sidebar -->
        <div class="sidebar">
          <Sidebar />
        </div>
  
        <!-- Content Section -->
        <div class="content">
          <v-container class="edit-product-container py-10">
            <h1 class="title">Edit Products</h1>
  
            <!-- Form Section -->
            <div class="form-container">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="productName"
                    label="Product Name"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="image-col">
                  <v-img
                    :src="productImage"
                    class="product-image"
                    contain
                  ></v-img>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="productDescription"
                    label="Product Description"
                    outlined
                    dense
                    maxlength="100"
                    counter
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="category"
                    label="Category"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="productionTime"
                    label="Production Time"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="expiredEstimation"
                    label="Product Expired Estimation"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="priceAfter"
                    label="Product Price After"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="priceBefore"
                    label="Product Price Before"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
  
              <v-btn color="success" class="edit-button" @click="editProduct">
                Edit Product
              </v-btn>
            </div>
          </v-container>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from "@/components/Sidebar.vue";
  
  export default {
    name: "EditProductPage",
    components: {
      Sidebar,
    },
    data() {
      return {
        productName: "Chicken Fried Rice",
        productDescription:
          "Fried rice with premium condiments, and an asian-styled spices.",
        category: "Indonesian food",
        productionTime: "09.00",
        expiredEstimation: "18.00",
        priceAfter: "15000",
        priceBefore: "25000",
        productImage: "/img/Products/nasi-goreng.png", // Path gambar
      };
    },
    methods: {
      editProduct() {
        // Logika untuk mengedit produk
        alert("Product edited successfully!");
      },
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
    height: calc(100vh - 64px); /* Adjust based on the height of the navbar */
  }
  
  .content {
    flex: 1;
    padding: 24px;
  }
  
  .edit-product-container {
    background-color: #eef6f3;
    border-radius: 8px;
    padding: 32px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .image-col {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .product-image {
    border-radius: 8px;
    max-width: 150px;
    max-height: 150px;
  }
  
  .edit-button {
    margin-top: 16px;
    width: 100%;
  }
  </style>
  