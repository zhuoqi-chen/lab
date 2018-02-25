class Dep{
    constructor() {
        this.subs=[]
    }
    addSub(sub){
        this.subs.push(sub);
    }
    notify(){
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}
class Watch{
    constructor(vm,node,name,nodeType){
        Dep.target=this;
        this.node=node
        this.name=name
        this.vm= vm
        this.nodeType=nodeType
        this.update()
        Dep.target=null
    }
    update(){
        this.get()
        this.node.nodeValue=this.value
    }
    get(){
        this.value=this.vm[this.name]
    }
}
class MVVM {
    constructor(opts){
        this.data =opts.data;
        this.el =opts.el;
        const vm= this;
        const data= this.data;
        const el = document.querySelector(opts.el);             
        observer(data,vm); 
        const dom =  nodeToFragment(el,this);
        el.appendChild(dom);
    }
}
function observer(data,vm) {
    Object.keys(data).forEach((key)=>{
        defineReactive(vm,key,data[key])
    })
}
function defineReactive(vm,key,val) {
    const dep = new Dep();
    Object.defineProperty(vm,key,{
        get(){
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
            return val
        },
        set(newVal){
            if (newVal == val) return;
            val= newVal;
            dep.notify()
        }
    })
}
function nodeToFragment(node,vm){
    var frag = document.createDocumentFragment();
    var child;
    while(child = node.firstChild){
        debugger
        complie(child,vm);
        frag.append(child);
    }
    return frag;
}
function complie(node,vm){
    var reg = /\{\{(.*)\}\}/igm;
    if(node.nodeType == 1){
        var attrs = node.attributes;
        for(var i = 0,len = attrs.length;i < len;i++){
            if(attrs[i].nodeName == 'v-model'){
                var name =attrs[i].nodeValue;
                node.addEventListener('input',function(e){
                    vm[name] = e.target.value;
                })
                node.value = vm[name];
                node.removeAttribute('v-model');
            }
        }
        new Watch(vm,node,name,'input')
    }
    if(node.nodeType ==3){
        if(reg.test(node.nodeValue)){
            var name = RegExp.$1;
            name = name.trim();
            nodeType = 'text';
            new Watch(vm,node,name,'text')
        }         
    }
}
