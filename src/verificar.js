const { ventas } = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
} = require("./analitica");

const idsOriginales = ventas.map((venta) => venta.id).join(",");

const unaVenta = [ventas[4]];
const vacio = [];

function comparar(nombre, resultadoCiclo, resultadoMetodo) {
  const estado = resultadoCiclo === resultadoMetodo ? "OK" : "DIFERENTE";
  console.log(
    `${estado.padEnd(10)} ${nombre} (ciclo: ${resultadoCiclo} | método: ${resultadoMetodo})`
  );
}

const conjuntos = [
  ["completo", ventas],
  ["un elemento", unaVenta],
  ["vacío", vacio],
];

console.log("=== Ciclo vs. métodos ===");
for (const [etiqueta, datos] of conjuntos) {
  comparar(`totalVendido [${etiqueta}]`, totalVendido(datos), totalVendidoM(datos));
  comparar(
    `unidadesVendidas [${etiqueta}]`,
    unidadesVendidas(datos),
    unidadesVendidasM(datos)
  );
  for (const ciudad of ["Medellín", " BOGOTÁ ", "cali", "Pereira", "Barranquilla"]) {
    comparar(
      `ventasPorCiudad "${ciudad}" [${etiqueta}]`,
      ventasPorCiudad(datos, ciudad),
      ventasPorCiudadM(datos, ciudad)
    );
  }
}

console.log("\n=== Agrupaciones y rankings ===");
const porCiudad = totalPorCiudad(ventas);
console.log("totalPorCiudad:", porCiudad);
console.log("Ciudades distintas:", Object.keys(porCiudad).length, "(esperado: 4)");
console.log("unidadesPorProducto:", unidadesPorProducto(ventas));
console.log("topProductosPorValor(ventas, 3):", topProductosPorValor(ventas, 3));
console.log("topProductosPorValor([], 3):", topProductosPorValor(vacio, 3));
console.log("topProductosPorValor(ventas, 0):", topProductosPorValor(ventas, 0));

console.log("\n=== El arreglo original no cambió ===");
const idsFinales = ventas.map((venta) => venta.id).join(",");
console.log(idsOriginales === idsFinales ? "OK" : "DIFERENTE", "->", idsFinales);