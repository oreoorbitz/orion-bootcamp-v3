// main.rs
// EJERCICIO 6: MANIPULACIÓN DE ARRAYS Y FUNCIONES DE ORDEN SUPERIOR
//
// Este ejercicio se centra en la manipulación de arrays (en Rust, se usan Vec<T>) y en la
// implementación de funciones de orden superior similares a las que se usan en JavaScript.
// Se incluyen funciones básicas como acceder a un elemento, manipular un array, sumar elementos,
// generar un rango, organizar por tipo (usando un enum para simular arrays heterogéneos),
// y versiones propias (miMapa, miFilter, miReduce) que imitan los métodos .map, .filter y .reduce.

/// Devuelve el elemento en la posición indicada de un array (Vec).
/// Si el índice es inválido, retorna None.
///
/// # Parámetros
/// - `arr`: Un vector de elementos.
/// - `index`: El índice del elemento a obtener.
///
/// # Retorno
/// Un Option con el elemento si existe.
fn acceder_array<T: Clone>(arr: &Vec<T>, index: usize) -> Option<T> {
    arr.get(index).cloned()
}

fn manipula_array<T: Clone>(primer_elemento: T, segundo_elemento: T, tercer_elemento: T) -> T {
    // Crea un vector vacío y agrega tres elementos.
    let mut my_array = Vec::new();
    my_array.push(primer_elemento);
    my_array.push(segundo_elemento);
    my_array.push(tercer_elemento);
    // Retorna el elemento en la posición 1 (segundo elemento).
    my_array[1].clone()
}

fn sumar_elementos(numeros: &Vec<i32>) -> Result<i32, &'static str> {
    // En Rust, el vector ya es homogéneo (todos números) gracias al tipado estático.
    // Simplemente sumamos los elementos.
    let mut suma = 0;
    for &num in numeros.iter() {
        suma += num;
    }
    Ok(suma)
}

fn generar_rango(n: i32) -> Result<Vec<i32>, &'static str> {
    // Verifica que n sea no negativo; de lo contrario, retornamos un error.
    if n < 0 {
        return Err("Datos inválidos");
    }
    let mut rango = Vec::new();
    for i in 0..=n {
        rango.push(i);
    }
    Ok(rango)
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

fn organizar_por_tipo(arr: &Vec<Valor>) -> Organizado {
    let mut numeros = Vec::new();
    let mut textos = Vec::new();
    for item in arr {
        match item {
            Valor::Numero(n) => numeros.push(*n),
            Valor::Texto(s) => textos.push(s.clone()),
        }
    }
    Organizado {
        numbers: numeros,
        strings: textos,
    }
}

/// miMapa
///
/// Esta función recibe un vector y una función; aplica la función a cada elemento del vector y
/// retorna un nuevo vector con los resultados.
fn mi_mapa<T, U, F>(arreglo: &Vec<T>, mut fnc: F) -> Vec<U>
where
    F: FnMut(&T) -> U,
{
    let mut nuevo_vector = Vec::new();
    for item in arreglo {
        nuevo_vector.push(fnc(item));
    }
    nuevo_vector
}

/// miFilter
///
/// Esta función recibe un vector y una función predicado; retorna un nuevo vector que contiene
/// solo aquellos elementos para los cuales la función predicado retorna true.
fn mi_filter<T: Clone, F>(arreglo: &Vec<T>, mut predicado: F) -> Vec<T>
where
    F: FnMut(&T) -> bool,
{
    let mut filtrado = Vec::new();
    for item in arreglo {
        if predicado(item) {
            filtrado.push(item.clone());
        }
    }
    filtrado
}

/// miReduce
///
/// Esta función recibe un vector, una función reductora y un valor inicial. Aplica la función reductora
/// acumulando un resultado a lo largo de los elementos del vector y retorna el resultado final.
fn mi_reduce<T, U, F>(arreglo: &Vec<T>, mut fnc: F, valor_inicial: U) -> U
where
    F: FnMut(U, &T) -> U,
{
    let mut acumulador = valor_inicial;
    for item in arreglo {
        acumulador = fnc(acumulador, item);
    }
    acumulador
}

/// usaMap
///
/// Esta función utiliza el método de iteradores para simular el método .map de JavaScript.
/// Aplica la función a cada elemento del vector y retorna un nuevo vector con los resultados.
fn usa_map<T, U, F>(arreglo: Vec<T>, fnc: F) -> Vec<U>
where
    F: FnMut(T) -> U,
{
    arreglo.into_iter().map(fnc).collect()
}

/// usaFilter
///
/// Esta función utiliza el método de iteradores para simular el método .filter de JavaScript.
/// Retorna un nuevo vector con los elementos que cumplen con la condición especificada.
fn usa_filter<T, F>(arreglo: Vec<T>, fnc: F) -> Vec<T>
where
    F: FnMut(&T) -> bool,
{
    arreglo.into_iter().filter(fnc).collect()
}

/// usaReduce
///
/// Esta función utiliza el método fold para simular el método .reduce de JavaScript.
/// Acumula un resultado a partir de los elementos del vector y retorna el resultado final.
fn usa_reduce<T, U, F>(arreglo: Vec<T>, fnc: F, valor_inicial: U) -> U
where
    F: FnMut(U, T) -> U,
{
    arreglo.into_iter().fold(valor_inicial, fnc)
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
