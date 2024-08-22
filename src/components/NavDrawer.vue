<template>
  <v-navigation-drawer
    width="300"
    class="bg-primary text-white"
    v-model="uiStore.showNav"
    :permanent="!uiStore.toggle"
    :temporary="uiStore.toggle"
    style="height: 100vh; position: fixed; top: 0; left: 0; z-index: 9999"
  >
    <template v-slot:prepend>
      <div class="py-4 px-5 d-flex align-center">
        <v-avatar size="x-large">
          <v-icon size="large" class="">mdi-book</v-icon>
        </v-avatar>
        <p class="text-h5 mt-2 ml-2 font-weight-bold">SMS</p>
      </div>
    </template>

    <v-divider />
    <v-list class="pa-2 mt-2" active-class="font-weight-bold">
      <v-list-group value="Overview">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Overview"
            prepend-icon="mdi-domain"
          ></v-list-item>
        </template>
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-domain"
          to="/jobtitles"
          >Job Titles</v-list-item
        >
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-account-group"
          to="/departments"
          >Departments</v-list-item
        >
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-map-marker-radius"
          to="/staff"
          >Staff</v-list-item
        >
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-map-marker-radius"
          to="/emailreports"
          >Email Reports</v-list-item
        >
      </v-list-group>
      <v-list-item
        rounded="lg"
        class="mb-1"
        prepend-icon="mdi-domain"
        to="/collectionreport"
        >Collection Report</v-list-item
      >
      <v-list-item
        rounded="lg"
        class="mb-1"
        prepend-icon="mdi-domain"
        to="/runningstock"
        >Running Stock</v-list-item
      >
      <v-list-item
        rounded="lg"
        class="mb-1"
        prepend-icon="mdi-domain"
        to="/costevaluation"
        >Cost Evaluation</v-list-item
      >
      <v-list-item
        rounded="lg"
        class="mb-1"
        prepend-icon="mdi-domain"
        to="/ermreport"
        >ERM Report</v-list-item
      >
      <v-list-group value="Stock In">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Stock In"
            prepend-icon="mdi-domain"
          ></v-list-item>
        </template>
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-account-group"
          to="/stockin-registered"
          >Registered</v-list-item
        >
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-map-marker-radius"
          to="/stockin-scan"
          >Scan</v-list-item
        >
      </v-list-group>
      <v-list-group value="Stock Out">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Stock Out"
            prepend-icon="mdi-domain"
          ></v-list-item>
        </template>
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-account-group"
          to="/stockout-registered"
          >Registered</v-list-item
        >
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-map-marker-radius"
          to="/stockout-scan"
          >Scan</v-list-item
        >
      </v-list-group>
      <v-list-group value="Adjustments">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Adjustments"
            prepend-icon="mdi-domain"
          ></v-list-item>
        </template>
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-poll"
          to="/stockadjustment-registered"
          >Registered</v-list-item
        >
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-poll"
          to="/stockadjustment-scan"
          >Scan</v-list-item
        >
      </v-list-group>
      <v-list-group value="Reports">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Reports"
            prepend-icon="mdi-view-dashboard-outline"
          ></v-list-item>
        </template>
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-chart-bar"
          to="/stock-chart"
          >Stock Chart</v-list-item
        >
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-chart-areaspline"
          to="/extra"
          >Matrix</v-list-item
        >
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <v-list>
        <v-list-item
          rounded="lg"
          class="mb-1"
          prepend-icon="mdi-account"
          to="/profile"
          >Profile</v-list-item
        >
        <!-- <v-list-group value="Settings">
          <template v-slot:activator="{ props }">
            <v-list-item
            v-bind="props"
            prepend-icon="mdi-cog-outline"
            title="Settings"
            />
          </template>

          <v-list-item
            prepend-icon="mdi-security"
            title="User Roles"
            value="role"
            to="/role"
            />

            <v-list-item
            prepend-icon="mdi-unity"
            title="App Modules"
            value="module"
            to="/module"
            />

            <v-list-item
            prepend-icon="mdi-train-car"
            title="Vehicle Type"
            value="type"
            to="/vehicle-type"
            />
        </v-list-group> -->
      </v-list>
      <v-divider class="text-white"></v-divider>
      <div class="py-3 text-white text-center">
        <v-btn @click="logout" prepend-icon="mdi-logout" variant="text"
          >Logout</v-btn
        >
        <!-- <li @click="logout"><span class="mr-2"><v-icon icon="mdi-logout"></v-icon></span>Logout</li> -->
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/ui";
import { useRouter } from "vue-router";
// import { DefineProps } from "vue";

const uiStore = useUiStore();
const router = useRouter();
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  router.replace("/");
};
// const show = ref()

// const {mobile,lgAndDown} = useDisplay()
// show.value = !lgAndDown

// watch(()=>lgAndDown.value, (newValue)=>{
//     show.value = !newValue
// })
</script>
