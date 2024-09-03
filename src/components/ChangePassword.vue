<template>
    <v-dialog
      transition="dialog-top-transition"
      persistent
      max-width="450px"
      scrollable
      v-model="dialog"
    >
      <v-card>
        <v-toolbar color="secondary" title="Change Password"></v-toolbar>
        <p
          class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium"
        >
          {{ formStore.error }}
        </p>
        <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
          {{ formStore.success }}
        </p>
        <v-form class="pa-2" v-model="form" @submit.prevent="changePassword">
            <v-card-text>
                <v-text-field label="Old Password" variant="outlined" density="comfortable" class="mt-3" v-model="Data.old_password" :rules="[formStore.rules.required]"
                    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'" :type="show ? 'text' : 'password'" @click:append-inner="show = !show"/>
                   
                    <v-text-field label="New Password" variant="outlined" density="comfortable" class="mt-3" v-model="Data.new_password" :rules="[formStore.rules.required]"
                    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'" :type="show ? 'text' : 'password'" @click:append-inner="show = !show"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <div class="d-flex ga-4 pr-3 pb-3">
                        <v-btn variant="outlined" color="secondary" @click="closeDialog">
                            Cancel
                        </v-btn>
                        <v-btn class="bg-secondary" variant="flat" type="submit" :loading="loading">
                            Reset
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

  const formStore = useFormStore();
  const dialog = ref<boolean>(true);
  const form = ref<boolean>(false);
  const Data = ref<any>({
    old_password: "",
    new_password:"",
  });
  const show = ref<boolean>(false)
  const loading = ref<boolean>(false)
  
  const emit = defineEmits(["update:dialogValue"]);

  const changePassword = async() => {
    if(form.value){

        loading.value = true

        await postRequestHandler('/change-password', Data.value, true)
        .then(res => {
          formStore.success = 'Password reset successful'
            closeDialog()
        })
        .catch((error) => {
            formStore.error = error
        })
        .finally(() => {
            loading.value = false
        })
    }
}
  
  const closeDialog = () => {
    formStore.resetFormStore();
    emit("update:dialogValue", false);
    dialog.value = false;
  };
  </script>
  