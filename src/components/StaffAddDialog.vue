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
          class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium"
        >
          {{ formStore.error }}
        </p>
        <p
          class="text-success text-body-1 text-center mb-3 font-weight-medium"
        >
          {{ formStore.success }}
        </p>
        <v-card-text>
              <v-form v-model="form">
                <v-container>
                  <s-t-input-field
                    v-model:model-value="Data.full_name"
                    field-type="string"
                    placeholder="Eg. John Doe"
                    label="Full Name"
                    :rules="[formStore.rules.required]"
                  ></s-t-input-field>
                  <s-t-input-field
                    v-model:model-value="Data.email"
                    field-type="string"
                    placeholder="Eg. user@example.com"
                    label="Email"
                    :rules="[formStore.rules.required, formStore.rules.email]"
                  ></s-t-input-field>
                  <s-t-input-field
                    v-model:model-value="Data.password"
                    :fieldType="showPass ? 'text' : 'password'"
                    placeholder="Eg. XXXXXX"
                    label="Password"
                    @toggle="showPass = !showPass"
                    :icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[formStore.rules.required, formStore.rules.password]"
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
                        block
                        type="button"
                        @click="createUser"
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
  import { ref, onMounted } from "vue";
  import { postRequestHandler } from "@/utils/httpHandler";
  import { useUiStore } from "@/stores/ui";
  import { useFormStore } from "@/stores/form";
  import { useUserStore } from "@/stores/user";
  import { getRequestHandler } from "@/utils/httpHandler";
  
  const userStore = useUserStore();
  const formStore = useFormStore();
  const uiStore = useUiStore();
  const showPass = ref<boolean>(false);
  const dialog = ref<boolean>(true);
  const form = ref<boolean>(false);
  const newUser = ref<any>([])
  const roles = ref<any>()
  const userRole = ref<Number>()
  const Data = ref<any>({
    full_name: "",
    email: "",
    password: "",
  });
  
  const emit = defineEmits(["update:dialogValue"]);
  
  onMounted(async ()=>{
    await getRequestHandler('/admin/roles')
    .then(res=>roles.value = res)
    .catch((error)=> console.log(error))
  })
  
  const createUser = async () => {
    formStore.loading = true;
    uiStore.loading = true;
    await postRequestHandler(
      `/admin/company/${
        JSON.parse(
          sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) || ""
        )?.company_id
      }/customer/add`,
      Data.value,
      true
    )
      .then((res) => {
        newUser.value = res
      })
      .catch((error) => (formStore.error = error))
      .finally(async () => {
        formStore.loading = false;
        uiStore.loading = false;
      });
  };
  
  const assignRole = async () => {
    formStore.loading = true;
    uiStore.loading = true;
    await postRequestHandler(
      `/admin/company/${
        JSON.parse(
          sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) || ""
        )?.company_id
      }/customer/${newUser.value.user.id}/roles/${userRole.value}`,
      null,
      true
    )
      .then((res) => {
        formStore.success = "Role Assigned Successfully"
        setTimeout(()=>{
          closeDialog()
        },1000)
      })
      .catch((error) => (formStore.error = error))
      .finally(async () => {
        formStore.loading = false;
        uiStore.loading = false;
        await userStore.getUsers();
      });
  };
  
  const closeDialog = () => {
    formStore.resetFormStore();
    emit("update:dialogValue", false);
    dialog.value = false;
  };
  </script>
  