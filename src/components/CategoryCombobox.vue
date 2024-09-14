<template>
    <div class="rc-bank-combobox">
        <p class="">{{ label }}</p>
        <v-combobox :items="items" item-title="name" item-value="name" :return-object="true"
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
    await getCategories()
})

const items = ref()

const getCategories = async () => {
    await getRequestHandler('/categories', true)
    .then((res)=>items.value = res)
}

</script>
