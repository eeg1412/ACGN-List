
let methods = {
    setAdminToken: (state, action) => {
        const adminToken = sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken");
        state.adminToken = adminToken;
        return state;
    },
    removeAdminToken: (state, action) => {
        state.adminToken = '';
        sessionStorage.removeItem("adminToken");
        localStorage.removeItem("adminToken");
        return state;
    },
    setLoading: (state, action) => {
        state.loading = action.loading ? true : false;
        console.log(action);
        return state;
    }
}



export default methods