var obj = {
    name: 'chenzhuoqi',
    getName: function () {
        console.log(this===obj);
        console.log(this.name);
    }
}
obj.getName();