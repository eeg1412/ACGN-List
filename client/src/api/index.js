import { createAPI } from './create-api'
import auth from './module/auth'
import store from '../store/data'

const api = createAPI({ baseURL: '/api' })
let loadingCount = 0;

const showLoading = () => {
    if (loadingCount === 0) {
        startLoading();
    }
    loadingCount += 1;
};
const startLoading = () => {
    store.dispatch({ type: 'setLoading', loading: true });
};
const hideLoading = () => {
    if (loadingCount <= 0) {
        return;
    }
    loadingCount -= 1;
    if (loadingCount === 0) {
        endLoading();
    }
};
const endLoading = () => {
    store.dispatch({ type: 'setLoading', loading: false });
};

//请求拦截器
api.interceptors.request.use(config => {
    showLoading();
    console.log(store.getState());
    config.headers['token'] = store.getState().adminToken;
    return config
}, (error) => {
    hideLoading();
    return Promise.reject(error)
});

//响应拦截器
api.interceptors.response.use(
    response => {
        hideLoading();
        if (response.data.code === 403) {
            setTimeout(() => {
                sessionStorage.removeItem("adminToken");
                localStorage.removeItem("adminToken");
                store.dispatch({ type: 'setAdminToken' });
            }, 500);
        }
        return response;
    }, error => {
        hideLoading();
        return Promise.reject(error);
    }
);

export const authApi = auth(api)
