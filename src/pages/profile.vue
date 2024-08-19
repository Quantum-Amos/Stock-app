<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import ChangePassword from '@/components/ChangePassword.vue';

const store = useAppStore()
const addDialog = ref<boolean>(false);


const changePasswordButton = () => {
  addDialog.value = true;
};


</script>

<template>
    <v-responsive width="1200" class="mx-auto bg-white pa-10 mt-10">
        <v-row>
            <v-col md="2">
                <v-img src="../assets/profile.png" alt="avatar" width="200" class="rounded-xl"/>
            </v-col>
            <v-col md="10">
                <v-row>
                    <v-col>
                        <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-account"/>
                            <p>Full Name</p>
                        </div>
                        <p class="mt-2 ml-6">{{ store.userData?.name }}</p>
                    </v-col>
                    <v-col>
                        <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-account"/>
                            <p>Staff ID</p>
                        </div>
                        <p class="mt-2 ml-6">{{ store.userData?.staff_id_number }}</p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-account"/>
                            <p>Job Title</p>
                        </div>
                        <p class="mt-2 ml-6">{{  store.userData?.job?.name }}</p>
                    </v-col>
                    <v-col>
                        <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-account"/>
                            <p>Deparment</p>
                        </div>
                        <p class="mt-2 ml-6">{{  store.userData?.department?.name }}</p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-account"/>
                            <p>Roles</p>
                        </div>
                        <p class="mt-2 ml-6">{{  store.userData?.roles?.name }}</p>
                    </v-col>
                </v-row>
                <v-divider class="mt-3"/>
                <div class="mt-5 pa-3">
                    <v-btn class="bg-secondary text-capitalize" @click="changePasswordButton">
                        Change Password
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <ChangePassword
            v-if="addDialog"
            v-model:dialog-value="addDialog"
        />
    </v-responsive>
</template>

<route lang="json">
{
    "meta": {
        "title": "Profile",
        "layout": "DashboardLayout"
    }
}
</route>

<style>
@media (max-width: 450px) {
    .dialog{
        width: 100% !important;
    }
}
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