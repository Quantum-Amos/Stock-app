<template>
  <v-dialog
    transition="dialog-top-transition"
    persistent
    max-width="450px"
    scrollable
    v-model="dialog"
  >
    <v-card>
      <v-toolbar color="secondary" title="Edit User"></v-toolbar>
      <v-form v-model="form" @submit.prevent="editUser">
        <v-card-text>
          <p
            class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium"
          >
            {{ formStore.error }}
          </p>
          <p
            class="text-body-1 text-center mb-3 text-success font-weight-medium"
          >
            {{ formStore.success }}
          </p>
          <p class="text-subtitle-2 mb-1">ID</p>
          <v-text-field
            :readonly="true"
            v-model="userData.staff_id_number"
            variant="outlined"
            density="comfortable"
            :rules="[formStore.rules.required]"
          >
          </v-text-field>
          <p class="text-subtitle-2 mb-1">Full Name</p>
          <v-text-field
            v-model="Data.name"
            variant="outlined"
            density="comfortable"
            :rules="[formStore.rules.required]"
          >
          </v-text-field>
          <p class="text-subtitle-2 mb-1">Role</p>
          <v-select
            class="mb-2"
            hide-details="auto"
            variant="outlined"
            density="comfortable"
            :items="roles"
            item-value="id"
            item-title="name"
            v-model="Data.role"
            :rules="[formStore.rules.required]"
          ></v-select>
          <p class="text-subtitle-2 mb-1">Job Title</p>
          <v-select
            :readonly="true"
            class="mb-2"
            hide-details="auto"
            variant="outlined"
            density="comfortable"
            :items="jobs"
            item-value="id"
            item-title="name"
            v-model="userData.job.id"
            :rules="[formStore.rules.required]"
          ></v-select>
          <DepartmentCombobox v-model:model-value="userData.department_id" />
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <div class="d-flex ga-4 pr-3 pb-3">
            <v-btn variant="outlined" color="secondary" @click="closeDialog">
              Cancel
            </v-btn>
            <v-btn
              class="bg-secondary"
              variant="flat"
              type="submit"
              :loading="formStore.loading"
              :disabled="!form"
            >
              Save
            </v-btn>
          </div>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { putRequestHandler, getRequestHandler } from "@/utils/httpHandler";
import { useUiStore } from "@/stores/ui";
import { useFormStore } from "@/stores/form";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const formStore = useFormStore();
const uiStore = useUiStore();
const dialog = ref<boolean>(true);
const form = ref<boolean>(false);
const roles = ref<any>();
const jobs = ref<any>();
const departments = ref<any>();
// const Data = ref<any>({});
const Data = ref<any>({
  ID: "",
  name: "",
  role: null,
  job_title: null,
  department: null,
});
const props = defineProps<{ userData: any }>();
const emit = defineEmits(["update:editDialogValue"]);

onMounted(async () => {
  Data.value.ID = props.userData.staff_id_number;
  Data.value.name = props.userData.name;
  Data.value.role = props.userData.roles.id;
  Data.value.department = props.userData.department.id;
  Data.value.job_title = props.userData.job.id;
  await getRequestHandler("/staff/roles")
    .then((res) => (roles.value = res))
    .catch((error) => console.log(error));

  await getRequestHandler("/department")
    .then((res) => (departments.value = res))
    .catch((error) => console.log(error));

  await getRequestHandler("/job-title")
    .then((res) => (jobs.value = res))
    .catch((error) => console.log(error));
});

const editUser = async () => {
  uiStore.loading = true;
  formStore.loading = true;
  const data = {
    name: Data.value.name,
    role_id: Data.value.role,
  };
  await putRequestHandler(`staff/${props?.userData.id}`, data, true)
    .then((res) => {
      formStore.success = "User " + res?.name + " Updated Successfully";
      closeDialog();
    })
    .catch((e) => {
      formStore.error = e;
    })
    .finally(async () => {
      formStore.loading = false;
      uiStore.loading = false;
      await userStore.getStaff();
    });
};

const closeDialog = () => {
  formStore.resetFormStore();
  emit("update:editDialogValue", false);
  dialog.value = false;
};
</script>
