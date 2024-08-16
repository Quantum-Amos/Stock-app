<script setup lang="ts">
import { useFormStore } from "@/stores/form";
import { useUserStore } from "@/stores/user";
import { postRequestHandler } from "@/utils/httpHandler";

const emailLogin = ref<boolean>(true); //used to toggle the Email login and OTP login card
const otp = ref<string>(""); //OTP v-model
const email = ref<string>("");
const otpEmail = ref<string>(""); //Email for OTP Login
const password = ref<string>("");
const step = ref<number>(1); //Used for the v-window slide
const show = ref<boolean>(false); // Show password
const loading = ref<boolean>(false); //toggles loading state for login with email button
//touched
const loginForm = ref<boolean>(true);


const formStore = useFormStore();
const userStore = useUserStore();
const router = useRouter();

const login = async () => {
  if (email.value == "engineer") {
    router.replace('/EngineerDashboard')
  }
  else{
    router.replace('/Dashboard')
  }
  // if(email.value && password.value){

  //     loading.value = true

  //     const data = ref({
  //         "email": email.value,
  //         "password": password.value
  //     })

  //     await postRequestHandler('auths/email/login', data.value)
  //     .then(res => {
  //         sessionStorage.setItem(import.meta.env.VITE_SESSION_KEY, res.token)
  //         sessionStorage.setItem('user', JSON.stringify(res.user))
  //         localStorage.setItem('user', res.user.name)
  //         userStore.user = res.user
  //         router.push('/dashboard')
  //     })
  //     .catch((error) => {
  //         formStore.error = error
  //         console.error(error)
  //     })
  //     .finally(() => {
  //         loading.value = false
  //     })
  // }
};


</script>

<template>
  <v-container>
    <v-card
      width="400"
      class="bg-white mx-auto text-center pa-8"
      v-if="emailLogin"
    >
      <v-card-title class="text-h5">Welcome!</v-card-title>
      <p class="text-error">{{ formStore.error }}</p>
      <v-form v-model="loginForm" @submit.prevent="login">
        <v-card-text class="mt-9">
          <v-text-field
            label="Email"
            variant="outlined"
            density="comfortable"
            v-model="email"
            :rules="[formStore.rules.required

            ]"
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
        <v-card-actions class="flex-column">
          <v-btn class="bg-secondary" block :loading="loading" type="submit">
            Login
          </v-btn>
        </v-card-actions>
      </v-form>
      <p class="mt-4 cursor-pointer" @click="">Forgot Password?</p>
    </v-card>
<!-- 
    <v-card width="400" class="bg-white mx-auto text-center pa-8" v-else>
      <v-card-title class="text-h5">Login using OTP</v-card-title>
      <v-window v-model="step">
        <v-window-item :value="1">
          <p class="text-error">{{ formStore.error }}</p>
          <v-form v-model="emailForm" @submit.prevent="verifyEmail">
            <v-card-text class="mt-7 pa-2">
              <v-text-field
                label="Email"
                variant="outlined"
                density="comfortable"
                v-model="otpEmail"
                :rules="[formStore.rules.email]"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="bg-secondary"
                block
                type="submit"
                :loading="loading"
              >
                Next
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-window-item>

        <v-window-item :value="2">
          <p class="text-error">{{ formStore.error }}</p>
          <v-form v-model="otpForm" @submit.prevent="otpLogin">
            <v-card-text class="mt-3">
              <h4>Enter the OTP sent to your mail</h4>
              <v-otp-input v-model="otp" />
            </v-card-text>
            <v-card-actions class="flex-column">
              <v-btn
                class="bg-secondary"
                block
                :disabled="otp.length < 6"
                v-if="step > 1"
                type="submit"
                :loading="loading"
              >
                Verify
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-window-item>
      </v-window>
      <p class="OTP mt-3" @click="showOptions" v-if="step <= 1">
        Login with Email
      </p>
    </v-card> -->
  </v-container>
</template>

<style>
.OTP:hover {
  color: #e64261;
  cursor: pointer;
}
</style>
