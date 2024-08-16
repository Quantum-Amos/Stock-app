<template>
    <v-dialog transition="dialog-top-transition" persistent max-width="450px" scrollable v-model="dialog">
        <v-card>
            <v-toolbar color="secondary" title="Edit Departnment"></v-toolbar>
            <v-card-text>
                <v-form v-model="form" @submit.prevent="editDepartnment">
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
            <p class="text-subtitle-2 mb-1">Name</p>
            <v-text-field
              v-model="Data.name"
              variant="outlined"
              density="compact"
            >
            </v-text-field>
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
                  :disabled="!form"
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
import { useAppStore } from '@/stores/app';

const appStore = useAppStore()
const formStore = useFormStore()
const uiStore = useUiStore()
const dialog = ref<boolean>(true)
const form = ref<boolean>(false)
const Data = ref<any>({
  name: "",
});
const props = defineProps<{ departmentData: any }>()
const emit = defineEmits(['update:editDialogValue'])

onMounted(()=>{
  Data.value.name = props.departmentData.name
})

const editDepartnment = async () => {
    uiStore.loading = true
    formStore.loading = true
    const data = {
      name : Data.value.name}
    await putRequestHandler(`department/${props.departmentData.id}`, data, true)
        .then((res) => {
            formStore.success = 'Department ' + res.name + ' Updated Successfully'
            closeDialog()
        }).catch((e) => {
            formStore.error = e
        }).finally(async () => {
            formStore.loading = false
            uiStore.loading = false
            await appStore.getDepartments()
        })
}

const closeDialog = () => {
    formStore.resetFormStore()
    emit('update:editDialogValue', false)
    dialog.value = false
}


</script>