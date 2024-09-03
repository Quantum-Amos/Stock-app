import { defineStore  } from "pinia";
import { ref } from "vue";
import { getRequestHandler } from "@/utils/httpHandler";
import { useUiStore } from "./ui";


export const useUserStore = defineStore("userStore", () => {
    const user = ref<any>(null);
    const staff = ref()
    const uiStore = useUiStore()

    const setSessionValues = async (res: any) => {
        sessionStorage.setItem(import.meta.env.VITE_SESSION_KEY, res.token)
        sessionStorage.setItem(import.meta.env.VITE_SESSION_USER, JSON.stringify(res.user))
    }

    const getUserData = async () => {
        let session_user = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) ?? "{}")
        await getRequestHandler(`/staff/${session_user.id}`, true)
            .then(res => {
                user.value = res;
                sessionStorage.setItem(import.meta.env.VITE_SESSION_USER, JSON.stringify(res))
            }).catch((e) => {
                console.log(e)
            })

    }

    const getStaff = async () => {
        await getRequestHandler('/staff', true)
          .then((res) => {
            staff.value = res
            uiStore.loading = false
            })
          .catch((error) => console.log(error));
      };
    return { user, staff, setSessionValues, getUserData, getStaff };
})