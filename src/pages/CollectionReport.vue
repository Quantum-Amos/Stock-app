<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
      <v-sheet elevation="1" class="h-100" rounded="lg">
        <v-toolbar elevation="0" class="bg-toolbar">
          <v-toolbar-title class="">COLLECTION REPORT</v-toolbar-title>
        </v-toolbar>
        <v-sheet elevation="0" rounded="0" class="">
          <v-card flat>
            <template v-slot:text>
              <v-row>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="search"
                    label="Search"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    hide-details
                    single-line
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <VueDatePicker
                    v-model="startDate"
                    placeholder="Start Date"
                    :ui="{ input: 'dp-custom-input' }"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VueDatePicker
                    v-model="endDate"
                    placeholder="Start Date"
                    :ui="{ input: 'dp-custom-input' }"
                  />
                </v-col>
                <v-col cols="12" md="1">
                  <v-btn @click="getCollectionReport" :loading="formStore.loading" size="large" color="secondary" class="mt-1">
                    Apply
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            
            <Loader>
              <template #default>
                <v-data-table
                  :headers="headers"
                  height="100%"
                  fixed-header
                  :items="appStore.orders"
                  :search="search"
                >
                <template v-slot:item.restrictions="{ item } : any">
                <v-chip
                  :color="getColor(item.restrictions)"
                  dark
                >
                {{ item.restrictions }}
              </v-chip>
        </template>
              </v-data-table>
              </template>
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
          "layout": "DashboardLayout",
    "auth" : true
    }
  }
  </route>
  <style  lang="css">
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

  .dp-custom-input {
      background-color: transparent;
      height: 57px;
  }
  </style>
  <script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import { useAppStore } from "@/stores/app";
  import { formatDatetime } from "@/utils/date";
  import VueDatePicker from "@vuepic/vue-datepicker";
  import '@vuepic/vue-datepicker/dist/main.css'
import { useFormStore } from "@/stores/form";
import { getRequestHandler } from "@/utils/httpHandler";
  
  const appStore = useAppStore()
  const formStore = useFormStore()
  const getColor = (status: any)=> {
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
      title: "ORDER NUMBER #",
    },
    { key: "created_at", title: "ORDER DATE" },
    { key: "job_number", title: "JOB NUMBER" },
    { key: "staff.staff_id_number", title: "ENGINEER ID" },
    { key: "staff.name", title: "ENGINEER NAME" },
    { key: "staff.job.name", title: "JOB TITLE" },
    { key: "staff.department.name", title: "DEPARTMENT" },
    { 
      key: "barcode.barcode",
      title: "PART NUMBER",
    },
    { 
      key: "part_name",
      title: "PART NAME",
    },
    { key: "barcode.specification", title: "DESCRIPTION" },
    { key: "available_quantity", title: "QUANTITY AVAILABLE" },
    { key: "quantity", title: "ORDER QUANTITY" },
    { key: "restrictions", title: "RESTRICTIONS" },
  ]);
  
  onMounted(async () => {
    await appStore.getOrders()
    appStore?.orders?.forEach((item: any) => {
      item.created_at = formatDatetime(item.created_at)
      item.id = `INV ${item.id}`
    })
  });
  
  const startDate = ref<any>()
  const endDate = ref<any>(Date.now())
  const formDate = ref<any>()

  const getCollectionReport = async() => {
    formStore.loading = true
    let params = ""
    if (startDate.value){
        params +=`?from_=${new Date(startDate.value).toISOString().slice(0, 10)}&`
    }
    if (endDate.value){
        if (startDate.value){
            params += `to_=${new Date(endDate.value).toISOString().slice(0, 10)}`
        }else {
            params += `?to_=${new Date(endDate.value).toISOString().slice(0, 10)}`
        }
    }
    formDate.value = endDate.value
    await getRequestHandler(`orders/${params}`, true)
    .then(res => {
        appStore.orders = res
    })
    .finally(async () => {
      formStore.loading = false;
    });
}
  //
  </script>
  