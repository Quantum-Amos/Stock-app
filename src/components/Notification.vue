<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore()
</script>

<template>
    <v-snackbar v-model="uiStore.notification" location="top center" :timeout="3000" :color="uiStore.response ? 'secondary' : 'error'">
        <div class="d-flex align-center ga-2">
            <v-icon :icon="uiStore.response ? 'mdi-check-circle' : 'mdi-close-circle'" />
            <p class="text-capitalize text-body-1 font-weight-medium"> {{ uiStore.response || uiStore.error }}</p>
        </div>
    </v-snackbar>
</template>