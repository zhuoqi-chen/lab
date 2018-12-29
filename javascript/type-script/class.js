var Student = /** @class */ (function () {
    function Student(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "hello" + person.firstName + person.lastName;
}
var user = new Student("chen", "zhuoqo");
document.body.innerHTML = greeter(user);
