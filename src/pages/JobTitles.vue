<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="1" class="h-100" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class="">Job Title</v-toolbar-title>
        <v-btn class="bg-secondary mr-5" @click="addTitle()"
          >Add Job Title</v-btn
        >
      </v-toolbar>
      <v-sheet elevation="0" rounded="0" class="">
      <v-card flat>
        <template v-slot:text>
            <v-text-field
              v-model="search"
              label="Search Job Title"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </template> 
        <v-data-table
          :headers="headers"
          :items="appStore.jobTitles"
          :search="search"
          item-value="name"
        >
          <template v-slot:item="{ item }: any">
                <tr>
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                        hide-details="auto"
                        @click="editTitle(item)"
                        color="remBlue"
                        variant="text"
                        icon="mdi-pen"
                      ></v-btn>
                      <v-btn
                        hide-details="auto"
                        @click="deleteTitle(item)"
                        color="red"
                        variant="text"
                        icon="mdi-delete"
                      ></v-btn>
                    </div>
                  </td>
                </tr>
          </template>
        </v-data-table>
        </v-card>
      </v-sheet>
    </v-sheet>
    <JobtitleAddDialog v-if="addDialog" v-model:dialog-value="addDialog" />
    <JobtitleEditDialog
      v-if="editDialog"
      v-model:edit-dialog-value="editDialog"
      v-bind:-title-data="editData"
    />
    <JobtitleDeleteDialog
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

const appStore = useAppStore();
const addDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);

const editData = ref<any>();
const deleteData = ref<any>();
const search = ref("");
const headers = ref<any>([
  {
    align: "start",
    key: "id",
    sortable: false,
    title: "ID",
  },
  { key: "name", title: "Title" },
  { key: "id", title: "Actions" },
]);


const addTitle = () => {
  addDialog.value = true;
};

const editTitle = (data: any) => {
  editData.value = data;
  editDialog.value = true;
};

const deleteTitle = (data: any) => {
  deleteData.value = data;
  deleteDialog.value = true;
};

onMounted(async () => {
  await appStore.getJobTitles()
});

//
</script>
