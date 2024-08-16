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
      <v-card-text>
        <v-form v-model="form">
          <v-container>
            <s-t-input-field
              v-model:model-value="Data.name"
              field-type="string"
              placeholder="Eg. Accounts"
              label="Name"
              :rules="[formStore.rules.required]"
            ></s-t-input-field>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-row justify="center" class="mb-4 mt-2">
          <v-col cols="12" md="6">
            <v-btn
              color="grey-lighten-2"
              class="mr-1"
              size="large"
              :loading="formStore.loading"
              :disabled="formStore.loading"
              block
              variant="flat"
              type="button"
              @click="closeDialog"
              >cancel</v-btn
            >
          </v-col>
          <v-col cols="12" md="6">
            <v-btn
              :loading="formStore.loading"
              :disabled="!form"
              block
              type="button"
              @click="createDepartment"
              color="secondary"
              class="text-white font-weight-medium"
              size="large"
              variant="elevated"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { postRequestHandler } from "@/utils/httpHandler";
import { useUiStore } from "@/stores/ui";
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore()
const formStore = useFormStore();
const uiStore = useUiStore();
const dialog = ref<boolean>(true);
const form = ref<boolean>(false);
const Data = ref<any>({
  name: "",
});

const emit = defineEmits(["update:dialogValue"]);

const createDepartment = async () => {
  formStore.loading = true;
  uiStore.loading = true;
  await postRequestHandler("/department", Data.value, true)
    .then((res) => {
      formStore.success = res.message
      closeDialog()
    })
    .catch((error) => (formStore.error = error))
    .finally(async () => {
      formStore.loading = false;
      uiStore.loading = false;
      appStore.getDepartments()
    });
};


const closeDialog = () => {
  formStore.resetFormStore();
  emit("update:dialogValue", false);
  dialog.value = false;
};
</script>
