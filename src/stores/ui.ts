import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import { useDisplay } from "vuetify";

export const useUiStore = defineStore("uiStore", () => {
    const loading = ref<boolean>(true)
    const showNav = ref<boolean>(false)
    const toggle = ref<boolean>(false)
    const {mdAndDown} = useDisplay()

     //Operations Notification
     const notification = ref<boolean>(false)
     const response = ref<any>()
     const error = ref<any>()
 
    watchEffect( (newValue)=>{
        showNav.value = !mdAndDown.value
        toggle.value = mdAndDown.value
    })

    return{
        loading,
        showNav,
        toggle,
        notification,
        response,
        error
    }
})