<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
      <v-sheet elevation="1" class="h-100" rounded="lg">
        <v-toolbar elevation="0" class="bg-toolbar">
          <v-toolbar-title class="">Email Report Configuration</v-toolbar-title>
          <v-btn class="bg-secondary mr-5" @click="addEmailConfig()">Add Email</v-btn>
        </v-toolbar>
        <v-sheet elevation="0" rounded="0" class="">
          <Loader>
            <template #default>
              <v-table hover class="text-center w-100">
                <thead class="bg-table ma-5 text-secondary">
                  <tr>
                    <th class="text-center font-weight-bold">id</th>
                    <th class="text-center font-weight-bold">Email</th>
                    <th class="text-center font-weight-bold">Actions</th>
      
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stockIn in appStore.emails">
                    <td>{{ stockIn?.id }}</td>
                    <td>{{ stockIn?.email }}</td>
                    <td><v-btn
                      @click="editEmailConfig(stockIn)"
                      color="remBlue"
                      variant="text"
                      icon="mdi-pen"
                    ></v-btn
                    >
                    <v-btn
                      @click="deleteEmailConfig(stockIn)"
                      color="red"
                      variant="text"
                      icon="mdi-delete"
                    ></v-btn>  </td>
                  </tr>
                </tbody>
              </v-table>

              <div class="text-center my-5 w-100">
                <v-pagination
                  size="small"
                  active-color="remBlue"
                  :border="true"
                  rounded="circle"
                  :length="10"
                  :total-visible="5"
                ></v-pagination>
              </div>
            </template>
          </Loader>
        </v-sheet>
      </v-sheet>
      <ConfigEmailAddDialog
        v-if="addDialog"
        v-model:dialog-value="addDialog"
      />
      <ConfigEmailEditDialog
        v-if="editDialog"
        v-model:edit-dialog-value="editDialog"
        v-bind:stock-data="editData"
      />
      <ConfigEmailDeleteDialog
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
  
  const appStore = useAppStore()
  const addDialog = ref<boolean>(false);
  const editDialog = ref<boolean>(false);
  const deleteDialog = ref<boolean>(false);
  
  const editData = ref<any>();
  const deleteData = ref<any>();
  
  const addEmailConfig = () => {
    addDialog.value = true;
  };
  
  const editEmailConfig = (data: any) => {
    editData.value = data;
    editDialog.value = true;
  };
  
  const deleteEmailConfig = (data: any) => {
    deleteData.value = data;
    deleteDialog.value = true;
  };  
  
  onMounted(() => {
    appStore.getEmails()
  });
  
  //
  </script>
  