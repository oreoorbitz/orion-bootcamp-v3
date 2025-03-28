// main.rs
// EJERCICIO 6: MANIPULACIÓN DE ARRAYS Y FUNCIONES DE ORDEN SUPERIOR
//
// Este ejercicio se centra en la manipulación de arrays (en Rust, se usan Vec<T>) y en la implementación
// de funciones de orden superior similares a las que se usan en JavaScript. Se incluyen funciones básicas
// como acceder a un elemento, manipular un array, sumar elementos, generar un rango, organizar por tipo
// (usando un enum para simular arrays heterogéneos), y versiones propias (mi_mapa, mi_filter, mi_reduce,
// usa_map, usa_filter, usa_reduce) que imitan los métodos .map, .filter y .reduce.

/// Devuelve el elemento en la posición indicada de un array (Vec).
/// Si el índice es inválido, retorna None.
fn acceder_array<T: Clone>(arr: &Vec<T>, index: usize) -> Option<T> {
    // TODO: Retornar el elemento en la posición indicada.
    unimplemented!()
}

/// Manipula un array creando un nuevo vector y agregando tres elementos.
/// Retorna el elemento en la posición 1 (segundo elemento) del vector.
fn manipula_array<T: Clone>(primer_elemento: T, segundo_elemento: T, tercer_elemento: T) -> T {
    // TODO: Crea un vector vacío, agrega tres elementos y retorna el segundo elemento.
    unimplemented!()
}

/// Suma los elementos de un array de números usando un bucle for.
/// Si el vector es homogéneo (todos números), retorna la suma total.
fn sumar_elementos(numeros: &Vec<i32>) -> Result<i32, &'static str> {
    // TODO: Usar un bucle for para sumar los elementos del vector.
    unimplemented!()
}

/// Genera un vector con números desde 0 hasta n (incluyendo n).
/// Retorna un error si n es negativo.
fn generar_rango(n: i32) -> Result<Vec<i32>, &'static str> {
    // TODO: Verifica que n sea no negativo; luego, genera y retorna el vector.
    unimplemented!()
}

/// Enum para representar valores heterogéneos: números o textos.
#[derive(Debug, Clone, PartialEq)]
enum Valor {
    Numero(i32),
    Texto(String),
}

/// Estructura que organiza los elementos por tipo.
#[derive(Debug, PartialEq)]
struct Organizado {
    numbers: Vec<i32>,
    strings: Vec<String>,
}

/// Toma un vector de Valor y devuelve una estructura con dos campos: 'numbers' y 'strings'.
fn organizar_por_tipo(arr: &Vec<Valor>) -> Organizado {
    // TODO: Recorrer el vector y clasificar cada elemento en el campo correspondiente.
    unimplemented!()
}

/// mi_mapa
///
/// Esta función recibe un vector y una función; aplica la función a cada elemento del vector y
/// retorna un nuevo vector con los resultados.
fn mi_mapa<T, U, F>(arreglo: &Vec<T>, mut fnc: F) -> Vec<U>
where
    F: FnMut(&T) -> U,
{
    // TODO: Implementar iterando con un bucle for y retornando el nuevo vector.
    unimplemented!()
}

/// mi_filter
///
/// Esta función recibe un vector y una función predicado; retorna un nuevo vector que contiene
/// solo aquellos elementos para los cuales la función predicado retorna true.
fn mi_filter<T: Clone, F>(arreglo: &Vec<T>, mut predicado: F) -> Vec<T>
where
    F: FnMut(&T) -> bool,
{
    // TODO: Implementar iterando con un bucle for y retornando el vector filtrado.
    unimplemented!()
}

/// mi_reduce
///
/// Esta función recibe un vector, una función reductora y un valor inicial. Aplica la función reductora
/// acumulando un resultado a lo largo de los elementos del vector y retorna el resultado final.
fn mi_reduce<T, U, F>(arreglo: &Vec<T>, mut fnc: F, valor_inicial: U) -> U
where
    F: FnMut(U, &T) -> U,
{
    // TODO: Implementar usando un bucle for para acumular el resultado.
    unimplemented!()
}

/// usa_map
///
/// Esta función utiliza el método de iteradores para simular el método .map de JavaScript.
/// Aplica la función a cada elemento del vector y retorna un nuevo vector con los resultados.
fn usa_map<T, U, F>(arreglo: Vec<T>, fnc: F) -> Vec<U>
where
    F: FnMut(T) -> U,
{
    // TODO: Implementar usando el método map de iteradores.
    unimplemented!()
}

/// usa_filter
///
/// Esta función utiliza el método de iteradores para simular el método .filter de JavaScript.
/// Retorna un nuevo vector con los elementos que cumplen la condición especificada.
fn usa_filter<T, F>(arreglo: Vec<T>, fnc: F) -> Vec<T>
where
    F: FnMut(&T) -> bool,
{
    // TODO: Implementar usando el método filter de iteradores.
    unimplemented!()
}

/// usa_reduce
///
/// Esta función utiliza el método fold para simular el método .reduce de JavaScript.
/// Acumula un resultado a partir de los elementos del vector y retorna el resultado final.
fn usa_reduce<T, U, F>(arreglo: Vec<T>, fnc: F, valor_inicial: U) -> U
where
    F: FnMut(U, T) -> U,
{
    // TODO: Implementar usando el método fold.
    unimplemented!()
}

fn main() {
    // Prueba de acceder_array:
    let arr = vec!['a', 'b', 'c'];
    let resultado_acceder = acceder_array(&arr, 2);
    println!("acceder_array: {:?}", resultado_acceder.unwrap()); // Espera 'c'
    
    // Prueba de manipula_array:
    let resultado_manipular = manipula_array(1, 2, 3);
    println!("manipula_array: {}", resultado_manipular); // Espera 2

    // Prueba de sumar_elementos:
    let suma = sumar_elementos(&vec![200, 200, 20]).unwrap();
    println!("sumar_elementos: {}", suma); // Espera 420

    // Prueba de generar_rango:
    match generar_rango(10) {
        Ok(rango) => println!("generar_rango: {:?}", rango),
        Err(err) => println!("generar_rango: {}", err),
    }
    
    // Prueba de organizar_por_tipo:
    let entrada = vec![
        Valor::Numero(1),
        Valor::Texto(String::from("hola")),
        Valor::Numero(3),
        Valor::Texto(String::from("mundo")),
    ];
    let organizado = organizar_por_tipo(&entrada);
    println!("organizar_por_tipo: {:?}", organizado);
    
    // Prueba de mi_mapa:
    let resultado_mapa = mi_mapa(&vec![1, 2, 3, 4], |x| x * 2);
    println!("mi_mapa: {:?}", resultado_mapa); // Espera [2, 4, 6, 8]
    
    // Prueba de mi_filter:
    let resultado_filter = mi_filter(&vec![1, 2, 3, 4, 5, 6], |x| x % 2 == 0);
    println!("mi_filter: {:?}", resultado_filter); // Espera [2, 4, 6]
    
    // Prueba de mi_reduce:
    let resultado_reduce = mi_reduce(&vec![1, 2, 3, 4], |acc, x| acc + x, 0);
    println!("mi_reduce: {}", resultado_reduce); // Espera 10
    
    // Prueba de usa_map:
    let resultado_usa_map = usa_map(vec![1, 2, 3, 4], |x| x * 3);
    println!("usa_map: {:?}", resultado_usa_map); // Espera [3, 6, 9, 12]
    
    // Prueba de usa_filter:
    let resultado_usa_filter = usa_filter(vec![1, 2, 3, 4, 5, 6], |x| x % 2 != 0);
    println!("usa_filter: {:?}", resultado_usa_filter); // Espera [1, 3, 5]
    
    // Prueba de usa_reduce:
    let resultado_usa_reduce = usa_reduce(vec![1, 2, 3, 4], |acc, x| acc * x, 1);
    println!("usa_reduce: {}", resultado_usa_reduce); // Espera 24
}
