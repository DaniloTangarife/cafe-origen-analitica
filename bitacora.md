# Bitácora: Café Origen Analítica

## Diccionario de datos

Cada registro representa **una línea de venta**: un cliente compra cierta cantidad de un producto en una fecha y ciudad.

| Propiedad | Tipo | Significado |
|-----------|------|-------------|
| `id` | number (entero) | Identificador único y consecutivo de la venta. |
| `fecha` | string (formato `AAAA-MM-DD`) | Fecha en que se hizo la venta. Se guarda como texto, no como `Date`. |
| `cliente` | string | Código anónimo del cliente (ej. `C01`). Un mismo cliente puede aparecer en varias ventas. |
| `producto` | string | Nombre del producto vendido. Incluye la presentación cuando aplica (ej. "Origen Huila 500 g"). |
| `ciudad` | string | Ciudad donde se realizó la venta. |
| `cantidad` | number (entero) | Unidades vendidas en esa línea. |
| `precio` | number (entero, COP) | Precio por unidad del producto, en pesos colombianos. El total de la línea sería `cantidad * precio`. |

## Casos borde detectados

1. **Ciudad con mayúsculas inconsistentes (id 5):** aparece como `medellín` en minúscula, mientras los demás registros usan `Medellín`. Si se agrupa por ciudad sin corregir, se contaría como una ciudad distinta.
   **Decisión:** normalizar el texto de la ciudad (por ejemplo, la primera letra en mayúscula y el resto en minúscula) antes de agrupar. No se modifica el dato original en `datos.js`.
   id 5 además trae un espacio al final; se resuelve con trim().

2. **Cantidad igual a 0 (id 8):** una venta con cantidad 0 no representa una venta real (no se vendió nada). Podría ser un pedido cancelado o un error de digitación.
   **Decisión:** excluir los registros con `cantidad <= 0` de los cálculos de ingresos y de unidades vendidas, y dejar registrada esta exclusión en los reportes.

3. **Clientes repetidos y sin nombre (C01, C02, C03):** el mismo cliente aparece en varias ventas, y el dato es solo un código sin información adicional. Contar registros no es lo mismo que contar clientes distintos.
   **Decisión:** para "cuántos clientes hay" se contarán códigos únicos, no registros. Para "cuántas ventas hay", se contarán registros.

4. **Posible venta duplicada (ids 1 y 4):** mismo cliente, producto y ciudad en días consecutivos, con distinta cantidad (2 y 1). Parece una compra repetida y no un duplicado, pero no se puede confirmar con estos datos.
   **Decisión:** se tratan como ventas distintas, porque tienen `id` y fecha diferentes.

5. **Fecha como texto:** `fecha` es un string, así que no se puede operar directamente como fecha.
   **Decisión:** al tratarla se convertirá con `new Date()` si se necesita comparar o agrupar por periodos. El formato `AAAA-MM-DD` permite ordenar alfabéticamente.

---

# MiniReto 2: Indicadores con ciclos

## Plan en pseudocódigo

**valorVenta(venta)**
```
devolver venta.cantidad * venta.precio
```

**totalVendido(ventas)**
```
total = 0                      (inicio en 0: elemento neutro de la suma)
para cada venta en ventas:     (recorro todas las ventas)
    total = total + valorVenta(venta)
devolver total
```

**unidadesVendidas(ventas)**
```
unidades = 0
para cada venta en ventas:
    unidades = unidades + venta.cantidad
devolver unidades
```

**ventaMayor(ventas)**
```
mayor = null                   (todavía no hay ninguna candidata)
para cada venta en ventas:
    si mayor es null  O  valorVenta(venta) > valorVenta(mayor):
        mayor = venta          (guardo el registro completo, no solo el valor)
devolver mayor
```

**ticketPromedio(ventas)**
```
total = 0
validas = 0                    (contador de ventas con cantidad > 0)
para cada venta en ventas:
    si venta.cantidad > 0:
        total = total + valorVenta(venta)
        validas = validas + 1
si validas es 0: devolver 0    (evita dividir 0 / 0)
devolver total / validas
```

**ventasPorCiudad(ventas, ciudad)**
```
ciudadBuscada = ciudad sin espacios sobrantes y en minúscula
total = 0
para cada venta en ventas:
    si venta.ciudad (sin espacios, en minúscula) == ciudadBuscada:
        total = total + valorVenta(venta)
devolver total
```

## Decisiones con el arreglo vacío

| Función | Devuelve con `[]` | Por qué |
|---|---|---|
| `totalVendido` | `0` | Sin ventas no se vendió nada; 0 es el valor inicial del acumulador. |
| `unidadesVendidas` | `0` | Igual que el anterior. |
| `ventaMayor` | `null` | No existe un registro que devolver; `null` indica "no hay resultado". |
| `ticketPromedio` | `0` | Con 0 ventas válidas se dividiría 0 / 0 (`NaN`). Se devuelve 0 de forma explícita. |
| `ventasPorCiudad` | `0` | Una ciudad sin ventas suma 0. |

Otras decisiones:
- Con empate en el máximo se conserva la **primera** venta encontrada (se usa `>` y no `>=`).
- `ticketPromedio` divide entre las ventas **válidas** (cantidad > 0), por eso el id 8 no cuenta.
- `ventasPorCiudad` normaliza con `trim()` y `toLowerCase()`, así "medellín " y "Medellín" cuentan como la misma ciudad. Las tildes no se tocan.

## Traza manual 1: totalVendido (muestra completa)

| Iteración | id | cantidad × precio | valorVenta | total acumulado |
|---|---|---|---|---|
| inicio | n/a | n/a | n/a | 0 |
| 1 | 1 | 2 × 42000 | 84000 | 84000 |
| 2 | 2 | 1 × 26000 | 26000 | 110000 |
| 3 | 3 | 1 × 95000 | 95000 | 205000 |
| 4 | 4 | 1 × 42000 | 42000 | 247000 |
| 5 | 5 | 3 × 45000 | 135000 | 382000 |
| 6 | 6 | 2 × 26000 | 52000 | 434000 |
| 7 | 7 | 1 × 120000 | 120000 | 554000 |
| 8 | 8 | 0 × 42000 | 0 | 554000 |
| 9 | 9 | 2 × 45000 | 90000 | 644000 |
| 10 | 10 | 4 × 42000 | 168000 | 812000 |
| 11 | 11 | 1 × 95000 | 95000 | 907000 |
| 12 | 12 | 3 × 26000 | 78000 | 985000 |

Resultado a mano: **985000**. Resultado del programa: **985000**. ✔

## Traza manual 2: ventaMayor (muestra completa)

| Iteración | id | valorVenta | ¿supera al mayor actual? | mayor después |
|---|---|---|---|---|
| inicio | n/a | n/a | n/a | null |
| 1 | 1 | 84000 | sí (mayor era null) | id 1 (84000) |
| 2 | 2 | 26000 | no | id 1 |
| 3 | 3 | 95000 | sí | id 3 (95000) |
| 4 | 4 | 42000 | no | id 3 |
| 5 | 5 | 135000 | sí | id 5 (135000) |
| 6 | 6 | 52000 | no | id 5 |
| 7 | 7 | 120000 | no | id 5 |
| 8 | 8 | 0 | no | id 5 |
| 9 | 9 | 90000 | no | id 5 |
| 10 | 10 | 168000 | sí | id 10 (168000) |
| 11 | 11 | 95000 | no | id 10 |
| 12 | 12 | 78000 | no | id 10 |

Resultado a mano: **registro id 10 (168000)**. Resultado del programa: **id 10**. ✔

## Verificación adicional (cálculo a mano)

- Ticket promedio: 985000 / 11 ventas válidas (12 menos el id 8) ≈ **89545,45**.
- Medellín: ids 1, 4, 5 y 11 → 84000 + 42000 + 135000 + 95000 = **356000**.
- Unidades: 2+1+1+1+3+2+1+0+2+4+1+3 = **21**.

---

# MiniReto 3: Métodos de arreglo, agrupaciones y rankings

## Las cinco preguntas sobre colecciones, por función

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
|---|---|---|---|---|---|
| `totalVendidoM` | Todas las ventas | Nada | Cada venta en su valor (`map` con `valorVenta`) | La suma de valores (`reduce`, inicio 0) | No agrupa |
| `unidadesVendidasM` | Todas las ventas | Nada | Cada venta en su cantidad (`map`) | La suma de cantidades (`reduce`, inicio 0) | No agrupa |
| `ventasPorCiudadM` | Todas las ventas | Solo las de la ciudad buscada, normalizada con `trim()` y `toLowerCase()` (`filter`) | Cada venta filtrada en su valor (`map`) | La suma de valores (`reduce`, inicio 0) | No agrupa |
| `totalPorCiudad` | Todas las ventas | Nada | El nombre de la ciudad se normaliza (`normalizarCiudad`) y se calcula el valor de cada venta | El total de cada ciudad dentro de un objeto | Con un objeto diccionario: la clave es la ciudad normalizada |
| `unidadesPorProducto` | Todas las ventas | Nada | El nombre del producto se limpia con `trim()` | Las unidades de cada producto | Con un objeto diccionario: la clave es el producto |
| `topProductosPorValor` | Todas las ventas y luego las entradas del diccionario | Solo los primeros k del ranking (`slice`) | Cada entrada `[producto, valor]` en un objeto `{ producto, valor }` (`map` sobre `Object.entries`) | El valor generado por producto (`reduce`) | Por producto, y luego se ordena de mayor a menor (`sort` sobre una copia) |

## Decisiones de diseño

- **Normalización de ciudades:** `normalizarCiudad` aplica `trim()`, `toLowerCase()` y pone en mayúscula la primera letra de cada palabra. Así "medellín " y "Medellín" caen en la misma clave y el resultado muestra nombres legibles.
- **Reduce con valor inicial:** todos los `reduce` llevan valor inicial (`0` o `{}`), para que con el arreglo vacío devuelvan 0 o `{}` y no lancen error.
- **Ordenar sin modificar:** `sort` modifica el arreglo sobre el que se llama. Por eso se ordena `[...productos]`, una copia creada con el operador de propagación. El arreglo `ventas` conserva su orden original y `verificar.js` lo comprueba.
- **Comparador del `sort`:** `b.valor - a.valor` ordena de mayor a menor. Sin función de comparación, `sort` ordenaría como texto.
- **Casos borde de `topProductosPorValor`:** con `k <= 0` devuelve `[]`; con `k` mayor que la cantidad de productos devuelve todos; con arreglo vacío devuelve `[]`.
- **Venta con cantidad 0 (id 8):** aporta 0 al valor y 0 a las unidades. El producto Origen Huila 500 g sigue contándose por las otras ventas, y Cali se mantiene como ciudad porque tiene ventas válidas.

## Resultados verificados

- `totalPorCiudad`: Medellín 356000, Bogotá 276000, Cali 185000, Pereira 168000 → suman 985000, igual que `totalVendido`.
- `unidadesPorProducto`: 7 + 6 + 5 + 2 + 1 = 21, igual que `unidadesVendidas`.
- Top 3 por valor: Origen Huila 500 g (294000), Origen Sierra 500 g (225000), Prensa francesa (190000).
- `verificar.js`: todos los pares ciclo/método en OK.

---

# MiniReto 4: Reporte v0.1 y registro de depuración

## Error 1: Bogotá aparece dos veces

| Campo | Detalle |
|---|---|
| **Síntoma** | En el reporte de ventas por ciudad, "Bogotá" aparecía en dos filas con totales parciales distintos. |
| **Entrada que lo produce** | Un registro con `ciudad: "Bogotá "` (espacio al final) junto a los registros con `"Bogotá"`. En la muestra el mismo problema ocurre con `"medellín "` frente a `"Medellín"`. Se reproduce con `node src/depurar.js`. |
| **Hipótesis** | El agrupamiento usa el texto de la ciudad tal cual como clave del objeto. Las claves `"Bogotá"` y `"Bogotá "` son strings distintos, aunque se vean iguales en pantalla. |
| **Prueba realizada** | Se imprimieron las claves con `JSON.stringify`: aparecieron `"Bogotá"` y `"Bogotá "`, con el espacio visible dentro de las comillas. También se contó `Object.keys(...).length`: la versión preliminar dio más de 4 grupos. |
| **Causa** | La clave del diccionario se tomaba de `venta.ciudad` sin `trim()` ni normalización de mayúsculas. |
| **Corrección** | `totalPorCiudad` usa `normalizarCiudad` (`trim()`, `toLowerCase()` y primera letra en mayúscula) para construir la clave. Comprobación: con el registro extra devuelve exactamente 4 ciudades y Bogotá suma 396.000, que es 276.000 más los 120.000 del registro extra. Con la muestra original suma 276.000. |

## Error 2: ticket promedio NaN en un día sin ventas

| Campo | Detalle |
|---|---|
| **Síntoma** | Al filtrar un día sin ventas, el ticket promedio mostraba `NaN`. |
| **Entrada que lo produce** | Un arreglo vacío, por ejemplo las ventas del `2026-09-07`, fecha que no existe en la muestra. |
| **Hipótesis** | La función divide el total entre la cantidad de ventas. Con 0 ventas la operación es 0 / 0, que en JavaScript da `NaN`. |
| **Prueba realizada** | Se imprimieron el total (0) y `length` (0), y se ejecutó `0 / 0` en la consola: dio `NaN`. Se confirmó con `Number.isNaN` en `depurar.js`. |
| **Causa** | La versión preliminar no verificaba que hubiera ventas antes de dividir. Además dividía entre `length` en lugar de entre las ventas válidas (cantidad > 0). |
| **Corrección** | `ticketPromedio` cuenta las ventas válidas y, si son 0, devuelve 0 antes de dividir. `ventasDelDia` la reutiliza y muestra el resultado como `$ 0` con un mensaje claro de "sin ventas". |

## Decisiones del reporte v0.1

- Los valores se formatean como pesos colombianos con `toLocaleString("es-CO")`, redondeados a pesos enteros. Por eso el ticket promedio 89.545,45 se muestra como `$ 89.545`.
- Las secciones se alinean con `padEnd` y `padStart`, y los títulos usan líneas de `=`.
- Las ciudades y los productos se muestran ordenados de mayor a menor, sobre una copia (`[...]`) para no modificar los datos.
- `ventasDelDia` devuelve siempre un objeto completo. Con un día sin ventas devuelve ceros y `ventaMayor: null`, y el reporte lo muestra como "Sin ventas".
- `ventasValidas` cuenta solo las ventas con cantidad > 0, para que sea coherente con el divisor del ticket promedio.

## Verificación final

- `node src/reporte.js` muestra las cuatro secciones y el resumen de dos días sin errores, sin `NaN`, sin `undefined` y con 4 ciudades sin duplicados.
- `node src/verificar.js` muestra todos los pares en OK.
- `node src/depurar.js` reproduce los dos errores en la versión preliminar y confirma que no aparecen en la v0.1.