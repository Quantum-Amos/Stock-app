<script setup lang="ts">
import { usePurchaseStore } from '@/stores/purchase';
import { useUiStore } from '@/stores/ui';

const search = ref<string>('')
const headers = ref<any>([
    {
        align: "start",
        key: "id",
        sortable: false,
        title: "ID",
    },
    { key: "name", title: "Name" },
    { key: "actions", title: "Actions" },
])

const purchaseStore = usePurchaseStore()
const uiStore = useUiStore()
const orderType = ref<boolean>(false)
const editDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);

const editData = ref<any>();
const deleteData = ref<any>();


const editOrderType = (data: any) => {
  editData.value = data;
  editDialog.value = true;
};

const deleteOrderType = (data: any) => {
  deleteData.value = data;
  deleteDialog.value = true;
};

onMounted(async () => {
    await purchaseStore.getOrderType()
})
</script>

<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
        <v-sheet elevation="1" class="h-100" rounded="lg">
            <v-toolbar elevation="0" class="bg-toolbar">
                <v-toolbar-title class="">Order Types</v-toolbar-title>
                <v-btn class="bg-secondary mr-5" @click="orderType = true">Add Order Type</v-btn>
            </v-toolbar>
            <v-sheet elevation="0" rounded="0" class="">
                <v-card flat>
                    <template v-slot:text>
                        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify"
                            variant="outlined" hide-details single-line></v-text-field>
                    </template>

                    <Loader>
                        <v-data-table :headers="headers" height="100%" fixed-header :items="purchaseStore?.orderTypes"
                            :search="search">
                            <template v-slot:item="{ item }: any">
                                <tr>
                                    <td>{{ item?.id }}</td>
                                    <td class="text-capitalize">{{ item?.name }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <v-btn @click="editOrderType(item)" color="remBlue" variant="text" icon="mdi-pen"
                                                hide-details="auto"></v-btn>
                                            <v-btn hide-details="auto" @click="deleteOrderType(item)" color="red" variant="text"
                                                icon="mdi-delete"></v-btn>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                        </v-data-table>
                    </Loader>
                </v-card>
            </v-sheet>
        </v-sheet>
        <OrderTypeAddDialog v-if="orderType" v-model:add-order-type="orderType" />
        <OrderTypeEditDialog v-if="editDialog" v-model:edit-dialog-value="editDialog" v-bind:-edit-data="editData" />
        <OrderTypeDeleteDialog v-if="deleteDialog" v-model:dialog-value="deleteDialog"
            v-bind:delete-data="deleteData" />
        <Notification v-if="uiStore.notification" />

    </v-responsive>
</template>

<route lang="json">{
    "meta": {
        "title": "Order Types",
        "layout": "DashboardLayout",
        "auth": true
    }
}</route>