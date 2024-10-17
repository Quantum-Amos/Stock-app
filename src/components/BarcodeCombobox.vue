<template>
    <div class="rc-bank-combobox">
        <p class="text-subtitle-2 mb-1">{{ label }}</p>
        <v-combobox :items="items" item-title="barcode" item-value="barcode" :return-object="true"
            @update:model-value="(val) => $emit('update:modelValue', val ?? null)"
            density="comfortable"
            @update:menu="$emit('clearMapper')" variant="outlined" :rules="rules" :placeholder="placeholder"
            >
        </v-combobox>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getRequestHandler } from '@/utils/httpHandler';

defineProps<{
    label: string,
    placeholder: string | undefined,
    rules: any[],
    modelValue: string | null | number | any,
}>()

onMounted( async ()=>{
    await getBarcodes()
})

const items = ref()

const getBarcodes = async () => {
    await getRequestHandler('/barcodes', true)
    .then((res)=>items.value = res)
}

</script>
