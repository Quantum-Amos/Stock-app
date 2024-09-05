<template>
  <v-navigation-drawer width="300" class="bg-primary text-white" v-model="uiStore.showNav" :permanent="!uiStore.toggle"
    :temporary="uiStore.toggle" style="height: 100vh; position: fixed; top: 0; left: 0; z-index: 9999">
    <template v-slot:prepend>
      <div class="py-4 px-5 d-flex align-center">
        <v-avatar size="x-large">
          <v-icon size="large" class="text-white">mdi-store-outline</v-icon>
        </v-avatar>
        <p class="text-h5 mt-2 ml-2 font-weight-bold">JSJ Inventory</p>
      </div>
    </template>

    <v-divider />
    <v-list class="pa-2 mt-2" active-class="font-weight-bold">
      <v-list-group value="Dashboard">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Dashboard" prepend-icon="mdi-chart-box-multiple"></v-list-item>
        </template>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-chart-bar" to="/stock-chart">Stock Chart</v-list-item>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-chart-areaspline" to="/matrix">Matrix</v-list-item>
      </v-list-group>
    
      <v-list-group value="Reporting">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Reporting" prepend-icon="mdi-chart-areaspline"></v-list-item>
        </template>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-book-open-variant" to="/collectionreport">Collection
          Report</v-list-item>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-bookshelf" to="/ermreport">ERM Report</v-list-item>
      </v-list-group>

      <v-list-group value="Costing">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Costing" prepend-icon="mdi-credit-card-chip"></v-list-item>
        </template>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-credit-card-settings" to="/costevaluation">Cost
          Evaluation</v-list-item>
      </v-list-group>


      <v-list-group value="Inventory">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Inventory" prepend-icon="mdi-store"></v-list-item>
        </template>
        <v-list-group value="Stock In">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Stock In" prepend-icon="mdi-tray-arrow-down"></v-list-item>
          </template>
          <v-list-item rounded="lg" class="mb-1 text-body-2" prepend-icon="mdi-tray-full"
            to="/stockin-registered">Registered</v-list-item>
          <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-barcode" to="/stockin-scan">Scan</v-list-item>
        </v-list-group>
        <v-list-group value="Stock Out">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Stock Out" prepend-icon="mdi-tray-arrow-up"></v-list-item>
          </template>
          <v-list-item rounded="lg" class="mb-1 text-body-2" prepend-icon="mdi-tray-full"
            to="/stockout-registered">Registered</v-list-item>
          <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-barcode" to="/stockout-scan">Scan</v-list-item>
        </v-list-group>
        <v-list-group value="Adjustments">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Adjustments" prepend-icon="mdi-transfer"></v-list-item>
          </template>
          <v-list-item rounded="lg" class="mb-1 text-body-2" prepend-icon="mdi-tray-full"
            to="/stockadjustment-registered">Registered</v-list-item>
          <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-barcode"
            to="/stockadjustment-scan">Scan</v-list-item>
        </v-list-group>
      <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-counter" to="/runningstock">Running Stock</v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <v-list>
        <v-list-group value="Configuration">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Configuration" prepend-icon="mdi-cog"></v-list-item>
        </template>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-book-education" to="/jobtitles">Job
          Titles</v-list-item>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-account-group"
          to="/departments">Departments</v-list-item>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-account-hard-hat" to="/staff">Staff</v-list-item>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-email" to="/emailreports">Email Reports</v-list-item>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-barcode" to="/scancode">Scan Code</v-list-item>
      </v-list-group>
        <v-list-item rounded="lg" class="mb-1" prepend-icon="mdi-account" to="/profile">Profile</v-list-item>
      </v-list>
      <v-divider class="text-white"></v-divider>
      <div class="py-3 text-white text-center">
        <v-btn @click="logout" prepend-icon="mdi-logout" variant="text">Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/ui";
import { useRouter } from "vue-router";


const uiStore = useUiStore();
const router = useRouter();
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  router.replace("/");
};
</script>
