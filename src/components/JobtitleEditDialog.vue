<template>
    <v-dialog transition="dialog-top-transition" persistent max-width="450px" scrollable v-model="dialog">
        <v-card>
            <v-toolbar color="secondary" title="Edit Job Title"></v-toolbar>
            <v-card-text>
                <v-form v-model="form" @submit.prevent="editTitle">
          <v-container>
            <p
              class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium"
            >
              {{ formStore.error }}
            </p>
            <p
              class="text-body-1 text-center mb-3 text-success font-weight-medium"
            >
              {{ formStore.success }}
            </p>
            <v-text-field
              :readonly="true"
              variant="outlined"
              density="compact"
              v-model:model-value="Data.full_name"
              type="string"
              placeholder="eg. John Doe"
              label="Full Name"
              :rules="[formStore.rules.required]"
            ></v-text-field>
            <v-text-field
              :readonly="true"
              variant="outlined"
              density="compact"
              v-model:model-value="Data.email"
              type="string"
              placeholder="Eg. user@example.com"
              label="Email"
              :rules="[formStore.rules.required, formStore.rules.email]"
            ></v-text-field>
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
                  :disabled="form"
                  :loading="formStore.loading"
                  block
                  color="secondary"
                  class="text-white font-weight-medium"
                  size="large"
                  type="submit"
                  variant="elevated"
                >
                  Save
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { putRequestHandler } from '@/utils/httpHandler';
import { useUiStore } from '@/stores/ui';
import { useFormStore } from '@/stores/form';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const formStore = useFormStore()
const uiStore = useUiStore()
const dialog = ref<boolean>(true)
const form = ref<boolean>(false)
const Data = ref<any>({});
// const Data = ref<any>({
//   full_name: "",
//   email: "",
//   role: "",
// });
const props = defineProps<{ titleData: any }>()
const emit = defineEmits(['update:editDialogValue'])

onMounted(()=>{
  Data.value = props.titleData
})

const editTitle = async () => {
    uiStore.loading = true
    formStore.loading = true
    // Data.value.full_name = props.userData?.full_name
    // Data.value.email = props.userData?.email
    // Data.value.password = props.userData?.password
    // Data.value.role = props.userData?.roles[0].role

    await putRequestHandler(`/admin/company/${JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) || '')?.company_id}/customer/${props.titleData.id}/deactivate`, Data.value, true)
        .then((res) => {
            formStore.success = 'User ' + res.name + ' Updated Successfully'
            closeDialog()
        }).catch((e) => {
            formStore.error = e
        }).finally(async () => {
            formStore.loading = false
            uiStore.loading = false
            await userStore.getUsers()
        })
}

const deactivate = async () => {

    await putRequestHandler(`/rules/deactivate/${props.titleData.id}`, null, true)
        .then((res) => {
            formStore.success = 'Rule ' + res.name + ' deactivated Successfully'
            closeDialog()
        }).catch((e) => {
            formStore.error = e
        }).finally(async () => {
            formStore.loading = false
            uiStore.loading = false
            await userStore.getUsers()
        })
}


const closeDialog = () => {
    formStore.resetFormStore()
    emit('update:editDialogValue', false)
    dialog.value = false
}


</script>