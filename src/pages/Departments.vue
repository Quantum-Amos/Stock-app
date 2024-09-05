<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="1" class="h-100" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class="">DEPARTMENT</v-toolbar-title>
        <v-btn class="bg-secondary mr-5" @click="addDepartment()">Add Department</v-btn>
      </v-toolbar>
      <v-sheet elevation="0" rounded="0" class="mx-auto">
        <v-card flat>
        <template v-slot:text>
            <v-text-field
              v-model="search"
              label="Search Department"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </template>  
        <Loader>
          <v-data-table
          :headers="headers"
          height="530"
          fixed-header
          :items="appStore.departments"
          :search="search"
          item-value="name"
        >
          <template v-slot:item="{ item }: any">
                <tr>
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                  <v-btn
                    @click="editDepartment(item)"
                    color="remBlue"
                    variant="text"
                    icon="mdi-pen"
                    hide-details="auto"
                  ></v-btn
                  >
                  <v-btn
                    hide-details="auto"
                    @click="deleteDepartment(item)"
                    color="red"
                    variant="text"
                    icon="mdi-delete"
                  ></v-btn>              </td>
                </tr>
          </template>
        </v-data-table>
        </Loader>
        </v-card>
      </v-sheet>
    </v-sheet>
    <DepartmentAddDialog
      v-if="addDialog"
      v-model:dialog-value="addDialog"
    />
    <DepartmentEditDialog
      v-if="editDialog"
      v-model:edit-dialog-value="editDialog"
      v-bind:department-data="editData"
    />
    <DepartmentDeleteDialog
      v-if="deleteDialog"
      v-model:dialog-value="deleteDialog"
      v-bind:delete-data="deleteData"
    />
  </v-responsive>
</template>
<route lang="json">
{
  "meta": {
    "title": "Department",
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

const appStore = useAppStore()
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);

const search = ref("");
const headers = ref<any>([
  {
    align: "start",
    key: "id",
    sortable: false,
    title: "ID",
  },
  { key: "name", title: "NAME" },
  { key: "id", title: "ACTIONS" },
]);

const editData = ref<any>();
const deleteData = ref<any>();

const addDepartment = () => {
  addDialog.value = true;
};

const editDepartment = (data: any) => {
  editData.value = data;
  editDialog.value = true;
};

const deleteDepartment= (data: any) => {
  deleteData.value = data;
  deleteDialog.value = true;
};  

onMounted(async () => {
  await appStore.getDepartments()
});

//
</script>
