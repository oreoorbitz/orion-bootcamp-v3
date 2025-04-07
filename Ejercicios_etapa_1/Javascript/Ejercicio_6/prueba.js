// Arrays owo
/*let fruits = ["Apple","Orange","Tangerine","Plum"];

fruits[3] = "Pear";

fruits[4] = "Lemon";

console.log( fruits[0] );
console.log( fruits[1] );
console.log( fruits[2] );
console.log( fruits[3] );
console.log( fruits[4] );

console.log( fruits.length );
console.log( fruits );



console.log( fruits.pop() );
console.log( fruits );

fruits.push("Lemon");
console.log( fruits );

console.log( fruits.shift() );
console.log( fruits );

fruits.unshift("Apple");
console.log( fruits );

let frutas = ["Manzana"];
frutas.push("Naranja","Durazno");
frutas.unshift("Piña","Limón");

console.log(frutas);

let frutos = [];

frutos[99999] = 5;

frutos.age = 25;

let arr = ["Apple", "Orange", "Pear"];

for (let i = 0; i < arr.length; i++) {
  console.log( arr[i] );
}

let prueba = [];
prueba[143] = "Blenders";

console.log(prueba.length);


let aarr = [1 , 2, 3, 4, 5];
aarr.length = 2;
console.log( aarr );

aarr.length = 5;
console.log( aarr[3] );

let Paola = new Array(2);

console.log( Paola[0] );
console.log( Paola.length );

let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log( matrix[0][1]);
*/

/* nlet arr = [1, 2, 3];

console.log( arr );
console.log( String(arr) === '1,2,3');

console.log([] + 1);
console.log( [1] + 1);
console.log( [1, 2] + 1);

console.log("" + 1);
console.log( "1" + 1);
console.log( "1, 2" + 1);

const cosas = ["cachorrito", "conejito", "impuestos"];
const cosasTiernas = [];
const cosasFeas = [];


const length = cosas.length
for (let index = 0; index < length ; index++) {
  const cosa = cosas[index]
  if (cosa === "impuestos") {
    cosasFeas.push(cosa)
  } else {
    cosasTiernas.push(cosa)
  }

}

console.log(cosasTiernas)
console.log(cosasFeas)


function organizadorBurbujita(arr) {
  for(let i = 0; i < arr.length ; i++ ){
    for(let j=0 ; j< arr.length-1; j++ ){
      if(arr[j] > arr[j+1]) {
        let temp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = temp
      }
          }
  }
  return arr
}

const numeros = [1, 885, 67, 798, 99]
const numerosOrganizados = organizadorBurbujita(numeros)
console.log(numerosOrganizados)
for(let i = 0; i < 10; i++) {
  if(i % 2 == 0) continue;
  console.log(i)
}

let arr = ["voy", "a", "casa"];
delete arr[1];
console.log(arr[1]);
console.log(arr.length);

let aar = ["Yo", "estudio", "JavaScript"];
aar.splice(1, 1);
console.log(aar);

let aaa = ["Yo", "estudio", "JavaScript", "ahora", "mismo"];
  aaa.splice(0, 3, "a", "bailar");
  console.log( aaa);

let array = ["Yo", "estudio", "JavaScript", "ahora", "mismo"];
let removed = array.splice(0, 2);
console.log(removed);

let bbb = ["Yo", "estudio", "JavaScript"];
bbb.splice(2, 0, "el", "complejo","languaje");
console.log(bbb);

let numm = [1,2,5];
numm.splice(-1, 0, 3, 4);
console.log(numm);

let arrow =[1, 2];

console.log( arrow.concat([3, 4]) );
console.log( arrow.concat([3, 4], [5, 6]) );
console.log( arrow.concat([3, 4], 5, 6) );

let arrowLike = {
  0: "something",
  1: "else",

  length: 2,
};

console.log(arrow.concat(arrowLike).toString());

["Bimbo","Gandalf","Nazgul"].forEach((item, index, array) => {
  console.log(`${item} está en el indice ${index} en ${array}`)
});

let bubble = [1, 0, false];
console.log( bubble.indexOf(0) );
console.log( bubble.indexOf(false) );
console.log( bubble.indexOf(null) );
console.log( bubble.includes(1) );

let frutitas = ['Manzanita','Naranjita','Manzanita'];
console.log(frutitas.indexOf('Manzanita') );
console.log(frutitas.lastIndexOf('Manzanita') );

const arrr =[NaN];
console.log(arrr.indexOf(NaN) );
console.log(arrr.includes(NaN) );

let users = [
  {id: 1, name:'Celina'},
  {id: 2, name:'David'},
  {id: 3, name:'Federico'}
];

let user = users.find(item => item.id == 1);
console.log(user.name);

const arrOriginal = ["a","b","dogs"]
const nuevoArray = [...arrOriginal, "c"]

console.log(nuevoArray)

let usuarios = [
  {id: 1, name: "John"},
  {id: 2, name: "Pete"},
  {id: 3, name: "Mary"},
  {id: 4, name: "John"}
];

// Encontrar el índice del primer John
console.log(usuarios.findIndex(usuario => usuario.name == 'John')); // 0

// Encontrar el índice del último John
console.log(usuarios.findLastIndex(usuario => usuario.name == 'John')); // 3

let usuariOs = [
  {id: 1, name: "Celina"},
  {id: 2, name: "David"},
  {id: 3, name: "Federico"}
];

// devuelve un array con los dos primeros usuarios
let someUsers = usuariOs.filter(item => item.id < 3);

console.log(someUsers.length); // 2

let lengths = ["Bilbo", "Gandalf", "Nazgul"].map(item => item.length);
console.log(lengths); // 5,7,6

let arroz = [ 1, 2, 15 ];

// el método reordena el contenido de arr
arroz.sort();

console.log( arroz );  // 1, 15, 2

[1, -2, 15, 2, 0, 8].sort(function(a, b) {
  console.log( a + "<>" + b );
  return a - b;
});

let brr = [1, 2, 15];
brr.sort(function(a, b) {return a - b})
console.log(brr)

let paises = ['Österreich', 'Andorra', 'Vietnam'];
console.log(paises.sort( (a, b) => a > b ? 1:-1 ));
console.log(paises.sort( (a, b) => a.localeCompare(b) ) );

let numeross = [1, 2, 3, 4, 5];
numeross.reverse();
console.log(numeross);

*/

let nombres = 'Bilbo, Gandalf, Nazgul';
let arr = nombres.split(', ');
for (let name of arr) {
  console.log( `Un mensaje para ${name}.` );
  }

  let arrr = 'Bilbo, Gandalf, Nazgul, Saruman'.split(',',2);
  console.log(arrr);

  let str = "test";
  console.log( str.split('') );

  let names = ['Bilbo', 'Gandalf', 'Nazgul'];
  let stringg = names.join(';');
  console.log( stringg );

  let sumArr = [1, 2, 3, 4, 5];
  let result = sumArr.reduce((sum, current) => sum + current, 0);
  console.log(result);

  let army = {
    minAge: 18,
    maxAge: 27,
    canJoin(user) {
      return user.age >= this.minAge && user.age < this.maxAge;
    }
  };

  let users = [
    {age: 16},
    {age: 20},
    {age: 23},
    {age: 30}
  ];

  // encuentra usuarios para los cuales army.canJoin devuelve true
  let soldiers = users.filter(army.canJoin, army);

  console.log(soldiers.length);
  console.log(soldiers[0].age);
  console.log(soldiers[1].age);
