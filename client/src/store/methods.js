
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
    }
}



export default methods