<template>
    <v-dialog v-model="dialog" persistent width="auto">
        <v-card max-width="450px" class="mt-n15">
            <v-toolbar color="secondary" title="Delete User"></v-toolbar>
            <v-card-text>
                <div class="text-center my-3">
                    <p class="text-error">{{ formStore.error }}</p>
                    <h4 class="text-h6 py-5">Are you sure you want to delete user "{{deleteData.name}}"?</h4>

                    <v-row justify="center" class="mb-3 mt-2">
                            <v-col cols="12" md="6">
                            <v-btn color="secondary" class="mr-1" :loading="formStore.loading" :disabled="formStore.loading" block variant="outlined" type="button" @click="closeDialog">
                                cancel
                            </v-btn>

                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn @click="deleteUser" :loading="formStore.loading" block color="secondary"
                                class="font-weight-medium" type="submit"
                                variant="elevated">
                                Delete
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { deleteRequestHandler} from '@/utils/httpHandler';
import { useFormStore } from '@/stores/form';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const formStore = useFormStore()
const dialog = ref<boolean>(true)
const props = defineProps<{deleteData:any}>()
const emit = defineEmits(["update:dialogValue"])


const deleteUser = async () => {
    formStore.loading= true
    formStore.error = ""
        await deleteRequestHandler(`/staff/${props.deleteData.id}`, true)
        .then((res) => {
            formStore.success = "User Deleted Successfully"
            closeDialog()
        }).catch((e) => {
            formStore.error = e
        }).finally(async () => {
            formStore.loading = false
            await userStore.getStaff()
        })
    }


const closeDialog = () => {
    emit("update:dialogValue", false)
    dialog.value = false
}
</script>
