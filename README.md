# Café Origen: Motor de analítica v0.1

Proyecto de la ruta de algoritmia (Riwi). Es un motor de analítica en JavaScript (Node.js) que convierte el historial de ventas de Café Origen en un reporte legible por consola, sin necesidad de abrir el código.

## Qué preguntas responde

- ¿Cuánto se vendió en total y cuántas unidades salieron?
- ¿Cuál fue la venta más grande?
- ¿Cuánto gasta en promedio un cliente por compra (ticket promedio)?
- ¿Cuánto se vendió en cada ciudad?
- ¿Cuántas unidades se vendieron de cada producto?
- ¿Cuáles son los 3 productos que más dinero generaron?
- ¿Cómo le fue a la tienda en un día específico (incluyendo días sin ventas)?

## Cómo ejecutarlo

Requisito: Node.js (versión LTS). No necesita instalar dependencias.

```bash
git clone https://github.com/TU_USUARIO/cafe-origen-analitica.git
cd cafe-origen-analitica
node src/reporte.js
```

## Estructura

| Archivo | Para qué sirve |
|---|---|
| `src/datos.js` | Arreglo `ventas` con los 12 registros originales (con sus errores). |
| `src/analitica.js` | Funciones de análisis: con ciclos, con métodos de arreglo, agrupaciones y rankings. |
| `src/explorar.js` | Exploración inicial de los datos. |
| `src/probar.js` | Pruebas de los indicadores con arreglo completo, de un elemento y vacío. |
| `src/verificar.js` | Compara cada versión con ciclo contra su versión con métodos. |
| `src/depurar.js` | Reproduce los dos errores reportados y demuestra que están corregidos. |
| `src/reporte.js` | Reporte de negocio por consola. |
| `bitacora.md` | Diccionario de datos, casos borde, pseudocódigo, trazas y registro de depuración. |

## Otros comandos

```bash
node src/explorar.js   # estructura de los datos
node src/probar.js     # pruebas de los indicadores
node src/verificar.js  # ciclo vs. métodos (todo debe decir OK)
node src/depurar.js    # reproducción de los errores reportados
```

## Decisiones importantes

- Los datos originales no se modifican; la limpieza (espacios, mayúsculas, cantidad 0) se hace dentro de las funciones y está documentada en la bitácora.
- Con arreglos vacíos, las funciones devuelven `0`, `{}`, `[]` o `null`, nunca `NaN`.