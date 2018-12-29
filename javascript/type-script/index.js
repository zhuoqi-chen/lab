function greeter(person) {
    return "Hello, " + person;
}
var user = { firstName: "chenzhuoqi", lastName: "hahah" };
document.body.innerHTML = greeter(user);
