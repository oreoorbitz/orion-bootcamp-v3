function calcularMoles(masa, masaMolar) {
  return masa / masaMolar
}

function calcularMolaridad(moles, volumen) {
  return moles / volumen
}

const masaNaCl = 10
const masaMolarNaCl = 58.44
const volumenSolucion = 1

const molesNaCl = calcularMoles(masaNaCl, masaMolarNaCl)
const molaridadNaCl = calcularMolaridad(molesNaCl, volumenSolucion)

console.log('molesNaCl es:', molesNaCl.toFixed(10), 'mol')



/*Resultado de asignación*/

let e = 2;
let x = 1 + (e*=2);

console.log(e);
console.log(x);

/*Conversiones de Tipos*/

let f = '' + 1 + 0;
let g = '' - 1 + 0;
let h = true + false;
let i = 6 / '3';
let j = '2' * '3';
let k = 4 + 5 + 'px';
let l = '$' + 4 + 5;
let m = '4' - 2;
let n = '4px' - 2;
let o = '-9' + 5;
let p = '-9' - 5;
let q = null + 1;
let r = undefined + 1;
let s = '\t \n' - 2;

console.log(f);
console.log(g);
console.log(h);
console.log(i);
console.log(j);
console.log(k);
console.log(l);
console.log(m);
console.log(n);
console.log(o);
console.log(p);
console.log(q);
console.log(r);
console.log(s);

let t = 1;
let u = 2;

console.log( t + u);

function showMessage(from, text = 'sin texto') {
  from = '*' + from + '*';

  console.log( from + ': ' + text );

}

let from = 'Bambi';

showMessage(from, 'Hola');

console.log( from);

showMessage (from, undefined);

/*Funciones flecha*/
let sum = (a, b) => a + b;
console.log( sum(1, 2) );

let double = n => n * 2;
console.log( double(3));

let sayHi = () => console.log('Hola bb');

sayHi();

let suma = (c, d) => {
  let result = c + d;
  return result;
};

console.log ( suma(1, 2) );
