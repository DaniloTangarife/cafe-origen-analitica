const assert = require("assert");
const { ventas } = require("./datos");
const { totalPorCiudad, ventasDelDia } = require("./analitica");

// ---------- Versión preliminar (la del compañero): contiene los dos errores ----------

function totalPorCiudadPreliminar(listaVentas) {
  const grupos = {};
  for (const venta of listaVentas) {
    const ciudad = venta.ciudad; // sin normalizar
    grupos[ciudad] = (grupos[ciudad] || 0) + venta.cantidad * venta.precio;
  }
  return grupos;
}

function ticketPromedioPreliminar(listaVentas) {
  let total = 0;
  for (const venta of listaVentas) {
    total += venta.cantidad * venta.precio;
  }
  return total / listaVentas.length; // 0 / 0 si la lista está vacía
}

// ---------- Error 1: "Bogotá aparecía dos veces" ----------

console.log("=== ERROR 1: ciudad duplicada ===");

// Entrada que lo produce: una venta con "Bogotá " (espacio al final)
const ventasConBogotaConEspacio = [
  ...ventas,
  {
    id: 13,
    fecha: "2026-09-06",
    cliente: "C09",
    producto: "Molino manual",
    ciudad: "Bogotá ",
    cantidad: 1,
    precio: 120000,
  },
];

const gruposPreliminar = totalPorCiudadPreliminar(ventasConBogotaConEspacio);
console.log("Versión preliminar:", gruposPreliminar);

// Prueba de la hipótesis: las claves no son iguales aunque se vean iguales
console.log(
  "Claves entre comillas:",
  Object.keys(gruposPreliminar).map((clave) => JSON.stringify(clave))
);

const gruposCorregido = totalPorCiudad(ventasConBogotaConEspacio);
console.log("Versión corregida:", gruposCorregido);

assert.ok(Object.keys(gruposPreliminar).length > 4, "la preliminar debe duplicar grupos");
assert.strictEqual(Object.keys(gruposCorregido).length, 4);
assert.strictEqual(gruposCorregido["Bogotá"], 276000 + 120000);

// ---------- Error 2: "el ticket promedio daba NaN en un día sin ventas" ----------

console.log("\n=== ERROR 2: NaN en día sin ventas ===");

// Entrada que lo produce: filtrar una fecha que no existe en los datos
const delDiaSinVentas = ventas.filter((venta) => venta.fecha === "2026-09-07");
console.log("Registros del día:", delDiaSinVentas.length);

// Prueba de la hipótesis: división 0 / 0
console.log("Total del día:", 0, "| length:", delDiaSinVentas.length);
console.log("0 / 0 =", 0 / 0);
console.log("Versión preliminar:", ticketPromedioPreliminar(delDiaSinVentas));

const resumenCorregido = ventasDelDia(ventas, "2026-09-07");
console.log("Versión corregida:", resumenCorregido);

assert.ok(Number.isNaN(ticketPromedioPreliminar(delDiaSinVentas)));
assert.strictEqual(resumenCorregido.ticketPromedio, 0);
assert.strictEqual(resumenCorregido.total, 0);
assert.strictEqual(resumenCorregido.ventaMayor, null);

console.log("\n✔ Los dos errores se reproducen en la versión preliminar y no aparecen en la v0.1");