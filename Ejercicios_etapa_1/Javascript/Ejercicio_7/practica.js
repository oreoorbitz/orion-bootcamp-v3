/*
let usuario = { name: 'Paola' };
let administrador = { name: 'Oreo' };

function sayHi() {
  console.log( this.name );
}

usuario.f = sayHi;
administrador.f = sayHi;

usuario.f();
administrador.f();

administrador['f']();


const { objDisplay } = require("vitest/utils.js");

let user ={
  firstName: 'Paola',
  sayHi() {
    let arrow = () => console.log(this.firstName);
    arrow();
  }
};

user.sayHi();

function makeUser() {
  return {
    name: 'Paola',
    ref() {
      return this;
    }
  };
}

const func = function(x) { console.log(x)}
const funcTwob = x => console.log(x)


let usuario = makeUser();
console.log( usuario.ref().name );


function User(name) {
  this.name = name;
  this.isAdmin = false;
}

let user = new User('Paola');

console.log(user.name);
console.log(user.isAdmin);


function User(name) {
  this.name = name;

  this.sayHi = function() {
    console.log('Mi nombre es: ' + this.name );
  };
}

let john = new User('John');
john.sayHi();
*/
// Herencia prototípica
/*
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

rabbit.__proto__ = animal;

console.log( rabbit.eats );
console.log( rabbit.jumps );

let animal = {
  eats: true,
  walk() {
    console.log('Animal da un paseo');
  }
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

let longEar = {
  earLength: 10,
  __proto__: rabbit
};

longEar.walk();
console.log(longEar.jumps);


let animal = {
  eats: true,
  walk() {
    /*este método no será utilizado por rabbit
  }
};

let rabbit = {
  __proto__: animal
};

rabbit.walk = function() {
  console.log('¡Conejo! ¡Salta, salta!');
};

rabbit.walk();

let user = {
  name: 'Paola',
  surname: 'Nava',

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  },

  get fullName() {
    return `${this.name} ${this.surname}`;
  }
};

let admin = {
  __proto__: user,
  isadmin: true
};

console.log(admin.fullName);

//Dispara el setter!
admin.fullName = 'Harry Styles'; // (*)

console.log(admin.fullName);
console.log(user.fullName);


let animal = {
  walk() {
    if (!this.isSleeping) {
      console.log('Yo camino');
    }
  },

  sleep() {
    this.isSleeping = true;
  }
};

let rabbit = {
  name: 'Conejo Blanco',
  __proto__: animal
};

// Modifica rabbit.isSleeping
rabbit.sleep();
console.log(rabbit.isSleeping);
console.log(animal.isSleeping);


let animal ={
  eats: true
};

let rabbit= {
  jumps: true,
  __proto__: animal
};

for(let prop in rabbit) {
  let isOwn = rabbit.hasOwnProperty(prop);

  if (isOwn) {
    console.log(`Es nuestro: ${prop}`);
  } else {
    console.log(`Es heredado: ${prop}`);
  }
}


let animal ={
  eats: true
};

function Rabbit (name) {
  this.name = name;
}

Rabbit.prototype = animal;
let rabbit = new Rabbit('Conejo Blanco');

console.log( rabbit.eats );


function Rabbit () {}
// por defecto:
// Rabbit.prototype = { constructor: Rabbit }

console.log(Rabbit.prototype.constructor == Rabbit);


function Rabbit () {}
Rabbit.prototype = {
  jumps: true
};

let rabbit = new Rabbit ();
console.log(rabbit.constructor === Rabbit);

PROTOTIPOS NATIVOOOSSSSSSS


let obj = {};
console.log(obj.__proto__ === Object.prototype );
console.log(obj.toString() === obj.__proto__.toString());
console.log(obj.toString() === Object.prototype.toString());

console.log(Object.prototype.__proto__);


let arr = [1, 2, 3];
// se hereda array de prototype?
console.log(arr.__proto__ === Array.prototype );
// y después desde Object.prototype?
console.log(arr.__proto__.__proto__ === Object.prototype );
// Y null en el tope
console.log( arr.__proto__.__proto__.__proto__ );

console.log(arr.toString());

function f() {}

console.log(f.__proto__ == Function.prototype );
console.log(f.__proto__.__proto__ == Object.prototype );


String.prototype.show = function () {
  console.log(this);
};

'BOOM!'.show();
'Esta es una prueba para mostrar que se puede modificar al papi'.show();


if (!String.prototype.repeat) {

  String.prototype.repeat = function(n) {
    return new Array(n + 1).join(this);
  };
}

console.log( 'La'.repeat(3));

let obj ={
  0: 'Hola',
  1: 'Mundo!',
  length: 2,
};
 obj.join = Array.prototype.join;
 console.log( obj.join(',') );

 class User {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(this.name);
  }
 }

 let user = new User('John');
 user.sayHi();


class User {
  constructor(name) { this.name = name; }
  sayHi() { console.log(this.name); }
}
// una clase es una función
console.log(typeof User);

// ... o más precisamente, el método constructor
console.log(User === User.prototype.constructor);

// Los métodos están en User.prototype, por ejemplo:
console.log(User.prototype.sayHi);

// Hay exactamente dos métodos en el prototipo
console.log(Object.getOwnPropertyNames(User.prototype));


// reescribiendo la clase User puramente con funciones
// 1. Crear la función constructor
function User(name) {
  this.name = name;
}

// un prototipo de función tiene la propiedad "constructor" por defecto,
// así que no necesitamos crearla

// 2. Agregar el método al prototipo
User.prototype.sayHi = function () {
  console.log(this.name);
};

// Uso:
let user = new User('John');
user.sayHi();


class User {
  constructor() {}
}

console.log( User.toString () );


let User = class {
  sayHi() {
    console.log('Hello');
  }
};


// Expresiones de clase con nombre
// (Named class expressions no figura así en la especificaión, pero es equivalente a Named Function Expression)
let User = class MyClass {
  sayHi() {
    console.log(MyClass);
  }
};

new User().sayHi();

console.log(MyClass);


function makeClass(phrase) {
  //declara una clase y lo devuelve
  return class {
    sayHi() {
      console.log(phrase);
    }
  };
}

//Crea una nueva clase
let User = makeClass('Hello');
new User().sayHi();


class User {
  constructor(name) {
    //invoca el setter
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value.length < 4) {
      console.log('Nombre demasiado corto');
      return;
    }
    this._name = value;
  }
}

let user = new User('John');
console.log(user.name);
user = new User('');


class User {
  name = 'John';

  sayHi() {
    console.log(`Hello, ${this.name}!`);
  }
}

new User().sayHi();


class User {
  name = 'Paola';
}
 let user = new User();
 console.log(user.name);
 console.log(User.prototype.name);


class Button {
  constructor(value) {
    this.value = value;
  }

  click() {
    console.log(this.value);
  }
}

let button = new Button('hello');
setTimeout(button.click, 1000);


class Button {
  constructor(value) {
    this.value = value;
  }
  click = () => {
    console.log(this.value);
  }
}

let button = new Button('hello');

setTimeout(button.click, 1000);


class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  run(speed) {
    this.speed = speed;
    console.log(`${this.name} corre a una velocidad de ${this.speed}.`);
  }
  stop() {
    this.speed = 0;
    console.log(`${this.name} se queda quieto.`)
  }
}

let animal = new Animal('Mi animal');

class Rabbit extends Animal {
  hide() {
    console.log(`¡${this.name} se esconde!`)
  }
}

let rabbit = new Rabbit('Conejo Rosita');

rabbit.run(5);
rabbit.hide();

function f(phrase) {
  return class {
    sayHi() { console.log(phrase); }
  };
}

class User extends f('Holiiis') {}

new User().sayHi();


class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  run(speed) {
    this.speed = 0;
    this.name = this.name;
  }

  run(speed) {
    this.speed = speed;
    console.log(`${this.name} corre a una velocidad de ${this.speed}.`);
  }

  stop() {
    this.speed = 0;
    console.log(`${this.name} se queda quieto.`);
  }

}

class Rabbit extends Animal {
  hide() {
    console.log(`¡${this.name} se esconde!`);
  }

  stop() {
    super.stop();
    this.hide();
  }
}

let rabbit = new Rabbit('Conejo Blanco');

rabbit.run(5);
rabbit.stop();


class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
}

class Rabbit extends Animal {
  constructor(name, earLength) {
    super(name);
    this.earLength = earLength;
  }
}

let rabbit = new Rabbit('Conejo Blanco', 10);
console.log(rabbit.name);
console.log(rabbit.earLength);


class Animal {
  name = 'animal'

  constructor () {
    console.log(this.name);
  }
}

class Rabbit extends Animal {
  name = 'rabbit';
}

new Animal();
new Rabbit();


class Animal {
  showName() {
    console.log('animal');
  }

  constructor() {
    this.showName();
  }
}

class Rabbit extends Animal {
  showName() {
    console.log('rabbit');
  }
}

new Animal();
new Rabbit();


let animal = {
  name: 'Animal',
  eat() {
    console.log(`${this.name} come.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: 'Conejo',
  eat() {
    // así es como podría funcionar super.eat()
    this.__proto__.eat.call(this);
  }
};

rabbit.eat();


let animal = {
  name: 'Animal',
  eat() {
    console.log(`${this.name} come.`);
  }
};

let rabbit = {
  __proto__: animal,
  eat() {
    //... rebota al estilo de conejo y llama al método padre (animal)
    this.__proto__.eat.call(this); //(*)
  }
};

let longEar = {
  __proto__: rabbit,
  eat() {
    //... haz algo con orejas largas y llama al método padre (rabbit)
    this.__proto__.eat.call(this); //(**)
  }
};

longEar.eat();


let animal ={
  name: 'Animal',
  eat() {
console.log(`${this.name} come.`)
  }
};

let rabbit = {
  __proto__: animal,
  name: 'Conejo',
  eat() {
    super.eat();
  }
};

let longEar = {
  __proto__: rabbit,
  name: 'Oreja Larga',
  eat() {
    super.eat();
  }
};

longEar.eat();

let animal = {
  sayHi() {
    console.log(`Soy un animal`);
  }
};

// rabbit hereda de animal
let rabbit = {
  __proto__: animal,
  sayHi() {
    super.sayHi();
  }
};

let plant = {
  sayHi() {
    console.log("Soy una planta");
  }
};

// tree hereda de plant
let tree = {
  __proto__: plant,
  sayHi: rabbit.sayHi // (*)
};

tree.sayHi();  // Soy un animal (?!?)
*/

let animal = {
  eat: function() { // escrito así intencionalmente en lugar de eat() {...
    // ...
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() {
    super.eat();
  }
};

rabbit.eat();
