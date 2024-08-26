<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore()
</script>

<template>
    <v-skeleton-loader type="table" :loading="uiStore.loading">
        <slot>
            
        </slot>
    </v-skeleton-loader>
</template>