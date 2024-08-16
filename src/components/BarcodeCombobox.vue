<template>
    <div class="rc-bank-combobox">
        <p class="">{{ label }}</p>
        <v-combobox :items="items" item-title="name" item-value="id" :return-object="false"
            @update:model-value="(val) => $emit('update:modelValue', val?.toString() ?? null)"
            @update:menu="$emit('clearMapper')" variant="outlined" :rules="rules" :placeholder="placeholder">
        </v-combobox>
    </div>
</template>
<script lang="ts" setup>

defineProps<{
    label: string,
    placeholder: string | undefined,
    rules: any[],
    modelValue: number | null,
    items: any[],
}>()

</script>
