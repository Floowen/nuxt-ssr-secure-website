<template>
    <v-container class="profile-page py-12" fluid>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="text-h4 font-weight-bold mb-6">My Profile</h1>
  
          <!-- Profile Information -->
          <v-row class="profile-info mb-8" no-gutters>
            <v-col cols="12" md="6" class="pr-md-4">
              <v-card class="pa-4" outlined>
                <h2 class="text-h6 font-weight-bold mb-4">Profile Details</h2>
                <div class="info-item">
                  <strong>Email:</strong>
                  <span class="text--secondary">{{ profile.email }}</span>
                </div>
                <div class="info-item">
                  <strong>First Name:</strong>
                  <span class="text--secondary">{{ profile.firstName }}</span>
                </div>
                <div class="info-item">
                  <strong>Last Name:</strong>
                  <span class="text--secondary">{{ profile.lastName }}</span>
                </div>
              </v-card>
            </v-col>
  
            <!-- Address Information -->
            <v-col cols="12" md="6" class="pl-md-4">
              <v-card class="pa-4" outlined>
                <h2 class="text-h6 font-weight-bold mb-4">Address</h2>
                <v-radio-group v-model="selectedAddressIndex">
                  <div
                    v-for="(address, index) in profile.addresses"
                    :key="index"
                    class="address-item mb-4"
                  >
                    <v-card class="pa-3" flat>
                      <p class="mb-2">{{ address.location }}</p>
                      <p class="text-body-2 text--secondary">{{ address.coordinates }}</p>
                      <v-row justify="space-between" align="center" class="mt-2">
                        <v-btn icon @click="removeAddress(index)">
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                        <v-radio :value="index" color="success" hide-details></v-radio>
                      </v-row>
                    </v-card>
                  </div>
                </v-radio-group>
                <Button class="mt-4" color="success" @click="addNewAddress">Add New Address</Button>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import Button from '@/components/Button.vue';
  
  export default {
    components: {
      Button,
    },
    data() {
      return {
        selectedAddressIndex: 0, // Default selected address index
        profile: {
          email: 'johndoe@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          addresses: [
            {
              location: 'Jl. Rambutan 79, Wates, Kota Mojokerto, Jawa Timur',
              coordinates: '-7.461320016990432, 112.4476029594335',
            },
            {
              location: 'Jl. Rambutan 79, Wates, Kota Mojokerto, Jawa Timur',
              coordinates: '-7.461320016990432, 112.4476029594335',
            },
          ],
        },
      };
    },
    methods: {
      removeAddress(index) {
        this.profile.addresses.splice(index, 1);
      },
      addNewAddress() {
        // Logic to add a new address
        alert('Add New Address Clicked');
      },
    },
  };
  </script>
  
  <style scoped>
  .profile-page {
    background-color: #f8f9fa;
    min-height: 100vh;
  }
  
  .profile-info {
    display: flex;
    flex-wrap: wrap;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .address-item {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 1rem;
  }
  
  .text--secondary {
    color: #6c757d;
  }
  
  .address-item:last-child {
    border: none;
  }
  
  .address-item .v-card {
    background-color: #fafafa;
  }
  
  .v-btn {
    margin: 0;
    padding: 0;
  }
  </style>
  