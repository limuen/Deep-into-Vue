// 实现KVue的构造函数
function defineReactive(obj, key, val) {

    // 如果val是对象就递归处理
    observe(val)

    // 拦截：对某个对象的某个key进行拦截
    Object.defineProperty(obj, key, {
        get() {
            console.log('get', key)
            return val
        },
        set(newVal) {
            if(val !== newVal) {
                // 如果newVal是对象，也要做响应式处理
                observe(newVal)
                val = newVal
                console.log('set', key, newVal)
            }
        },
    })
}
// 遍历指定数据对象的每个key，拦截他们
function observe(obj) {
    if(typeof obj !== 'object' || obj === null) {
        return 
    }
    // 每遇到一个对象就创建一个Observe的实例
    new Observe(obj)
}



// proxy代理函数：让用户可以直接访问data中的key
function proxy(vm, key) {
    Object.keys(vm[key]).forEach(k => {
        Object.defineProperty(vm, k, {
            get() {
                return vm[key][k]
            },
            set(newVal) {
                vm[key][k] = newVal
            }
        })
    })
}



// 创建一个Observe实例来进行拦截
// 根据传入value的类型做不同的操作
class Observe {
    constructor(value) {
        this.value = value
        // 判断value类型再进行obj或者arr操作
        // 遍历对象
        this.walk(value)
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}


// 1.将data做响应式处理
class KVue {
    constructor(options) {
        // 0.保存options
        this.$options = options
        this.$data = options.data

        // 1.将data做响应式处理
        observe(this.$data)

        // 2.为$data做代理
        proxy(this, '$data')

        // 3.编译模版
        new Compile('#app', this)
    }
}

// 
class Compile {
    // el: 宿主元素，vm：KVue实例
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        this.$vm = vm

        //把用户在模版里面的{{}}解析
        if(this.$el) {
            this.compile(this.$el)
        }
    }

    compile(el) {
        // el是宿主元素
        // 遍历el，判断当前遍历元素的类型
        el.childNodes.forEach(node => {
            // nodeType：1.元素节点 3:文本节点
            if(node.nodeType === 1) {
                console.log('编译元素', node.nodeName)
            } else if(this.isInter(node)){
                // 文本 {{xxx}}
                console.log('编译文本', node.textContent, RegExp.$1)
            } else {

            }
        })
    }

    // 判断插值的表达式
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

}