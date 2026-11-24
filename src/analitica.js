// Indicadores básicos de Café Origen, calculados con ciclos for...of.
// Ninguna función usa variables globales: todo llega por parámetro.

// Valor de una línea de venta: cantidad × precio unitario.
function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

// Patrón ACUMULADOR: suma el valor de todas las ventas.
// Arreglo vacío -> 0
function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
    total += valorVenta(venta);
  }
  return total;
}

// Patrón ACUMULADOR: suma las unidades vendidas.
// Arreglo vacío -> 0
function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    unidades += venta.cantidad;
  }
  return unidades;
}

// Patrón MÁXIMO: devuelve el registro completo con mayor valor.
// Arreglo vacío -> null (no existe una "venta mayor" que devolver).
// En caso de empate se conserva la primera (por eso se usa > y no >=).
function ventaMayor(ventas) {
  let mayor = null;
  for (const venta of ventas) {
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }
  return mayor;
}

// Patrones ACUMULADOR + CONTADOR: total / número de ventas válidas (cantidad > 0).
// Sin ventas válidas (arreglo vacío o solo cantidades 0) -> 0, para evitar 0/0 = NaN.
function ticketPromedio(ventas) {
  let total = 0;
  let validas = 0;
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
      validas++;
    }
  }
  if (validas === 0) {
    return 0;
  }
  return total / validas;
}

// Patrón ACUMULADOR con condición: total vendido en una ciudad.
// La comparación ignora mayúsculas y espacios sobrantes.
// Arreglo vacío o ciudad sin ventas -> 0
function ventasPorCiudad(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();
  let total = 0;
  for (const venta of ventas) {
    if (venta.ciudad.trim().toLowerCase() === ciudadBuscada) {
      total += valorVenta(venta);
    }
  }
  return total;
}

// ---------------------------------------------------------------
// MiniReto 3: versiones con métodos de arreglo, agrupaciones y rankings
// ---------------------------------------------------------------

// Normaliza el nombre de una ciudad: sin espacios sobrantes y con la
// primera letra de cada palabra en mayúscula ("medellín " -> "Medellín").
function normalizarCiudad(ciudad) {
  return ciudad
    .trim()
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

// Versión con métodos de totalVendido.
// map transforma cada venta en su valor; reduce los acumula (inicio en 0).
function totalVendidoM(ventas) {
  return ventas
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, valor) => acumulado + valor, 0);
}

// Versión con métodos de unidadesVendidas.
function unidadesVendidasM(ventas) {
  return ventas
    .map((venta) => venta.cantidad)
    .reduce((acumulado, cantidad) => acumulado + cantidad, 0);
}

// Versión con métodos de ventasPorCiudad.
// filter se queda con la ciudad buscada; map transforma a valor; reduce suma.
function ventasPorCiudadM(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();
  return ventas
    .filter((venta) => venta.ciudad.trim().toLowerCase() === ciudadBuscada)
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, valor) => acumulado + valor, 0);
}

// Agrupa por ciudad (nombre normalizado) y suma el valor vendido.
// Devuelve un objeto tipo diccionario: { Medellín: 356000, ... }
// Arreglo vacío -> {}
function totalPorCiudad(ventas) {
  return ventas.reduce((grupos, venta) => {
    const ciudad = normalizarCiudad(venta.ciudad);
    grupos[ciudad] = (grupos[ciudad] || 0) + valorVenta(venta);
    return grupos;
  }, {});
}

// Agrupa por producto y suma las unidades vendidas.
// Arreglo vacío -> {}
function unidadesPorProducto(ventas) {
  return ventas.reduce((grupos, venta) => {
    const producto = venta.producto.trim();
    grupos[producto] = (grupos[producto] || 0) + venta.cantidad;
    return grupos;
  }, {});
}

// Devuelve los k productos que más dinero generaron, de mayor a menor.
// Cada elemento tiene la forma { producto, valor }.
// k <= 0 o arreglo vacío -> []; si k supera la cantidad de productos, devuelve todos.
// No modifica el arreglo `ventas` ni ningún arreglo recibido.
function topProductosPorValor(ventas, k) {
  if (k <= 0) {
    return [];
  }

  const valorPorProducto = ventas.reduce((grupos, venta) => {
    const producto = venta.producto.trim();
    grupos[producto] = (grupos[producto] || 0) + valorVenta(venta);
    return grupos;
  }, {});

  const productos = Object.entries(valorPorProducto).map(([producto, valor]) => ({
    producto,
    valor,
  }));

  // [...productos] crea una copia: sort modifica el arreglo sobre el que se llama.
  return [...productos].sort((a, b) => b.valor - a.valor).slice(0, k);
}

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  normalizarCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
};