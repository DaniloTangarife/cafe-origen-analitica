const assert = require("assert");
const { ventas } = require("./datos");
const {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
} = require("./analitica");

const unaVenta = [ventas[4]]; // id 5: 3 × 45000 = 135000
const unaVentaCero = [ventas[7]]; // id 8: cantidad 0
const vacio = [];

console.log("=== Arreglo completo (12 ventas) ===");
console.log("totalVendido:", totalVendido(ventas));
console.log("unidadesVendidas:", unidadesVendidas(ventas));
console.log("ventaMayor:", ventaMayor(ventas));
console.log("ticketPromedio:", ticketPromedio(ventas));
console.log("ventasPorCiudad Medellín:", ventasPorCiudad(ventas, "Medellín"));
console.log("ventasPorCiudad ' BOGOTÁ ':", ventasPorCiudad(ventas, " BOGOTÁ "));

console.log("\n=== Un solo elemento (id 5) ===");
console.log("totalVendido:", totalVendido(unaVenta));
console.log("unidadesVendidas:", unidadesVendidas(unaVenta));
console.log("ventaMayor:", ventaMayor(unaVenta));
console.log("ticketPromedio:", ticketPromedio(unaVenta));
console.log("ventasPorCiudad Medellín:", ventasPorCiudad(unaVenta, "Medellín"));

console.log("\n=== Un solo elemento con cantidad 0 (id 8) ===");
console.log("ticketPromedio:", ticketPromedio(unaVentaCero));

console.log("\n=== Arreglo vacío ===");
console.log("totalVendido:", totalVendido(vacio));
console.log("unidadesVendidas:", unidadesVendidas(vacio));
console.log("ventaMayor:", ventaMayor(vacio));
console.log("ticketPromedio:", ticketPromedio(vacio));
console.log("ventasPorCiudad Medellín:", ventasPorCiudad(vacio, "Medellín"));

// Verificaciones automáticas (lanzan error si algo no coincide)
assert.strictEqual(valorVenta(ventas[0]), 84000);
assert.strictEqual(totalVendido(ventas), 985000);
assert.strictEqual(unidadesVendidas(ventas), 21);
assert.strictEqual(ventaMayor(ventas).id, 10);
assert.strictEqual(ticketPromedio(ventas), 985000 / 11);
assert.strictEqual(ventasPorCiudad(ventas, "Medellín"), 356000);
assert.strictEqual(ventasPorCiudad(ventas, "  MEDELLÍN "), 356000);

assert.strictEqual(totalVendido(unaVenta), 135000);
assert.strictEqual(ventaMayor(unaVenta).id, 5);
assert.strictEqual(ticketPromedio(unaVentaCero), 0);

assert.strictEqual(totalVendido(vacio), 0);
assert.strictEqual(unidadesVendidas(vacio), 0);
assert.strictEqual(ventaMayor(vacio), null);
assert.strictEqual(ticketPromedio(vacio), 0);
assert.strictEqual(ventasPorCiudad(vacio, "Medellín"), 0);

console.log("\n✔ Todas las verificaciones pasaron");