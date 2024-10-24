<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="1" class="h-100" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class="">STOCK ADJUSTMENT - SCAN</v-toolbar-title>
        <v-btn class="bg-secondary mr-5" @click="addStock()">Add Stock Adjustment</v-btn>
      </v-toolbar>
      <v-sheet elevation="0" rounded="0" class="">
        <Loader>
          <v-data-table
          :headers="headers"
          height="100%"
          fixed-header
          :items="appStore.stockAdjustmentScan"
          :search="search"
          item-value="name"
        >
        <template v-slot:item="{ item }: any">
              <tr>
                <td>{{ item?.barcode?.barcode }}</td>
                <td>{{ item?.barcode?.code }}</td>
                <td>{{ item?.barcode?.specification }}</td>
                <td>{{ item?.barcode?.location }}</td>
                <td>{{ item?.quantity }}</td>
                <td>{{ item?.department_id }}</td>
                <td>{{ formatDatetime(item?.created_at) }}</td>
                <td> 
                <!-- <v-btn
                  @click="deleteStock(item)"
                  color="red"
                  variant="text"
                  icon="mdi-delete"
                ></v-btn>   -->
              </td>
              </tr>
            </template>
          </v-data-table>
        </Loader>
      </v-sheet>
    </v-sheet>
    <StockadjustmentAddDialog
      v-if="addDialog"
      v-model:dialog-value="addDialog"
    />
    <StockadjustmentEditDialog
      v-if="editDialog"
      v-model:edit-dialog-value="editDialog"
      v-bind:stock-data="editData"
    />
    <StockadjustmentDeleteDialog
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
    "auth" : true
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
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);

const editData = ref<any>();
const deleteData = ref<any>();
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
  { key: "quantity", title: "QUANTITY" },
  { key: "department_id", title: "DEPARTMENT ID" },
  { key: "created_at", title: "CREATED AT" },
]);

const addStock = () => {
  addDialog.value = true;
};

onMounted(() => {
  appStore.getStockAdjustmentScan()
});

</script>
