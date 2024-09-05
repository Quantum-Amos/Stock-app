<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
      <v-sheet elevation="1" class="h-100" rounded="lg">
        <v-toolbar elevation="0" class="bg-toolbar">
          <v-toolbar-title class="">EMAIL REPORT CONFIGURATION</v-toolbar-title>
          <v-btn class="bg-secondary mr-5" @click="addEmailConfig()">Add Email</v-btn>
        </v-toolbar>
        <v-sheet elevation="0" rounded="0" class="">
          <Loader>
            <v-data-table
              :headers="headers"
              height="530"
              fixed-header
              :items="appStore.emails"
              item-value="name"
            >
            <template v-slot:item="{ item }: any">
                  <tr>
                    <td>{{ item?.id }}</td>
                    <td>{{ item?.email }}</td>
                    <td><v-btn
                      @click="editEmailConfig(item)"
                      color="remBlue"
                      variant="text"
                      icon="mdi-pen"
                    ></v-btn
                    >
                    <v-btn
                      @click="deleteEmailConfig(item)"
                      color="red"
                      variant="text"
                      icon="mdi-delete"
                    ></v-btn>  </td>
                  </tr>
            </template>
          </v-data-table>
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

  const headers = ref<any>([
  {
    align: "start",
    key: "id",
    sortable: false,
    title: "ID",
  },
  { key: "email", title: "EMAIL" },
  { key: "id", title: "ACTIONS" },
]);

  
  onMounted(() => {
    appStore.getEmails()
  });
  
  //
  </script>
  