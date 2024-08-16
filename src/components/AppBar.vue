<template>
  <v-app-bar
    flat
    class="px-5 bg-secondary"
  >
    <template v-slot:prepend>
      <v-btn
        v-if="uiStore.toggle"
        color="remBlue"
        icon="mdi-menu"
        size="small"
        rounded="lg"
        @click="uiStore.showNav = true"
      ></v-btn>
      <!-- <p class="text-h5 font-weight-bold">{{ title }}</p> -->
    </template>

    <template v-slot:append>
      <div v-if="username" class="d-flex align-center">
        <p class="text-white mr-2">Hello {{ username }}!</p>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              variant="outlined"
              class="border-white border-lg border-opacity-0 text-white"
              size="large"
              icon="mdi-account-outline"
              v-bind="props"
            ></v-btn>
          </template>

          <v-list>
            <!-- <v-list-item to="/change-password">Change Password</v-list-item> -->
            <v-list-item class="text-center">
              <v-btn
                rounded="md"
                color="secondary"
                append-icon="mdi-logout"
                variant="flat"
                @click="logout"
                class="bg-primary"
                >Logout &nbsp;</v-btn
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { useUiStore } from "@/stores/ui";
// import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
// const userStore = useUserStore();
const title = ref<any>()
const username = ref(localStorage.getItem('user'))

watchEffect(() => {
  title.value = route?.meta?.title
})

const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  router.replace("/");
};
</script>

<style scoped lang="css">
.navlist :hover {
  font-weight: bolder;
}
</style>
