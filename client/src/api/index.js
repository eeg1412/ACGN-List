import { createAPI } from './create-api'
import auth from './module/auth'
// import { createBrowserHistory as createHistory } from "history";

const api = createAPI({ baseURL: '/api' })

// setTimeout(() => {
//     const history = createHistory();
//     history.replace('/anime')
// }, 5000)

export const authApi = auth(api)
