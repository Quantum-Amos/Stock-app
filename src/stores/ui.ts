import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import { useDisplay } from "vuetify";

export const useUiStore = defineStore("uiStore", () => {
    const loading = ref<boolean>(false)
    const showNav = ref<boolean>(false)
    const toggle = ref<boolean>(false)
    const {mdAndDown} = useDisplay()


    watchEffect( (newValue)=>{
        showNav.value = !mdAndDown.value
        toggle.value = mdAndDown.value
    })

    const companyAddDialog = ref <boolean>(false) //toggle add new company dialog box
    const userAddDialog = ref <boolean>(false) //toggle add new user dialog box
    const trackerAddDialog = ref <boolean>(false) //toggle add new tracker dialog box
    const vehicleAddDialog = ref <boolean>(false) //toggle add new vehicle dialog box
    const driverAddDialog = ref <boolean>(false) //toggle add new driver dialog box
    const roleAddDialog = ref <boolean>(false) //toggle add new role dialog box
    const vehicleTypeDialog = ref <boolean>(false) //toggle add new vehicle type dialog box
    const appModuleDialog = ref <boolean>(false) //toggle add new app module dialog box


    const editCompanyDialog = ref <boolean>(false) //toggle edit company dialog box
    const editUserDialog = ref <boolean>(false) //toggle edit user dialog box
    const editTrackerDialog = ref <boolean>(false) //toggle edit tracker dialog box
    const editVehicleDialog = ref <boolean>(false) //toggle edit vehicle dialog box
    const editDriverDialog = ref <boolean>(false) //toggle edit driver dialog box
    const editRoleDialog = ref <boolean>(false) //toggle edit role dialog box
    const editVehicleTypeDialog = ref <boolean>(false) //toggle edit vehicle type dialog box
    const editAppModuleDialog = ref <boolean>(false) //toggle edit app module dialog box

    const deletePrompt = ref<boolean>(false)
    const alert = ref<boolean>(false)
    const alertText = ref<string>('')
    const alertStatus = ref<boolean>(false)
    
    const trial = ref<any>()




    return{
        loading,
        showNav,
        toggle,
        companyAddDialog,
        userAddDialog,
        trackerAddDialog,
        vehicleAddDialog,
        driverAddDialog,
        roleAddDialog,
        vehicleTypeDialog,
        appModuleDialog,
        editCompanyDialog,
        editUserDialog,
        editTrackerDialog,
        editVehicleDialog,
        editDriverDialog,
        editRoleDialog,
        editVehicleTypeDialog,
        editAppModuleDialog,
        deletePrompt,
        alert,
        alertText,
        alertStatus,
        trial
    }
})