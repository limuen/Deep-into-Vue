// 1.实现插件

let _Vue

class Store {
    constructor(options) {

        this._mutations = options.mutations
        this._actions = options.actions
        this._warppedGetters = options.getters

        // 定义computed选项
        const computed= {}
        this.getters = {}
        const store = this
        // {doubleCounter(state){}}
        Object.keys(this._warppedGetters).forEach(key => {
            // 获取用户定义的getter
            const fn = store._warppedGetters[key]
            // 转换为computed可以使用无参形式
            computed[key] = function() {
                return fn(store.state)
            }

            // 为getters定义只读属性
            Object.defineProperty(store.getters, key, {
                get: () => store._vm[key]
            })
        })




        // this.$options = options
        // 创建响应式的state
        // this.$store.state.xxxx
        this._vm = new _Vue({
            data: {
                // 不希望被Vue代理(data中的值，vue实例就可以直接访问，加上就不被代理)，就加上$
                $$state: options.state
            },
            computed
        })

        // 修改this指向
        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)

        // getters
        // this.getters = {}
        // // 实用计算属性缓存getter
        // let computed= {}
        // // 代理getter
        // Object.keys(options.getters).forEach((key)=> {
        //     computed[key] = function() {
        //         return options.getters[key](options.state)
        //     }

        //     Object.defineProperty(this.getters, key, {
        //         get: () => {
        //             return this._vm[key]
        //         }
        //     })
        // })
    }

    get state() {
        return this._vm._data.$$state
    }

    set state(v) {
        console.error('place use replaceState to reset state')
    }

    /**
     * 修改state
     * this.$store.commit('add', 1)
     */
    
    commit(type, payload) {
        // 获取type对应的mutations
        const entry = this._mutations[type]
        if(!entry) {
            console.error('unknown mataion')
            return
        }
        // 传入state作为参数，附加参数payload
        entry(this.state, payload)
    }

    /**
     * 修改state
     * this.$store.dispatch('add', 1)
     */
    dispatch(type, payload) {
        // 获取type对应的actions
        const entry = this._actions[type]
        if(!entry) {
            console.error('unknown actions')
            return
        }

        // 传入当前Store作为参数，附加参数payload
        return entry(this, payload)
    }


}

function install(Vue) {
    _Vue = Vue

    // 全局混入
    Vue.mixin({
        beforeCreate() {
            if(this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        },
    })
}

// 导出的对象就是Vuex
export default {
    Store,
    install
}