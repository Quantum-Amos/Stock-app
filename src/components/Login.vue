<template>
  <v-container>
    <v-card width="400" class="bg-white mx-auto text-center pa-8">
      <v-card-title class="text-h5">Welcome!</v-card-title>
      <p class="text-error">{{ formStore.error }}</p>
      <v-form v-model="loginForm" @submit.prevent="login">
        <v-card-text class="mt-9">
          <v-text-field
            label="Staff ID"
            variant="outlined"
            density="comfortable"
            v-model="staff_id_number"
            :rules="[formStore.rules.required]"
          />
          <v-text-field
            label="Password"
            variant="outlined"
            density="comfortable"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
            class="mt-3"
            v-model="password"
            :rules="[formStore.rules.required]"
            @click:append-inner="show = !show"
          />
        </v-card-text>
        <v-card-actions class="flex-column mb-1">
          <v-btn
            class="bg-secondary"
            block
            :loading="formStore.loading"
            type="submit"
          >
            Login
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<style>
.OTP:hover {
  color: #e64261;
  cursor: pointer;
}
</style>
<script setup lang="ts">
import { useFormStore } from "@/stores/form";
import { useUserStore } from "@/stores/user";
import { postRequestHandler } from "@/utils/httpHandler";

const staff_id_number = ref<string>("");
const password = ref<string>("");
const show = ref<boolean>(false); // Show password
//touched
const loginForm = ref<boolean>(true);

const formStore = useFormStore();
const userStore = useUserStore();
const router = useRouter();

const login = async () => {
  formStore.loading = true;

  const data = ref({
    staff_id_number: staff_id_number.value,
    password: password.value,
  });

  await postRequestHandler("login", data.value)
    .then((res) => {
      sessionStorage.setItem(
        import.meta.env.VITE_SESSION_KEY,
        res.access_token
      );
      sessionStorage.setItem(
        import.meta.env.VITE_SESSION_USER,
        JSON.stringify(res.data)
      );
      localStorage.setItem("user", res.data.name);
      userStore.user = res.data;
      if (res?.data.roles.name == "engineer") {
        router.push("/engineerdashboard");
      } else {
        router.push("/stock-chart");
      }
    })
    .catch((error) => {
      formStore.error = error;
    })
    .finally(() => {
      formStore.loading = false;
    });
};
</script>
