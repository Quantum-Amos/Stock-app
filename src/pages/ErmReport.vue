<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
      <v-sheet elevation="1" class="h-100" rounded="lg">
        <v-toolbar elevation="0" class="bg-toolbar">
          <v-toolbar-title class="">ERM REPORT FOR COLLECTION</v-toolbar-title>
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
  
            <Loader>
              <v-data-table
                :headers="headers"
                :items="appStore.ermReports"
                :search="search"
              >
            </v-data-table>
            </Loader>
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
import { formatDatetime } from "@/utils/date";
  
  const appStore = useAppStore()
  
  const search = ref("");
  const headers = ref<any>([
    {
      align: "start",
      key: "id",
      sortable: true,
      title: "SEQUENCE",
    },
    { key: "date", title: "DATE" },
    { key: "event_number", title: "EVENT NUMBER" },
    { key: "part_code", title: "PART CODE" },
    { key: "part_type", title: "PART TYPE"},
    { key: "part_description", title: "PART DESCRIPTION"},
    { key: "quantity", title: "QUANTITY COLLECTED"},
    { key: "erm_code", title: "ERM CODE"},
  ]);
  
  onMounted(async () => {
    await appStore.getERMReports()
    appStore?.ermReports?.forEach((item: any) => {
      item.date = formatDatetime(item.date)
    })
  });
  
  //
  </script>
  