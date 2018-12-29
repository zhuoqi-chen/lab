interface person {
  firstName: string;
  lastName: string;
}
function greeter(person: person) {
  return "Hello, " + person;
}

let user = { firstName: "chenzhuoqi", lastName: "hahah" };

document.body.innerHTML = greeter(user);
