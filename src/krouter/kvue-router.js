// 实现一个插件
// 1.返回一个函数
// 2.或者返回一个对象，他有一个install方法

let _Vue

class VueRouter {
    // 选项： options === 路由表
    constructor(options) {
        this.$options = options
        
        // 缓存path和route映射关系
        this.routeMap = {}

        this.$options.routes.forEach(route => {
            this.routeMap[route.path] = route
        })

        // 需要定义一个响应式的current属性
        const initial = window.location.hash.slice(1) || '/'
        // util.defineReactive
        // 可以给对象定一个响应式的数据
        _Vue.util.defineReactive(this, 'current', initial)


        // 监控url的变化
        window.addEventListener('hashchange', this.onHashChange.bind(this))
    }

    onHashChange() {
        // 只要 # 后面部分
        this.current = window.location.hash.slice(1)
        console.log(this.current)
    }
}

VueRouter.install = function(Vue) {
    // 引用Vue构造函数，在上面VueRouter中使用
    _Vue = Vue

    // 1.挂载$router
    Vue.mixin({
        beforeCreate() {
            // this指的是组件实例
            if(this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })


    // 2.定义两个全局组件router-link，router-view
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                require: true
            },
        },
        render(h) {
            //<router-link to="/about">
            // <a >xxx</a>
            return h('a', {
                attrs: {
                    href: '#' + this.to
                }
            }, this.$slots.default)
        }
    })
    Vue.component('router-view', {
        render(h) {
            // 挂载到原型直接访问this.$router 
            // 找到当前url对应的组件
            // this就是当前的组件实例
            const { routeMap, current } = this.$router
            const component = routeMap[current] ? routeMap[current].component : null
            // 渲染传入组件
            return h(component)
        }
    })
}

export default VueRouter