<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="1" class="h-100" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class="">Staff</v-toolbar-title>
        <v-btn class="bg-secondary mr-5" @click="addUser()">Add User</v-btn>
      </v-toolbar>
      <!-- <Transition name="slide-fade">
        <p class="text-h5 font-weight-bold pa-5" v-if="displayHeader">Running Stock</p>
      </Transition> -->
      <!-- <v-divider class="w-100"></v-divider> -->
      <v-sheet elevation="0" rounded="0" class="">
        <Loader>
          <template #default>
            <v-table hover class="text-center w-100">
              <thead class="bg-table ma-5 text-secondary">
                <tr>
                  <th class="text-center font-weight-bold">ID</th>
                  <th class="text-center font-weight-bold">Name</th>
                  <th class="text-center font-weight-bold">Job Title</th>
                  <th class="text-center font-weight-bold">Department</th>
                  <th class="text-center font-weight-bold">Role</th>
                  <th class="text-center font-weight-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in userStore.staff">
                  <td>{{ user?.staff_id_number }}</td>
                  <td>{{ user?.name }}</td>
                  <td>{{ user?.job.name }}</td>
                  <td>{{ user?.department.name }}</td>
                  <td>{{ user?.roles.name }}</td>
                  <td>
                  <v-btn
                    @click="editUser(user)"
                    color="remBlue"
                    variant="text"
                    icon="mdi-pen"
                  ></v-btn
                  >
                  <v-btn
                    @click="deleteUser(user)"
                    color="red"
                    variant="text"
                    icon="mdi-delete"
                  ></v-btn>              </td>
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
import { getRequestHandler } from "@/utils/httpHandler";
import { useUserStore } from "@/stores/user";


const userStore = useUserStore()
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);

const editData = ref<any>();
const deleteData = ref<any>();
const displayHeader = ref<boolean>(false);
const items = ref<any>([
  { src: "company" },
  { src: "tracker" },
  { src: "vehicle" },
  { src: "driver" },
]);

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

onMounted(async () => {
  await userStore.getStaff()
});

//
</script>
