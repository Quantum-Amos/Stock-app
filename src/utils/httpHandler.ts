import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

axiosInstance.interceptors.response.use(function(response) {
    return response;
}, function(error) {
    // if(error.response === undefined){
    //     return Promise.reject(error)
    // }
    // // log user out if they are unauthorized
    if(error.response.status === 403){
        sessionStorage.clear()
        localStorage.clear()
        window.location.href = "/";
    }

    return Promise.reject(error)
})

const errorHandler = (error: any) => {
    if (error.response) {
        return Promise.reject(error.response.data.message);
    }
    return Promise.reject(error.message);
}

const configAuthHeader = () => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem(import.meta.env.VITE_SESSION_KEY)}`;
}
const configureContentHeader = () => {
    axiosInstance.defaults.headers.post['Content-Type'] = 'multipart/form-data'
}

// get request handler
export const getRequestHandler = async (url: string, useToken: boolean = false) => {
    if (useToken) configAuthHeader();
    
    return await axiosInstance.get(url).then(res => res.data).catch(errorHandler);
}

// post request handler
export const postRequestHandler = async (url: string, data: any, useToken: boolean = false) => {
    if (useToken) configAuthHeader();
    
    return await axiosInstance.post(url, data).then(res => res.data).catch(errorHandler);
}

// put request handler
export const putRequestHandler = async (url: string, data: any, useToken: boolean = false) => {
    if (useToken) configAuthHeader();
    
    return await axiosInstance.put(url, data).then(res => res.data).catch(errorHandler);
}

// delete request handler
export const deleteRequestHandler = async (url: string, useToken: boolean = false) => {
    if (useToken) configAuthHeader();
    
    return await axiosInstance.delete(url).then(res => res.data).catch(errorHandler);
}

//upload file handler
export const uploadFileHandler = async (url: string, Data: FormData, useToken: boolean = false) => {
    
    if (useToken) configAuthHeader();
    configureContentHeader()
    
    return await axiosInstance.post(url, Data).then(res => res.data).catch(errorHandler);
}