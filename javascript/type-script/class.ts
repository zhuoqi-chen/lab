class Student {
  fullName: string;
  constructor(public firstName, public lastName) {
    this.fullName = firstName + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "hello" + person.firstName + person.lastName;
}
let user = new Student("chen", "zhuoqo");
document.body.innerHTML = greeter(user);
