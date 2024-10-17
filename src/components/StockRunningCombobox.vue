<template>
    <div class="rc-bank-combobox">
        <p class="text-subtitle-2 mb-1">{{ label }}</p>
        <v-combobox :items="items" item-title="barcode" item-value="barcode" :return-object="true"
            @update:model-value="(val) => $emit('update:modelValue', val ?? null)"
            
            @update:menu="$emit('clearMapper')" variant="outlined" :rules="rules" :placeholder="placeholder"
            hide-details
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
    await getRequestHandler('/stock-running', true)
    .then((res)=> items.value = res)
    items.value = items.value.map((element: { remaining_quantity: any; barcode: any; }) => ({"remaining_quantity": element.remaining_quantity, ...element?.barcode}))
}

</script>
