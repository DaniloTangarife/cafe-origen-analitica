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

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
};