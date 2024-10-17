<template>
    <div class="rc-input-field">
        <p class="text-subtitle-2 mb-1">{{ label }}</p>
        <v-text-field 
            density="comfortable" 
            @update:model-value="(val:any) => $emit('update:modelValue', val?.toString())"
            :placeholder="placeholder" 
            :rules="rules" variant="outlined"
            :type="fieldType"
            :disabled="disabled"
            :readonly="readonly"
            :hint="hint"
            :append-inner-icon="icon"
            @click:append-inner="$emit('toggle')"
        >
        </v-text-field>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    label: string,
    placeholder?: string | undefined,
    rules?: any[],
    fieldType: string,
    modelValue: string | number | undefined | null,
    disabled?: boolean
    readonly?: boolean
    hint? : string
    icon? : any
}>()

</script>