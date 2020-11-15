
let methods = {
    add:function(state,action){
        state.num++
        return state
    },
    addNum:function(state,action){
        
        state.num = state.num + action.num;
        return state
    },
    setTimu:function(state,action){
        state.timuList = action.content;
        return state;
    }
}



export default methods