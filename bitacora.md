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

2. **Cantidad igual a 0 (id 8):** una venta con cantidad 0 no representa una venta real (no se vendió nada). Podría ser un pedido cancelado o un error de digitación.
   **Decisión:** excluir los registros con `cantidad <= 0` de los cálculos de ingresos y de unidades vendidas, y dejar registrada esta exclusión en los reportes.

3. **Clientes repetidos y sin nombre (C01, C02, C03):** el mismo cliente aparece en varias ventas, y el dato es solo un código sin información adicional. Contar registros no es lo mismo que contar clientes distintos.
   **Decisión:** para "cuántos clientes hay" se contarán códigos únicos, no registros. Para "cuántas ventas hay", se contarán registros.

4. **Posible venta duplicada (ids 1 y 4):** mismo cliente, producto y ciudad en días consecutivos, con distinta cantidad (2 y 1). Parece una compra repetida y no un duplicado, pero no se puede confirmar con estos datos.
   **Decisión:** se tratan como ventas distintas, porque tienen `id` y fecha diferentes.

5. **Fecha como texto:** `fecha` es un string, así que no se puede operar directamente como fecha.
   **Decisión:** al tratarla se convertirá con `new Date()` si se necesita comparar o agrupar por periodos. El formato `AAAA-MM-DD` permite ordenar alfabéticamente.