

console.log(1 || 0);
console.log(null || 1);
console.log(null || 0 || 1);
console.log(undefined || null || 0);

let firstName = '';
let lastName = '';
let nickName = 'SuperCoder';

console.log( firstName || lastName || nickName || 'Anonymous');

true || console.log('not printed');
false || console.log('printed');

function conisguirNumero(n) {
  return n
}

const numero = conisguirNumero() || null

if(numero === null) {
  console.log('número es nulo hay un error crítico en el formulario');

}

console.log(true && true);
console.log(false && true);
console.log(true && false);
console.log(false && false);

let hour = 12;
let minute = 30;

if(hour == 12 && minute == 30) {
  console.log('La hora es 12:30');
}

if(1 && 0) {
  console.log('no funcionará porque el resultado es un valor falso');
}

console.log(1 && 0);
console.log(1 && 5),
console.log(null && 5);
console.log(0 && 'cualquier valor');
console.log(1 && 2 && null && 3);
console.log(1 && 2 && 3);

console.log(!true);
console.log(!0);
console.log(!!'cadena de texto no vacía');
console.log(!!null);

console.log(Boolean('cadena de texto no vacía'));
console.log(Boolean(null));

console.log(2 > 1);
console.log(2 == 1);
console.log(2 != 1);

let result = 5 > 4;
console.log( result );

console.log('Aquí los resultados nuevos');
console.log('Z' > 'A');
console.log('Glow' > 'Glee');
console.log('Bee' > 'Be');

console.log('2' > 1);
console.log('01' == 1);

console.log('aqui nuevos resultados');
console.log(true == 1);
console.log(false == 0);

let a = 0;
console.log(Boolean(a));
let b = '0';
console.log(Boolean(b));
console.log( a==b );
console.log(0 === false);
console.log(null === undefined);
console.log(null == undefined);

console.log(null > 0);
console.log(null == 0);
console.log(null >= 0);

console.log(undefined > 0);
console.log(undefined < 0);
console.log(undefined == 0);

let v = 'rt';
console.log(typeof(false));
console.log(typeof(true) );
console.log(typeof(0) );
console.log(typeof(' ') );
console.log(typeof(null) );
console.log(typeof(undefined) );
console.log(typeof(NaN) );
console.log(typeof('42') );
console.log(typeof('Hola') );
console.log(typeof([]) );
console.log(typeof({}) );
