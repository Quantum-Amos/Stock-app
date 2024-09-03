<template>
  <v-dialog
    transition="dialog-top-transition"
    persistent
    max-width="450px"
    scrollable
    v-model="dialog"
  >
    <v-card>
      <v-toolbar color="secondary" title="Add User"></v-toolbar>
      <p
        v-if="formStore.error"
        class="text-body-1 text-center py-5 text-red-darken-2 font-weight-medium"
      >
        {{ formStore.error }}
      </p>
      <p
        v-if="formStore.success"
        class="text-success text-body-1 text-center py-5 font-weight-medium"
      >
        {{ formStore.success }}
      </p>
      {{  Data.job_id }}
      <v-form v-model="form" @submit.prevent="createUser">
        <v-card-text>
          <s-t-input-field
            v-model:model-value="Data.engineer_id"
            field-type="string"
            placeholder="Eg. 12345"
            label="ID"
            :rules="[formStore.rules.required]"
          ></s-t-input-field>
          <s-t-input-field
            v-model:model-value="Data.name"
            field-type="string"
            placeholder="Eg. John Doe"
            label="Full Name"
            :rules="[formStore.rules.required]"
          ></s-t-input-field>
          <s-t-input-field
            v-model:model-value="Data.password"
            :fieldType="showPass ? 'text' : 'password'"
            placeholder="Eg. XXXXXX"
            label="Password"
            @toggle="showPass = !showPass"
            :icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[formStore.rules.required]"
          ></s-t-input-field>
          <p class="text-subtitle-2 mb-1">Role</p>
          <v-select
            class="mb-2"
            hide-details="auto"
            variant="outlined"
            density="comfortable"
            :items="roles"
            item-value="id"
            item-title="name"
            v-model="Data.role_id"
          ></v-select>
          <p class="text-subtitle-2 mb-1">Job Title</p>
          <v-combobox
            class="mb-2"
            hide-details="auto"
            variant="outlined"
            density="comfortable"
            :items="jobs"
            item-value="id"
            item-title="name"
            :return-object="false"
            v-model="Data.job_id"
          ></v-combobox>
          <DepartmentCombobox v-model:model-value="Data.department_id" />
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
import { useFormStore } from "@/stores/form";
import { useUserStore } from "@/stores/user";
import { getRequestHandler, postRequestHandler } from "@/utils/httpHandler";

const userStore = useUserStore();
const formStore = useFormStore();
const showPass = ref<boolean>(false);
const dialog = ref<boolean>(true);
const form = ref<boolean>(false);
const roles = ref<any>();
const jobs = ref<any>();
const departments = ref<any>();
const Data = ref<any>({
  engineer_id: "",
  name: "",
  password: "",
  job_id: null,
  department_id: null,
  role_id: null,
});

const emit = defineEmits(["update:dialogValue"]);

onMounted(async () => {
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

const createUser = async () => {
  formStore.loading = true;
  console.log("object created", Data.value);
  await postRequestHandler("/staff", Data.value, true)
    .then((res) => {
      formStore.success = res.message;
      closeDialog();
    })
    .catch((error) => {
      formStore.error = error;
    })
    .finally(async () => {
      formStore.loading = false;
      await userStore.getStaff();
    });
};

const closeDialog = () => {
  formStore.resetFormStore();
  emit("update:dialogValue", false);
  dialog.value = false;
};
</script>
