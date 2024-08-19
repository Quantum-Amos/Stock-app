<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
      <v-sheet elevation="1" class="h-100" rounded="lg">
        <v-toolbar elevation="0" class="bg-toolbar">
          <v-toolbar-title class="">Collection Report</v-toolbar-title>
        </v-toolbar>
        <v-sheet elevation="0" rounded="0" class="">
          <v-card flat>
            <template v-slot:text>
              <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </template>
  
            <v-data-table
              :headers="headers"
              :items="appStore.orders"
              :search="search"
            >
            <template v-slot:item.restrictions="{ item }">
            <v-chip
              :color="getColor(item.restrictions)"
              dark
            >
            {{ item.restrictions }}
          </v-chip>
    </template>
          </v-data-table>
          </v-card>
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
  import { useAppStore } from "@/stores/app";
  
  const appStore = useAppStore()
  const getColor = (status)=> {
    if (status === "part_available") {
      return 'green'
    }else {
      return 'red'
    }
  }
  
  const search = ref("");
  const headers = ref<any>([
    {
      align: "start",
      key: "id",
      sortable: true,
      title: "Order Number #",
    },
    { key: "created_at", title: "Order Date" },
    { key: "job_number", title: "Job Number" },
    { key: "staff.staff_id_number", title: "Engineer ID" },
    { key: "staff.name", title: "Engineer Name" },
    { key: "staff.job.name", title: "Job Title" },
    { key: "staff.department.name", title: "Department" },
    { 
      key: "barcode.barcode",
      title: "Part Number",
    },
    { 
      key: "part_name",
      title: "Part Name",
    },
    { key: "barcode.specification", title: "Description" },
    { key: "available_quantity", title: "Quantity Available" },
    { key: "quantity", title: "Order Quantity" },
    { key: "restrictions", title: "Restrictions" },
  ]);
  
  onMounted(async () => {
    await appStore.getOrders()
    appStore?.orders?.forEach((item) => {
      item.created_at = new Date(item.created_at).toLocaleDateString();
    })
  });
  
  //
  </script>
  