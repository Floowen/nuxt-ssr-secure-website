<!-- AddNewAddress.vue -->
<template>
    <v-container class="add-address-page py-12" fluid>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <h1 class="text-h4 font-weight-bold mb-6">Add New Address</h1>
          <v-form ref="form" v-model="isValid">
            <v-text-field
              v-model="newAddress.location"
              label="Location"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="newAddress.city"
              label="City"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="newAddress.state"
              label="State/Province"
              :rules="[rules.required]"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="newAddress.zipCode"
              label="ZIP Code"
              :rules="[rules.required, rules.numeric]"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="newAddress.coordinates"
              label="Coordinates (Lat, Long)"
              :rules="[rules.required]"
              outlined
              dense
              hint="Example: -7.461320016990432, 112.4476029594335"
            ></v-text-field>
            <div class="actions mt-4">
              <Button @click="submitAddress" :disabled="!isValid" color="success">Save Address</Button>
              <Button @click="cancel" class="ml-4" color="error">Cancel</Button>
            </div>
          </v-form>
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
        isValid: false,
        newAddress: {
          location: '',
          city: '',
          state: '',
          zipCode: '',
          coordinates: '',
        },
        rules: {
          required: (value) => !!value || 'This field is required.',
          numeric: (value) => /^\d+$/.test(value) || 'Must be numeric.',
        },
      };
    },
    methods: {
      submitAddress() {
        if (this.$refs.form.validate()) {
          // Handle saving the new address (e.g., send to server or update store)
          alert('Address saved successfully!');
          this.$router.push('/profile'); // Navigate back to the profile page
        }
      },
      cancel() {
        this.$router.push('/profile'); // Navigate back to the profile page
      },
    },
  };
  </script>
  
  <style scoped>
  .add-address-page {
    background-color: #ffffff;
    min-height: 100vh;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
  }
  </style>
  