let hour = 12;
let isWeekend = true;

if (hour < 10 || hour > 18 || isWeekend) {
  console.log('La oficina esta cerrada.');
}

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
