<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="1" class="h-100" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class="">STOCK IN - SCAN</v-toolbar-title>
        <v-btn class="bg-secondary mr-5" @click="addStock()">Add Stock</v-btn>
      </v-toolbar>
      <v-sheet elevation="0" rounded="0" class="">
        <Loader>
        <v-data-table
          :headers="headers"
          height="530"
          fixed-header
          :items="appStore.stockInScan"
          :search="search"
          item-value="name"
        >
          <template v-slot:item="{ item }: any">
            <tr>
              <td>{{ item?.barcode?.barcode }}</td>
              <td>{{ item?.barcode?.code }}</td>
              <td>{{ item?.barcode?.specification }}</td>
              <td>{{ item?.barcode?.location }}</td>
              <td>{{ item?.barcode?.erm_code }}</td>
              <td>{{ item?.quantity_initiated }}</td>
              <td>{{ item?.costs?.cost }}</td>
              <td><v-icon
                  :class="item?.sold ? 'bg-success' : 'text-secondary'"
                  :icon="item?.sold ? 'mdi-check' : ''"
                ></v-icon></td>
              <td>{{ item?.creator?.staff_id_number}}</td>
              <td>{{ formatDatetime(item?.created_at) }}</td>
              <td>
                <div class="d-flex">
                  <v-btn
                    hide-details="auto"
                    @click="deleteStock(item)"
                    color="red"
                    variant="text"
                    icon="mdi-delete"
                  ></v-btn>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </Loader>
      </v-sheet>
    </v-sheet>
    <StockinAddDialog v-if="addDialog" v-model:dialog-value="addDialog" />
    <StockinDeleteDialog
      v-if="deleteDialog"
      v-model:dialog-value="deleteDialog"
      v-bind:delete-data="deleteData"
    />
  </v-responsive>
</template>
<route lang="json">
{
  "meta": {
    "title": "Dashboard",
    "layout": "DashboardLayout",
    "auth": true
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

const appStore = useAppStore();

const search = ref("");
const headers = ref<any>([
  {
    align: "start",
    key: "barcode?.barcode",
    sortable: false,
    title: "BARCODE",
  },
  { key: "barcode?.code", title: "CODE" },
  { key: "barcode?.specification", title: "SPECIFICATION" },
  { key: "barcode.location", title: "LOCATION" },
  { key: "barcode.erm_code", title: "ERM CODE" },
  { key: "quantity", title: "QUANTITY" },
  { key: "costs.cost", title: "COST" },
  { key: "sold", title: "SOLD" },
  { key: "creator.staff_id_number", title: "CREATED BY" },
  { key: "created_at", title: "CREATED AT" },
  { align: "center", key: "barcode.barcode", title: "ACTIONS" },
]);

const addDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);

const deleteData = ref<any>();

const addStock = () => {
  addDialog.value = true;
};

const deleteStock = (data: any) => {
  deleteData.value = data;
  deleteDialog.value = true;
};

onMounted(async () => {
  await appStore.getStockInScan();
});

//
</script>
