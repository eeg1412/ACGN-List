import axios from 'axios';
const host = 'http://localhost:8080' 
let fns = {
    async TmList(){
        let page = parseInt(Math.random()*1600);
        let httpUrl = `${host}/api/rtimu/?page=${page}`
        let res = await axios.get(httpUrl);
        return res.data
        //console.log(res.dat)
    }
}

export default fns;