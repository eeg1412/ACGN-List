import { createAPI } from './create-api'
import auth from './module/auth'
import store from '../store/data'

const api = createAPI({ baseURL: '/api' })

//请求拦截器
api.interceptors.request.use(config => {
    console.log(store.getState());
    config.headers['token'] = store.getState().adminToken;
    return config
}, (error) => {
    return Promise.reject(error)
});

//响应拦截器
api.interceptors.response.use(
    response => {
        if (response.data.code == 403) {
            sessionStorage.removeItem("adminToken");
            localStorage.removeItem("adminToken");
            store.dispatch({ type: 'setAdminToken' });
        }
        return response;
    }, error => {

        return Promise.reject(error);
    }
);

export const authApi = auth(api)
