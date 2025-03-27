/* Objetos y propiedades */
let user  = {
  name: 'Paola',
  age: 26,
  "likes birds": true
};

console.log(user.name);


user.isAdmin = true;

console.log(user.isAdmin);

delete user.age;
console.log(user.age);
console.log(user["likes birds"]);

let key = "likes birds";
user[key] = true;

const monedas = {
  USD: "$",
  EUR: "€",
  GBP: "£",
}

let código = "$"

console.log(monedas.USD === código)
