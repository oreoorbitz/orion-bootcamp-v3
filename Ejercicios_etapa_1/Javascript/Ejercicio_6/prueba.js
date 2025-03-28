// Arrays owo
let fruits = ["Apple","Orange","Tangerine","Plum"];

fruits[3] = "Pear";

fruits[4] = "Lemon";

console.log( fruits[0] );
console.log( fruits[1] );
console.log( fruits[2] );
console.log( fruits[3] );
console.log( fruits[4] );

console.log( fruits.length );
console.log( fruits );

// Mezcla de valores
let arr = ["apple", { name: "Paola"}, true, function() {console.log("holaaa gei");} ];

// obtener el objeto del índice 1 y mostrar su nombre
console.log( arr[1].name );

// obtener la funcion del índice 3 y ejecutarla
arr[3]();

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

let frutos = ["Banana"];

let arre = frutos;

console.log(arre === frutos);

arre.push("Pera");

console.log( frutos );
