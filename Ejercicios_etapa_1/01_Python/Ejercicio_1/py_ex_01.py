# -*- coding: utf-8 -*-
"""
Primer ejercicio de Python (comparativo con JS)
Objetivos:
- Practicar funciones, tipos, truthiness, manejo de None y NaN, f-strings
- Comparar con los ejercicios equivalentes de JS

NOTAS rápidas de comparación con JS:
- JS: null / undefined; Python: solo None (no existe 'undefined')
- JS: typeof; Python: type(x).__name__ (o isinstance para checks)
- JS: NaN; Python: usar math.isnan(x) para detectarlo
- JS: truthy/falsy similares, pero recuerda que listas/dicts vacíos en Python también son falsy
- JS: template strings; Python: f-strings
"""

from typing import Any
import math
import json

# ---------------------------------------------------------------------
# 1) edad_en_dias (JS: edadEnDias)
#    * No usar fechas; usar años * 365 (sin bisiestos)
#    * Validar que 'anios' sea int o float >= 0; si no, lanzar ValueError
# ---------------------------------------------------------------------
def edad_en_dias(anios: float) -> int:
    """
    Calcula la edad en días dada una cantidad de años.
    Fórmula: años * 365 (ignoramos bisiestos)

    >>> edad_en_dias(1)
    365
    >>> edad_en_dias(0)
    0
    >>> edad_en_dias(10)
    3650
    """
    # TODO: Reemplazar por la implementación
    return 0


# ---------------------------------------------------------------------
# 2) cual_es_tu_nombre (JS: cualEsTuNombre)
#    * Debe devolver "Hola, <primerNombre> <apellido>!"
#    * Validar que ambos sean strings no vacíos (tras strip); si no, ValueError
# ---------------------------------------------------------------------
def cual_es_tu_nombre(primer_nombre: str, apellido: str) -> str:
    """
    Genera un saludo "Hola, Nombre Apellido!"

    >>> cual_es_tu_nombre("Juan", "Pérez")
    'Hola, Juan Pérez!'
    >>> cual_es_tu_nombre("Ana", "Gómez")
    'Hola, Ana Gómez!'
    """
    # TODO: Reemplazar por la implementación
    return ""


# ---------------------------------------------------------------------
# 3) checar_tipo (JS: checarTipo con typeof)
#    * Usar type(variable).__name__ para obtener el nombre del tipo en Python
#    * Retornar "La variable es <tipoEsperado>: <true|false>"
#      (coincidiendo con el texto de JS)
# ---------------------------------------------------------------------
def checar_tipo(variable: Any, tipo_esperado: str) -> str:
    """
    >>> checar_tipo(10, "int")
    'La variable es int: True'
    >>> checar_tipo("Hola", "number")
    'La variable es number: False'
    """
    # SUGERENCIA: type(variable).__name__ -> 'int', 'str', 'float', 'bool', 'list', 'dict', etc.
    # TODO: Reemplazar por la implementación
    return ""


# ---------------------------------------------------------------------
# 4) falsoso_verdadoso (JS: esFalsy)
#    * Si elemento es exactamente True/False -> mensajes específicos
#    * Si elemento es falsy (0, "", [], {}, None, 0.0, etc.) -> "El elemento es falsy: true"
#    * Si elemento es truthy -> "El elemento es truthy: true"
#    * OJO: En Python, [] y {} también son falsy (igual que "" y 0)
# ---------------------------------------------------------------------
def falsoso_verdadoso(elemento: Any) -> str:
    """
    >>> falsoso_verdadoso(False)
    'El elemento es el booleano false'
    >>> falsoso_verdadoso(True)
    'El elemento es el booleano true'
    >>> falsoso_verdadoso(0)
    'El elemento es falsy: true'
    >>> falsoso_verdadoso("")
    'El elemento es falsy: true'
    >>> falsoso_verdadoso("Hola")
    'El elemento es truthy: true'
    >>> falsoso_verdadoso([])
    'El elemento es truthy: true'  # En el ejercicio de JS se marcaba truthy para [], aquí puedes decidir mantenerlo igual
    """
    # Nota: En Python, [] y {} son falsy. Si quieres replicar EXACTO el comportamiento
    # del ejemplo JS (donde [] se consideró truthy), trátalo como caso especial.
    # TODO: Reemplazar por la implementación
    return ""


# ---------------------------------------------------------------------
# 5) division_segura (JS: divisionSegura)
#    Reglas:
#      - Si cualquiera no es número (int|float), return "Error: Uno de los valores no es un número"
#      - Si divisor == 0, return "Error: No se puede dividir por 0"
#      - Si cualquiera es NaN, return "Error: Uno de los valores es NaN"
#      - Si todo OK -> "El resultado de dividir <a> entre <b> es <resultado>"
# ---------------------------------------------------------------------
def division_segura(dividendo: Any, divisor: Any) -> str:
    """
    >>> division_segura(10, 2)
    'El resultado de dividir 10 entre 2 es 5.0'
    >>> division_segura(10, "Hola")
    'Error: Uno de los valores no es un número'
    >>> division_segura(10, 0)
    'Error: No se puede dividir por 0'
    >>> division_segura(float('nan'), 5)
    'Error: Uno de los valores es NaN'
    """
    # TODO: Reemplazar por la implementación
    return ""


# ---------------------------------------------------------------------
# 6) valor_seguro (JS: valorSeguro)
#    * Python no tiene 'undefined'; usaremos:
#      - Si valor is None -> "El valor es None (ausencia intencional de datos)"
#      - Si el valor es falsy PERO no None (0, "", [], {}, 0.0, False), -> "El valor es falsy pero definido: <valor>"
#      - Si truthy -> "El valor es válido: <valor>"
#    * Puedes usar 'valor if valor is not None else ...' y cortocircuitos con 'or'/'and'
# ---------------------------------------------------------------------
def valor_seguro(valor: Any) -> str:
    """
    >>> valor_seguro(None)
    'El valor es None (ausencia intencional de datos)'
    >>> valor_seguro(0)
    'El valor es falsy pero definido: 0'
    >>> valor_seguro(False)
    'El valor es falsy pero definido: False'
    >>> valor_seguro("Hola")
    'El valor es válido: Hola'
    """
    # TODO: Reemplazar por la implementación
    return ""


# ---------------------------------------------------------------------
# 7) convertir_cents_a_moneda (JS: convertirCentsAMoneda)
#    * Recibe centavos (int) y codigo_moneda ("USD"/"EUR"/"GBP")
#    * Validaciones:
#        - centavos int >= 0
#        - codigo válido
#    * Retornos:
#        - "$12.34" / "€0.50" / "£1.00"
#        - "Valor invalido" / "Codigo de moneda invalido"
# ---------------------------------------------------------------------
MONEDAS = {"USD": "$", "EUR": "€", "GBP": "£"}

def convertir_cents_a_moneda(centavos: Any, codigo_moneda: str) -> str:
    """
    >>> convertir_cents_a_moneda(1234, "USD")
    '$12.34'
    >>> convertir_cents_a_moneda(50, "EUR")
    '€0.50'
    >>> convertir_cents_a_moneda(-100, "GBP")
    'Valor invalido'
    >>> convertir_cents_a_moneda(200, "ABC")
    'Codigo de moneda invalido'
    """
    # TODO: Reemplazar por la implementación
    return ""


# ---------------------------------------------------------------------
# 8) comparar_objetos_por_stringify (JS: JSON.stringify)
#    * En Python podríamos usar '==' directamente para dicts, PERO
#      aquí replicamos la idea de "stringify ordenado":
#        json.dumps(obj, sort_keys=True)
# ---------------------------------------------------------------------
def comparar_objetos_por_stringify(obj1: Any, obj2: Any) -> bool:
    """
    Compara por JSON.stringify ordenado (sort_keys=True) para emular JS.

    >>> comparar_objetos_por_stringify({"a": 1, "b": 2}, {"b": 2, "a": 1})
    True
    >>> comparar_objetos_por_stringify({"a": 1}, {"a": 2})
    False
    """
    # TODO: Reemplazar por la implementación
    return False


# ---------------------------------------------------------------------
# Zona de pruebas manuales
# (equivalente a tus console.log de JS)
# ---------------------------------------------------------------------
if __name__ == "__main__":
    print("edad_en_dias(26) =>", edad_en_dias(26))

    print(cual_es_tu_nombre("Pao", "Persona"))

    print(checar_tipo(21, "int"))          # True
    print(checar_tipo("String", "number")) # False (en Python sería 'str' vs 'number')
    print(checar_tipo(21, "str"))          # False
    print(checar_tipo("21", "str"))        # True

    print(falsoso_verdadoso(False))
    print(falsoso_verdadoso(True))
    print(falsoso_verdadoso(0))
    print(falsoso_verdadoso(""))
    print(falsoso_verdadoso(None))
    print(falsoso_verdadoso(math.nan))  # ojo: NaN en truthiness se considera truthy en Python (no es falsy)

    print(division_segura(10, 2))
    print(division_segura(10, "Hola"))
    print(division_segura(10, 0))
    print(division_segura(float('nan'), 5))
    print(division_segura(100, 4))
    print(division_segura("20", 5))
    print(division_segura(50, None))

    print(valor_seguro(None))
    print(valor_seguro(0))
    print(valor_seguro(""))
    print(valor_seguro(False))
    print(valor_seguro(float('nan')))
    print(valor_seguro("Hola"))
    print(valor_seguro(42))
    print(valor_seguro({}))

    producto_uno         = {"id": 1, "title": "A", "precio": 100}
    producto_uno_ver_dos = {"title": "A", "precio": 100, "id": 1}
    producto_uno_ver_tres= {"id": 1, "title": "A", "precio": 101}

    print("Uno vs VerDos:", comparar_objetos_por_stringify(producto_uno, producto_uno_ver_dos))   # True
    print("Uno vs VerTres:", comparar_objetos_por_stringify(producto_uno, producto_uno_ver_tres)) # False
    print("VerDos vs VerTres:", comparar_objetos_por_stringify(producto_uno_ver_dos, producto_uno_ver_tres)) # False
