<template>
    <v-dialog transition="dialog-top-transition" persistent max-width="450px" scrollable v-model="dialog">
        <v-card>
            <v-toolbar color="secondary" title="Edit Departnment"></v-toolbar>
            <v-form v-model="form" @submit.prevent="editDepartnment">
              <v-card-text>
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
                  density="comfortable"
                  :rules="[formStore.rules.required]"
                >
                </v-text-field>
                <v-card-actions class="d-flex justify-end">
                  <div class="d-flex ga-4 pr-3 pb-3">
                    <v-btn variant="outlined" color="secondary" @click="closeDialog">
                      Cancel
                    </v-btn>
                    <v-btn class="bg-secondary" variant="flat" type="submit" :loading="formStore.loading" :disabled="!form">
                      Save
                    </v-btn>
                  </div>
                </v-card-actions>
            </v-card-text>
        </v-form>
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