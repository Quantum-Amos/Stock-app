<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { getRequestHandler } from '@/utils/httpHandler';

const formStore = useFormStore()
const uiStore = useUiStore()
const props = defineProps<{ staff: any }>()
const userStore = useUserStore()
const form = ref<boolean>(false)
const groupDialog = ref<boolean>(true)
const group_id = ref<any>()

const emit = defineEmits(['update:groupDialogValue'])

const closeDialog = () => {
    emit('update:groupDialogValue', false)
}

const addToGroup = async () => {

    formStore.loading = true

    if (group_id.value?.group == 'none') {
        await getRequestHandler(`/staff/${props.staff?.id}/revoke`)
            .then((res) => {
                closeDialog()
                uiStore.response = `${props.staff?.name} Successfully Revoked`
                uiStore.notification = true
            })
            .catch((error) => {
                formStore.error = error
            })
            .finally(async () => {
                formStore.loading = false
                await userStore.getStaff()
            })
    } else{
        await getRequestHandler(`/staff/${props.staff?.id}/assign/${group_id.value?.id}`)
            .then((res) => {
                closeDialog()
                uiStore.response = `${props.staff?.name} Successfully Added To Group`
                uiStore.notification = true
            })
            .catch((error) => {
                formStore.error = error
            })
            .finally(async () => {
                formStore.loading = false
                await userStore.getStaff()
            })
    }
}
</script>

<template>
    <v-dialog transition="dialog-top-transition" persistent max-width="450px" scrollable v-model="groupDialog">
        <v-card>
            <v-toolbar color="secondary" title="Add To Group"></v-toolbar>
            <p class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium">
                {{ formStore.error }}
            </p>
            <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
                {{ formStore.success }}
            </p>
            <v-form v-model="form" @submit.prevent="addToGroup">
                <v-card-text>
                    <p class="text-subtitle-2 mb-1"> Select Group</p>
                    <v-combobox variant="outlined" density="comfortable" placeholder="Eg. Managers"
                        :items="userStore?.groups" item-title="group" item-value="id" v-model="group_id" />
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <div class="d-flex ga-4 pr-3 pb-3">
                        <v-btn variant="outlined" color="secondary" @click="closeDialog">
                            Cancel
                        </v-btn>
                        <v-btn class="bg-secondary" variant="flat" type="submit" :loading="formStore.loading"
                            :disabled="!form">
                            Save
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>