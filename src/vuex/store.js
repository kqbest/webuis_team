import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import location from '../location/location';


// mutation是同步的,只要comit muation, 它就会立即改变state , 这有利于我们追踪 状态的改变。如果 mution 之后，五分钟才改变state, 那就真不知道state 到底是哪个state了。
// action 是异步的，还有的错误处理也都在这里操作。

let store=new Vuex.Store({
    state:{
    	macAddress:'',//mac地址
    	validateIP:'',//授权地址
    	validatePort:'',//授权端口
    },
    mutations:{

    },
    actions:{

    }
});

export default store