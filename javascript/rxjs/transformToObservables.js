const fs = require('fs')
const Rx = require('rxjs/Rx')
// of---来自一个或多个值
const fromValue=Rx.Observable.of(1,2,3)
fromValue.subscribe((x)=>{console.log(x);})
//from---来自数组
const fromArray=Rx.Observable.from([4,5,6])
fromArray.subscribe((x)=>{console.log(x);})

//fromEvent---来自事件
// const fromEvent=Rx.Observable.fromEvent(document.querySelector('button'),'click')
// fromEvent.subscribe((x)=>{console.log(x);})

//fromPromise---来自promise
function APromise(x) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(x)
        }, 1000);
    });
}
const fromPromise=Rx.Observable.fromPromise(APromise(7));
fromPromise.subscribe((x)=>{console.log(x);})

// bindCallback 
const fromCallback = Rx.Observable.bindCallback(fs.exists);
fromCallback('package.json').subscribe(exists => console.log('Does file exist?', exists))

// customCallback
const myCallback=(a,b,cb)=>{
    cb(a,b);
}
const fromCallback2 = Rx.Observable.bindCallback(myCallback);
fromCallback2(8,9).subscribe((x) => console.log('myCallback', x))