<template>
  <div class="rc-bank-combobox">
    <p class="my-2" v-if="showLabel ?? true">Department</p>
    <v-combobox
      :items="appStore.departments"
      item-title="name"
      item-value="id"
      :return-object="false"
      variant="outlined"
      :rules="[formStore.rules.required]"
      placeholder="Accounts"
      @update:model-value="(val) => $emit('update:modelValue', val ?? null)"
      hide-details
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
  showLabel?: boolean | null | undefined
}>();

onMounted(async () => {
  await appStore.getDepartments();
});
</script>
