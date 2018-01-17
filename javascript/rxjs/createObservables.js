const Rx = require('rxjs/Rx')

//by Observable.create
const myObservable= Rx.Observable.create(observer=>{
    observer.next('foo');
    setTimeout(() => observer.next('bar'), 1000);
})
myObservable.subscribe(value => console.log(value));

//from Subject
var myObservable2 = new Rx.Subject();
myObservable2.subscribe(value => console.log(value));
myObservable2.next('chen');
myObservable2.next('zhuo');
myObservable2.next('qi');