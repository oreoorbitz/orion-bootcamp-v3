# pytest
import math
from py_ex_01 import (
    edad_en_dias, cual_es_tu_nombre, checar_tipo, falsoso_verdadoso,
    division_segura, valor_seguro, convertir_cents_a_moneda, comparar_objetos_por_stringify
)

def test_edad_en_dias():
    assert edad_en_dias(1) == 365
    assert edad_en_dias(0) == 0
    assert edad_en_dias(10) == 3650

def test_cual_es_tu_nombre():
    assert cual_es_tu_nombre("Juan", "Pérez") == "Hola, Juan Pérez!"
    assert cual_es_tu_nombre("Ana", "Gómez") == "Hola, Ana Gómez!"

def test_checar_tipo():
    assert checar_tipo(10, "int") == "La variable es int: True"
    assert checar_tipo("Hola", "number") == "La variable es number: False"

def test_falsoso_verdadoso():
    assert falsoso_verdadoso(False) == "El elemento es el booleano false"
    assert falsoso_verdadoso(True)  == "El elemento es el booleano true"

def test_division_segura():
    assert division_segura(10, 2) == "El resultado de dividir 10 entre 2 es 5.0"
    assert division_segura(10, "Hola") == "Error: Uno de los valores no es un número"
    assert division_segura(10, 0) == "Error: No se puede dividir por 0"
    assert division_segura(float('nan'), 5) == "Error: Uno de los valores es NaN"

def test_valor_seguro():
    assert valor_seguro(None).startswith("El valor es None")
    assert valor_seguro(0).startswith("El valor es falsy pero definido")
    assert valor_seguro("Hola").startswith("El valor es válido")

def test_convertir_cents_a_moneda():
    assert convertir_cents_a_moneda(1234, "USD") == "$12.34"
    assert convertir_cents_a_moneda(50, "EUR") == "€0.50"
    assert convertir_cents_a_moneda(-100, "GBP") == "Valor invalido"
    assert convertir_cents_a_moneda(200, "ABC") == "Codigo de moneda invalido"

def test_comparar_objetos_por_stringify():
    a = {"a": 1, "b": 2}
    b = {"b": 2, "a": 1}
    c = {"a": 2}
    assert comparar_objetos_por_stringify(a, b) is True
    assert comparar_objetos_por_stringify(a, c) is False
