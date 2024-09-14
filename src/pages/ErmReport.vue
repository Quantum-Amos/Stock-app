<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="1" class="h-100" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class="">ERM REPORT FOR COLLECTION</v-toolbar-title>
      </v-toolbar>
      <v-sheet elevation="0" rounded="0" class="">
        <v-card flat>
          <template v-slot:text>
            <v-row>
              <v-col cols="12" md="5">
                <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                  hide-details single-line></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <VueDatePicker v-model="startDate" placeholder="Start Date" :ui="{ input: 'dp-custom-input' }" />
              </v-col>
              <v-col cols="12" md="3">
                <VueDatePicker v-model="endDate" placeholder="Start Date" :ui="{ input: 'dp-custom-input' }" />
              </v-col>
              <v-col cols="12" md="1">
                <v-btn @click="getErmReport" :loading="formStore.loading" size="large" color="secondary" class="mt-1">
                  Apply
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <Loader>
            <v-data-table :headers="headers" height="100%" fixed-header :items="appStore.ermReports" :search="search">
            </v-data-table>
          </Loader>
        </v-card>
      </v-sheet>
    </v-sheet>
  </v-responsive>
</template>
<route lang="json">{
  "meta": {
    "title": "Dashboard",
    "layout": "DashboardLayout",
    "auth": true
  }
}</route>
<style lang="css">
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
  { key: "part_type", title: "PART TYPE" },
  { key: "part_description", title: "PART DESCRIPTION" },
  { key: "quantity", title: "QUANTITY COLLECTED" },
  { key: "erm_code", title: "ERM CODE" },
]);

onMounted(async () => {
  await appStore.getERMReports()
  appStore?.ermReports?.forEach((item: any) => {
    item.date = formatDatetime(item.date)
    item.id = `INV ${item.id}`
  })
});

const startDate = ref<any>()
const endDate = ref<any>(Date.now())
const formDate = ref<any>()

const getErmReport = async () => {
  formStore.loading = true
  let params = ""
  if (startDate.value) {
    params += `?from_=${new Date(startDate.value).toISOString().slice(0, 10)}&`
  }
  if (endDate.value) {
    if (startDate.value) {
      params += `to_=${new Date(endDate.value).toISOString().slice(0, 10)}`
    } else {
      params += `?to_=${new Date(endDate.value).toISOString().slice(0, 10)}`
    }
  }
  formDate.value = endDate.value
  await getRequestHandler(`erm/${params}`, true)
    .then(res => {
      appStore.ermReports = res
      appStore?.ermReports?.forEach((item: any) => {
        item.date = formatDatetime(item.date)
        item.id = `INV ${item.id}`
      })
    })
    .finally(async () => {
      formStore.loading = false;
    });
}
//
</script>