<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
      <v-sheet elevation="1" class="h-100" rounded="lg">
        <v-toolbar elevation="0" class="bg-toolbar">
          <v-toolbar-title class="">Stock Out - Scan</v-toolbar-title>
        </v-toolbar>
        <!-- <Transition name="slide-fade">
        <p class="text-h5 font-weight-bold pa-5" v-if="displayHeader">Running Stock</p>
      </Transition> -->
        <!-- <v-divider class="w-100"></v-divider> -->
        <v-sheet elevation="0" rounded="0" class="">
          <v-table hover class="text-center">
            <thead class="bg-table ma-5 text-secondary">
              <tr>
                <th class="text-center font-weight-bold">Item</th>
                <th class="text-center font-weight-bold">Quantity</th>
                <th class="text-center font-weight-bold">Amount</th>
                <th class="text-center font-weight-bold">Barcode</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in 12">
                <td>{{ n }}</td>
                <td>{{ n }}</td>
                <td>{{ n }}</td>
                <td>{{ n }}</td>
              </tr>
            </tbody>
          </v-table>
          <div class="text-center my-5">
            <v-pagination
              size="small"
              active-color="remBlue"
              :border="true"
              rounded="circle"
              :length="10"
              :total-visible="5"
            ></v-pagination>
          </div>
        </v-sheet>
      </v-sheet>
    </v-responsive>
  </template>
  <route lang="json">
  {
    "meta": {
      "title": "Dashboard",
      "layout": "DashboardLayout"
    }
  }
  </route>
  <style scoped lang="css">
  .slide-fade-enter-active {
    transition: all 0.9s ease-out;
  }
  
  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }
  
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }
  </style>
  <script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import { getRequestHandler } from "@/utils/httpHandler";
  
  const dialog = ref<boolean>(false);
  const displayHeader = ref<boolean>(false);
  const items = ref<any>([
    { src: "company" },
    { src: "tracker" },
    { src: "vehicle" },
    { src: "driver" },
  ]);
  
  onMounted(() => {
    displayHeader.value = true;
  });
  
  //
  </script>
  