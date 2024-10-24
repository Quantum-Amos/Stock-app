<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="1" class="h-100" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class="">STAFF</v-toolbar-title>
        <v-btn class="bg-secondary mr-5" @click="addUser()">Add User</v-btn>
      </v-toolbar>
      <v-sheet elevation="0" rounded="0" class=""> 
        <v-card flat>
        <template v-slot:text>
            <v-text-field
              v-model="search"
              label="Search Staff"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </template>    
        <Loader>
          <v-data-table
          :headers="headers"
          height="100%"
          fixed-header
          :items="userStore.staff"
          :search="search"
          item-value="name"
        >
          <template v-slot:item="{ item }: any">
                <tr>
                  <td>{{ item?.staff_id_number }}</td>
                  <td>{{ item?.name }}</td>
                  <td>{{ item?.job?.name }}</td>
                  <td>{{ item?.department?.name }}</td>
                  <td>{{ item?.roles?.name }}</td>
                  <td>{{ item?.groups?.group }}</td>
                  <td>
                    <v-tooltip text="Add to Group" v-if="item?.roles?.name == 'stock_controller'">
                      <template v-slot:activator="{ props }">
                        <v-btn variant="text" color="remBlue" v-bind="props" icon="mdi-account-group" @click="staffData(item)"/>
                      </template>
                    </v-tooltip>

                  <v-btn
                    @click="editUser(item)"
                    color="remBlue"
                    variant="text"
                    icon="mdi-pen"
                  ></v-btn
                  >
                  <v-btn
                    @click="deleteUser(item)"
                    color="red"
                    variant="text"
                    icon="mdi-delete"
                  ></v-btn> 
                </td>
                </tr>
          </template>
        </v-data-table>
        </Loader>
      </v-card>
      </v-sheet>
    </v-sheet>
    <StaffAddDialog
      v-if="addDialog"
      v-model:dialog-value="addDialog"
    />
    <StaffEditDialog
      v-if="editDialog"
      v-model:edit-dialog-value="editDialog"
      v-bind:user-data="editData"
    />
    <StaffDeleteDialog
      v-if="deleteDialog"
      v-model:dialog-value="deleteDialog"
      v-bind:delete-data="deleteData"
    />
    <AddStaffGroup v-if="addGroup" v-model:group-dialog-value="addGroup" :staff="staff"/>
    <Notification v-if="uiStore.notification"/>
  </v-responsive>
</template>
<route lang="json">
{
  "meta": {
    "title": "Staff",
        "layout": "DashboardLayout",
    "auth" : true
  }
}
</route>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useUiStore } from "@/stores/ui";


const userStore = useUserStore()
const uiStore = useUiStore()
const addGroup = ref<boolean>(false)
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);
const staff = ref<any>()


const search = ref("");
const headers = ref<any>([
  {
    align: "start",
    key: "staff_id_number",
    sortable: false,
    title: "ID",
  },
  { key: "name", title: "NAME" },
  { key: "job.name", title: "JOB TITLE" },
  { key: "department.name", title: "DEPARTMENT" },
  { key: "roles.name", title: "ROLE" },
  { key: "group", title: "GROUP"},
  { key: "staff_id_number", title: "ACTIONS"},
]);


const editData = ref<any>();
const deleteData = ref<any>();

const addUser = () => {
  addDialog.value = true;
};

const editUser = (data: any) => {
  editData.value = data;
  editDialog.value = true;
};

const deleteUser = (data: any) => {
  deleteData.value = data;
  deleteDialog.value = true;
};  

const staffData = (data:any) => {
    if (!userStore?.groups?.some((value: any) => {return value.group == "none"})){
    userStore?.groups?.push({ "id": userStore?.groups?.length + 1, "group": "none" })
    }
  staff.value = data
  addGroup.value = true
}

onMounted(async () => {
  await userStore.getStaff()
  await userStore.getGroups()
});

</script>
