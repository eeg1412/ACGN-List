let state = {
    adminToken: sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken"),
    loading: false
}


export default state 