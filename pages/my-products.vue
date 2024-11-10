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
        <v-container class="products-container py-10">
          <div class="header">
            <h1 class="title">Products Detail</h1>
            <div class="search-bar">
              <v-text-field
                v-model="search"
                label="Search Product Name"
                outlined
                dense
                class="search-input"
              ></v-text-field>
              <v-btn color="success" class="apply-button" @click="applySearch">
                Apply
              </v-btn>
            </div>
          </div>
          <div class="table-container">
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="checkbox-column">
                    <v-checkbox
                      :input-value="selectAll"
                      @click="toggleSelectAll"
                    ></v-checkbox>
                  </th>
                  <th class="products-column">Products</th>
                  <th class="price-column">Price</th>
                  <th class="time-column">Consumable Time</th>
                  <th class="action-column">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in filteredProducts" :key="index">
                  <td class="checkbox-column">
                    <v-checkbox
                      :input-value="selectedProducts.includes(product)"
                      @click="toggleSelectProduct(product)"
                    ></v-checkbox>
                  </td>
                  <td class="products-column product-info">
                    <v-img :src="product.image" height="100%" width="100%" class="image"></v-img>
                    <div>
                      <p class="product-title">{{ product.title }}</p>
                      <p class="product-description text--secondary">
                        {{ product.description }}
                      </p>
                    </div>
                  </td>
                  <td class="price-column">{{ product.price }}</td>
                  <td class="time-column">{{ product.consumableTime }}</td>
                  <td class="action-column">
                    <v-btn text color="blue" @click="editProduct(product)">
                      Edit
                    </v-btn>
                    <v-btn text color="red" @click="deleteProduct(product)">
                      Delete
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
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
      search: '',
      selectAll: false,
      selectedProducts: [],
      products: [
        {
          image: '/img/Products/nasi-sate-ayam.png',
          title: 'Nasi Goreng',
          description: 'Nasi Goreng with egg and ...',
          price: 'Rp12.000',
          consumableTime: '12/12/2004 19:00',
        },
        {
          image: '/path/to/nasi-goreng.png',
          title: 'Ayam',
          description: 'Nasi Goreng with egg and ...',
          price: 'Rp12.000',
          consumableTime: '12/12/2004 19:00',
        },
        {
          image: '/path/to/nasi-goreng.png',
          title: 'Nasi Goreng',
          description: 'Nasi Goreng with egg and ...',
          price: 'Rp12.000',
          consumableTime: '12/12/2004 19:00',
        },
        // Tambahkan produk lainnya di sini
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    applySearch() {
      // Logika untuk apply search
    },
    toggleSelectAll() {
      this.selectAll = !this.selectAll;
      this.selectedProducts = this.selectAll ? [...this.products] : [];
    },
    toggleSelectProduct(product) {
      if (this.selectedProducts.includes(product)) {
        this.selectedProducts = this.selectedProducts.filter(
          p => p !== product
        );
      } else {
        this.selectedProducts.push(product);
      }
    },
    editProduct(product) {
      // Logika untuk mengedit produk
    },
    deleteProduct(product) {
      // Logika untuk menghapus produk
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
  height: calc(100vh - 64px); /* Sesuaikan dengan tinggi navbar */
}

.content {
  flex: 1;
  padding: 24px;
    
}

.products-container {
  background-color: #eef6f3;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-family: "Nunito Sans-Bold", Helvetica;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-input {
  max-width: 300px;
}

.apply-button {
  margin-left: 8px;
}

.table-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

tbody tr {
  height: 160px; /* Set a consistent row height */
}

thead th {
  text-align: left;
  vertical-align: middle; /* Center align vertically */
  padding: 8px 16px;
}

tbody td {
  padding: 8px 16px;
  vertical-align: middle; /* Center align vertically */
}

.checkbox-column {
  width: 50px;
}

.price-column,
.time-column,
.action-column {
  width: 150px;
  text-align: left;
}


.image {
  object-fit: cover; /* Options: contain, cover, fill, etc. */
  max-width: 80px; /* Fixed width */
  max-height: 80px; /* Fixed height */
  border-radius: 4px;
}

.product-title {
  font-family: "Nunito Sans-Bold", Helvetica;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.5; /* Adjust line height for better spacing */
}

.product-description {
  font-size: 14px;
  color: #777;
  margin: 0;
  line-height: 1.4; /* Adjust line height for better spacing */
}

</style>
