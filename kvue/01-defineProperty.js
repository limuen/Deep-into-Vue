// Object.defineProperty()

// 数组响应式
// 1.替换数组原型中7个方法
const orginalProto = Array.prototype;
// 备份，修改
const arrayProto = Object.create(orginalProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
    arrayProto[method] = function() {
        // 原始操作
        orginalProto[method].apply(this, arguments)
        // 覆盖操作: 通知更新
        console.log('数组执行' + method + '操作')
    }
})



// 对象响应式
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

    // 判断传入obj类型
    if(Array.isArray(obj)) {
        // 覆盖原型，替换7个变更操作
        obj.__proto__ = arrayProto
        // 对数组内部的元素执行相应化
        const keys = Object.keys(obj)
        for (let i = 0; i < obj.length; i++) {
            observe(obj[i])
        }
    } else {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}

// 添加对象没有的key和val
function set(obj, key, val) {
   defineReactive(obj, key, val)
}

const obj = {foo: 'foo', bar: 'bar', baz: { a: 1 }, arr: [1,2,3]}

// defineReactive(obj, 'foo', 'foo')
observe(obj)


obj.foo
obj.foo = 'foooooooooooo'
obj.arr.push(4)