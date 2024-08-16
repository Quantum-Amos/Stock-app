import { defineStore  } from "pinia";
import { ref } from "vue";
import { getRequestHandler } from "@/utils/httpHandler";

// interface UserModel {
//     id?: number;
//     full_name: string;
//     email: string;
//     company_id: number;
//     is_authorizer: boolean;
// }

export const useUserStore = defineStore("userStore", () => {
    const user = ref<any>(null);
    const allUsers = ref()
    

    const setSessionValues = async (res: any) => {
        sessionStorage.setItem(import.meta.env.VITE_SESSION_KEY, res.token)
        sessionStorage.setItem(import.meta.env.VITE_SESSION_USER, JSON.stringify(res.user))
    }

    const getUserData = async () => {
        let session_user = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) ?? "{}")
    
        await getRequestHandler(`/user/${session_user.id}`, true)
            .then(res => {
                user.value = res;
                sessionStorage.setItem(import.meta.env.VITE_SESSION_USER, JSON.stringify(res))
            }).catch((e) => {
                console.log(e)
            })

    }

    const getUsers = async () => {
        await getRequestHandler(`/admin/company/${JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) || '')?.company_id}/customers`, true)
          .then((res) => {
            allUsers.value = res
            allUsers.value = allUsers.value?.filter((item:any)=> item.id != JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) || '')?.id)
            })
          .catch((error) => console.log(error));
      };
    return { user, allUsers, setSessionValues, getUserData, getUsers };
})