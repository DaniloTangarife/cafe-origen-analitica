const { ventas } = require("./datos");
const {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
} = require("./analitica");

const ANCHO = 54;
const ANCHO_ETIQUETA = 34;

// ---------- Utilidades de formato ----------

const pesos = (valor) => "$ " + Math.round(valor).toLocaleString("es-CO");

function titulo(texto) {
  console.log("\n" + "=".repeat(ANCHO));
  console.log(texto.toUpperCase());
  console.log("=".repeat(ANCHO));
}

function fila(etiqueta, valor) {
  console.log(
    `${etiqueta.padEnd(ANCHO_ETIQUETA)}${String(valor).padStart(ANCHO - ANCHO_ETIQUETA)}`
  );
}

// Convierte un diccionario en entradas ordenadas de mayor a menor valor.
// Se copia con [...] para no modificar el arreglo original.
function ordenarDescendente(diccionario) {
  return [...Object.entries(diccionario)].sort((a, b) => b[1] - a[1]);
}

function descripcionVentaMayor(venta) {
  if (venta === null) {
    return "Sin ventas";
  }
  return `#${venta.id} ${venta.producto} (${venta.ciudad.trim()})`;
}

function resumenDia(fecha) {
  const dia = ventasDelDia(ventas, fecha);
  console.log(`\nDía ${dia.fecha}`);
  console.log("-".repeat(ANCHO));

  if (dia.registros === 0) {
    console.log("No hubo ventas registradas en esta fecha.");
  }

  fila("Registros", dia.registros);
  fila("Ventas válidas", dia.ventasValidas);
  fila("Unidades vendidas", dia.unidades);
  fila("Total vendido", pesos(dia.total));
  fila("Ticket promedio", pesos(dia.ticketPromedio));
  fila(
    "Venta mayor",
    dia.ventaMayor === null ? "Sin ventas" : pesos(valorVenta(dia.ventaMayor))
  );
  if (dia.ventaMayor !== null) {
    console.log(`  ${descripcionVentaMayor(dia.ventaMayor)}`);
  }
}

// ---------- Reporte ----------

console.log("CAFÉ ORIGEN: REPORTE DE VENTAS v0.1");
console.log("Muestra: 1 al 6 de septiembre de 2026");

// 1. Resumen general
titulo("1. Resumen general");
const mayor = ventaMayor(ventas);
const ventasValidas = ventas.filter((venta) => venta.cantidad > 0).length;
fila("Registros", ventas.length);
fila("Ventas válidas (cantidad > 0)", ventasValidas);
fila("Unidades vendidas", unidadesVendidas(ventas));
fila("Total vendido", pesos(totalVendido(ventas)));
fila("Ticket promedio", pesos(ticketPromedio(ventas)));
fila("Venta mayor", mayor === null ? "Sin ventas" : pesos(valorVenta(mayor)));
if (mayor !== null) {
  console.log(`  ${descripcionVentaMayor(mayor)}`);
}

// 2. Ventas por ciudad
titulo("2. Ventas por ciudad");
for (const [ciudad, total] of ordenarDescendente(totalPorCiudad(ventas))) {
  fila(ciudad, pesos(total));
}

// 3. Unidades por producto
titulo("3. Unidades por producto");
for (const [producto, unidades] of ordenarDescendente(unidadesPorProducto(ventas))) {
  fila(producto, `${unidades} u.`);
}

// 4. Top 3 por valor
titulo("4. Top 3 productos por valor generado");
topProductosPorValor(ventas, 3).forEach((item, indice) => {
  fila(`${indice + 1}. ${item.producto}`, pesos(item.valor));
});

// Resumen por día
titulo("Resumen por día");
resumenDia("2026-09-05"); // día con ventas
resumenDia("2026-09-07"); // día sin ventas

console.log("\n" + "=".repeat(ANCHO));