<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { useUiStore } from '@/stores/ui';
import { postRequestHandler } from '@/utils/httpHandler';

const formStore = useFormStore()
const status = ref<boolean>(false)
const uiStore = useUiStore()

const old_password = ref<string>('')
const new_password = ref<string>('')
const show = ref<boolean>(false)
const showCard = ref<boolean>(false)
const loading = ref<boolean>(false)
const form = ref<boolean>(false)

const closeDialog = () => {
    showCard.value = false
    old_password.value = ''
    new_password.value = ''
}

// const changePassword = async() => {
//     if(form.value){

//         loading.value = true

//         const data = ref({
//             "old_password": old_password.value,
//             "new_password": new_password.value
//         })

//         await postRequestHandler('auths/password/change', data.value, true)
//         .then(res => {
//             uiStore.alertText = 'Password reset successful'
//             uiStore.alertStatus = true
//             uiStore.alert = true
//         })
//         .catch((error) => {
//             formStore.error = error
//             uiStore.alertText = error
//             uiStore.alert = true
//         })
//         .finally(() => {
//             loading.value = false
//             showCard.value = false
//             closeDialog()
//         })
//     }
// }
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
                        <p class="mt-2 ml-6">Pinto Aaron</p>
                    </v-col>
                    <v-col>
                        <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-phone"/>
                            <p>Phone</p>
                        </div>
                        <p class="mt-2 ml-6">0559389586</p>
                    </v-col>
                    <v-col>
                        <div class="d-flex ga-1 align-center">
                            <v-icon icon="mdi-email"/>
                            <p>Email Address</p>
                        </div>
                        <p class="mt-2 ml-6">marcel@gmail.com</p>
                    </v-col>
                    <v-col>
                        <div class="ml-13">
                            <p>Status</p>
                            <v-switch
                            v-model="status"
                            inset
                            hide-details
                            density="compact"
                            color="secondary"
                            />
                        </div>
                    </v-col>
                </v-row>
                <v-divider class="mt-3"/>
                <div class="mt-5 pa-3">
                    <v-btn class="bg-secondary text-capitalize" @click="showCard = true">
                        Change Password
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        
        <v-card width="400" class="mx-auto mt-10 dialog" rounded elevation="5" v-if="showCard">
            <v-form class="pa-2" v-model="form" @submit.prevent="changePassword">
                <v-card-text>
                    <v-text-field label="Old Password" variant="outlined" density="comfortable" class="mt-3" v-model="old_password" :rules="[formStore.rules.required]"
                    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'" :type="show ? 'text' : 'password'" @click:append-inner="show = !show"/>
                   
                    <v-text-field label="New Password" variant="outlined" density="comfortable" class="mt-3" v-model="new_password" :rules="[formStore.rules.required]"
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
        <Feedback/>
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
</style>