// Object.defineProperty()

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
                console.log('set', key)
            }
        },
    })
}


// 遍历指定数据对象的每个key，拦截他们
function observe(obj) {
    if(typeof obj !== 'object' || obj === null) {
        return 
    }

    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })

}

// 添加对象没有的key和val
function set(obj, key, val) {
   defineReactive(obj, key, val)
}

const obj = {foo: 'foo', bar: 'bar', baz: { a: 1 }}

// defineReactive(obj, 'foo', 'foo')
observe(obj)


obj.foo
obj.foo = 'foooooooooooo'