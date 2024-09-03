<template>
  <div class="rc-bank-combobox">
    <p class="">Deparment</p>
    <v-combobox
      :items="appStore.departments"
      item-title="name"
      item-value="id"
      :return-object="false"
      density="comfortable"
      variant="outlined"
      :rules="[formStore.rules.required]"
      placeholder="Accounts"
      @update:model-value="(val) => $emit('update:modelValue', val ?? null)"
    />
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useFormStore } from "@/stores/form";

const appStore = useAppStore();
const formStore = useFormStore();

defineProps<{
  modelValue: string | null | number | any;
}>();

onMounted(async () => {
  await appStore.getDepartments();
});
</script>
