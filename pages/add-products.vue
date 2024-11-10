<template>
    <div class="layout-container">
      <!-- Main Container with Sidebar and Content -->
      <div class="main-container">
        <!-- Sidebar -->
        <div class="sidebar">
          <Sidebar />
        </div>
  
        <!-- Main Content -->
        <div class="content">
          <v-container class="add-products-container py-10">
            <div class="box">
              <h1 class="title">Add New Products</h1>
              <v-form ref="form" v-model="valid">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="productName"
                      label="Product Name"
                      :rules="[rules.required]"
                      placeholder="eg. Chicken Fried Rice"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="productionTime"
                      label="Production Time"
                      :rules="[rules.required]"
                      placeholder="eg. 09.00"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-textarea
                      v-model="description"
                      label="Product Description"
                      :rules="[rules.required]"
                      placeholder="Text"
                      outlined
                      dense
                      maxlength="100"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="expiredEstimation"
                      label="Product Expired Estimation"
                      :rules="[rules.required]"
                      placeholder="eg. 18.00"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="priceAfter"
                      label="Product Price After"
                      :rules="[rules.required, rules.numeric]"
                      placeholder="eg. 15000"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="priceBefore"
                      label="Product Price Before"
                      :rules="[rules.required, rules.numeric]"
                      placeholder="eg. 25000"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="category"
                      label="Category"
                      :rules="[rules.required]"
                      placeholder="eg. Food"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="image"
                      label="Upload Product Image"
                      :rules="[rules.required]"
                      outlined
                      dense
                      placeholder="Upload image"
                      accept="image/*"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-btn color="success" :disabled="!valid" @click="submitForm" block>
                  Add Product
                </v-btn>
              </v-form>
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
    data() {
      return {
        valid: false,
        productName: '',
        productionTime: '',
        description: '',
        expiredEstimation: '',
        priceAfter: '',
        priceBefore: '',
        category: '',
        image: null,
        rules: {
          required: value => !!value || 'This field is required',
          numeric: value => !isNaN(value) || 'Must be a number',
        },
      };
    },
    methods: {
      submitForm() {
        if (this.$refs.form.validate()) {
          // Logic to add product
          console.log('Product added successfully');
        }
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
    height: calc(100vh - 64px); /* Adjusted for navbar height */
  }
  
  .content {
    flex: 1;
    padding: 24px;
  }
  
  .add-products-container {
    background-color: #eef6f3;
    min-height: 100vh;
  }
  
  .box {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    padding: 32px;
  }
  
  .title {
    font-family: "Nunito Sans-Bold", Helvetica;
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 24px;
  }
  </style>
  