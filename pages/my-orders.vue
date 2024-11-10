<template>
  <div class="order-page">
    <!-- Main Container with Sidebar and Content -->
    <div class="main-container">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Content Section -->
      <div class="content">
        <v-container class="order-container py-10">
          <h1 class="title">Order Detail</h1>
          
          <!-- Search Bar Section -->
          <div class="search-bar">
            <v-text-field
              v-model="search"
              label="Input ID Number of Food Order"
              outlined
              dense
            ></v-text-field>
            <v-btn color="success" class="ml-2" @click="applySearch">
              Apply
            </v-btn>
          </div>

          <!-- Order List Section -->
          <div class="order-list">
            <div
              v-for="(order, index) in filteredOrders"
              :key="index"
              class="order-card"
            >
              <div class="order-header">
                <div class="user-info">
                  <p class="user-name">{{ order.customerName }}</p>
                  <p class="order-id">{{ order.orderId }}</p>
                </div>
                <div class="order-status">
                  <p class="status-label">Food has arrived</p>
                  <v-select
                    :items="statusOptions"
                    v-model="order.status"
                    dense
                    outlined
                    class="status-dropdown"
                  ></v-select>
                </div>
              </div>

              <!-- Items within each Order -->
              <div
                v-for="(item, itemIndex) in order.items"
                :key="itemIndex"
                class="order-item"
              >
                <v-img
                  :src="item.image"
                  height="50"
                  width="20"
                  class="item-image"
                ></v-img>
                <div class="item-details">
                  <p class="item-title">{{ item.title }}</p>
                  <p class="item-count">Count: {{ item.count }}</p>
                </div>
                <p class="item-price">{{ item.price }}</p>
              </div>
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "OrderPage",
  components: {
    Sidebar,
  },
  data() {
    return {
      search: "",
      statusOptions: ["Order Status", "Pending", "Delivered", "Canceled"],
      orders: [
        {
          customerName: "Aloysius Juan",
          orderId: "56s8cfdshiuds9087x08asdxs",
          status: "Order Status",
          items: [
            {
              image: "/img/Products/nasi-goreng.png",
              title: "Nasi Goreng",
              count: 1,
              price: "Rp32.000",
            },
            {
              image: "/img/Products/nasi-goreng.png",
              title: "Nasi Goreng",
              count: 1,
              price: "Rp32.000",
            },
          ],
        },

        {
          customerName: "Aloysius Juan",
          orderId: "56s8cfdshiuds9087x08asdxs",
          status: "Order Status",
          items: [
            {
              image: "/path/to/nasi-goreng.png",
              title: "Nasi Goreng",
              count: 1,
              price: "Rp32.000",
            },
            {
              image: "/path/to/nasi-goreng.png",
              title: "Nasi Goreng",
              count: 1,
              price: "Rp32.000",
            },
          ],
        },
        // Add more orders as needed
      ],
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order =>
        order.orderId.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    applySearch() {
      // Logic for search
    },
  },
};
</script>

<style scoped>
.order-page {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.main-container {
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  padding: 24px;
  background-color: #f9f9f9;
  padding-bottom: 64px; /* Tambahkan padding di bawah */
}

.order-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.order-id {
  font-size: 14px;
  color: #777;
}

.order-status {
  display: flex;
  align-items: center;
}

.status-label {
  margin-right: 8px;
  color: #4caf50;
  font-size: 14px;
}

.status-dropdown {
  min-width: 150px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid #eee;
}

.item-image {
  object-fit: cover; /* Options: contain, cover, fill, etc. */
  max-width: 50px;   /* Adjust based on your design */
  height: 50px;
  border-radius: 4px; 
}


.item-details {
  flex: 1;
  margin-left: 16px;
}

.item-title {
  font-weight: 600;
  font-size: 14px;
}

.item-count {
  font-size: 12px;
  color: #888;
}

.item-price {
  font-size: 14px;
  color: #333;
}
</style>
