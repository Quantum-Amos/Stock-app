<template>
  <v-dialog
    transition="dialog-top-transition"
    persistent
    max-width="450px"
    scrollable
    v-model="dialog"
  >
    <v-card>
      <v-toolbar color="secondary" title="Add Department"></v-toolbar>
      <p
        class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium"
      >
        {{ formStore.error }}
      </p>
      <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
        {{ formStore.success }}
      </p>
      <v-form v-model="form" @submit.prevent="createDepartment">
        <v-card-text>
          <s-t-input-field
            v-model:model-value="Data.name"
            field-type="string"
            placeholder="Eg. Accounts"
            label="Name"
            :rules="[formStore.rules.required]"
          ></s-t-input-field>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <div class="d-flex ga-4 pr-3 pb-3">
            <v-btn variant="outlined" color="secondary" @click="closeDialog">
              Cancel
            </v-btn>
            <v-btn  class="bg-secondary" variant="flat" type="submit" :loading="formStore.loading" :disabled="!form">
              Save
            </v-btn>
          </div>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { postRequestHandler } from "@/utils/httpHandler";
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore()
const formStore = useFormStore();
const dialog = ref<boolean>(true);
const form = ref<boolean>(false);
const Data = ref<any>({
  name: "",
});

const emit = defineEmits(["update:dialogValue"]);

const createDepartment = async () => {
  formStore.loading = true;
  await postRequestHandler("/department", Data.value, true)
    .then((res) => {
      formStore.success = res.message
      closeDialog()
    })
    .catch((error) => (formStore.error = error))
    .finally(async () => {
      formStore.loading = false;
      appStore.getDepartments()
    });
};


const closeDialog = () => {
  formStore.resetFormStore();
  emit("update:dialogValue", false);
  dialog.value = false;
};
</script>
