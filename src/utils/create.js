import Vue from 'vue'

// Component - 组件配置对象
// props - 传递给它的属性
function create(Component, props) {

 /**
  * Vue.extend
  */
  // 1.构建Component的实例
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({
    propsData: props
  }).$mount();
  // 2.挂载到body上
  document.body.appendChild(vm.$el)

  vm.remove = () => {
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }



  /**
   * Vue.render
   */
  // 1.构建Component的实例
  // const vm = new Vue({
  //   render(h) {
  //     // h是createElement
  //     // 它可以返回一个vnode
  //     return h(Component, { props })
  //   }
  // }).$mount() // 不设置挂载目标，依然可以转换vnode为真实节点$el
  // // 2.挂载到body上
  // document.body.appendChild(vm.$el)


  // // 3.获取组件实例
  // const comp = vm.$children[0]

  // comp.remove = () => {
  //   document.body.removeChild(vm.$el)
  //   vm.$destroy()
  // }
  
  return vm
}
export default create