<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="1" class="h-100" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class="">Stock In - Scan</v-toolbar-title>
        <v-btn class="bg-secondary mr-5" @click="addStock()">Add Stock</v-btn>
      </v-toolbar>
      <v-sheet elevation="0" rounded="0" class="">
        <v-table hover class="text-center">
          <thead class="bg-table ma-5 text-secondary">
            <tr>
              <th class="text-center font-weight-bold">BarCode</th>
              <th class="text-center font-weight-bold">Code</th>
              <th class="text-center font-weight-bold">Specification</th>
              <th class="text-center font-weight-bold">Location</th>
              <th class="text-center font-weight-bold">Quantity</th>
              <th class="text-center font-weight-bold">Cost</th>
              <th class="text-center font-weight-bold">Sold</th>
              <th class="text-center font-weight-bold">Created By</th>
              <!-- <th class="text-center font-weight-bold">Updated By</th> -->
              <th class="text-center font-weight-bold">Created At</th>
              <th class="text-center font-weight-bold">Actions</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="stockIn in appStore.stockInScan">
              <td>{{ stockIn?.barcode?.barcode }}</td>
              <td>{{ stockIn?.barcode?.code }}</td>
              <td>{{ stockIn?.barcode?.specification }}</td>
              <td>{{ stockIn?.barcode?.location }}</td>
              <td>{{ stockIn?.quantity }}</td>
              <td>{{ stockIn?.costs.cost }}</td>
              <td><v-icon :class="stockIn.sold ? 'bg-success' : 'text-secondary'" :icon="stockIn.sold ? 'mdi-check' : ''"></v-icon></td>
              <td>{{ stockIn?.creator?.staff_id_number }}</td>
              <!-- <td>{{ stockIn?.modifier?.staff_id_number }}</td> -->
              <td>{{  new Date(stockIn?.created_at).toLocaleDateString() }}</td>
              <td><v-btn
                @click="editStock(stockIn)"
                color="remBlue"
                variant="text"
                icon="mdi-pen"
              ></v-btn
              >
              <v-btn
                @click="deleteStock(stockIn)"
                color="red"
                variant="text"
                icon="mdi-delete"
              ></v-btn>  </td>
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
    <StockinAddDialog
      v-if="addDialog"
      v-model:dialog-value="addDialog"
    />
    <StockinEditDialog
      v-if="editDialog"
      v-model:edit-dialog-value="editDialog"
      v-bind:stock-data="editData"
    />
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
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);

const editData = ref<any>();
const deleteData = ref<any>();

const addStock = () => {
  addDialog.value = true;
};

const editStock = (data: any) => {
  editData.value = data;
  editDialog.value = true;
};

const deleteStock = (data: any) => {
  deleteData.value = data;
  deleteDialog.value = true;
};  

onMounted(() => {
  appStore.getStockInScan()
});

//
</script>
