// ===============================
// SIMULADOR CONVERSOR DE MONEDAS
// ===============================

// Array de monedas y sus valores (respecto al peso argentino)
const monedas = [
    { nombre: "Dólar", valor: 1000 },
    { nombre: "Euro", valor: 1100 },
    { nombre: "Real", valor: 200 },
    { nombre: "Peso chileno", valor: 1.2 }
];

// Función para mostrar menú de monedas
function mostrarMonedas() {
    let mensaje = "Seleccione una moneda:\n";

    for (let i = 0; i < monedas.length; i++) {
        mensaje += (i + 1) + " - " + monedas[i].nombre + "\n";
    }

    return mensaje;
}

// Función para convertir pesos a moneda extranjera
function convertirPesos(monto, moneda) {
    return monto / moneda.valor;
}

// Función para convertir moneda extranjera a pesos
function convertirAPesos(monto, moneda) {
    return monto * moneda.valor;
}

// Función principal del simulador
function iniciarSimulador() {
    let continuar = true;

    while (continuar) {
        let opcion = prompt(
            "CONVERSOR DE MONEDAS\n\n" +
            "1 - Pesos a moneda extranjera\n" +
            "2 - Moneda extranjera a pesos\n" +
            "3 - Salir"
        );

        if (opcion === "1") {
            let menuMonedas = mostrarMonedas();
            let seleccion = prompt(menuMonedas);

            let indice = seleccion - 1;

            if (indice >= 0 && indice < monedas.length) {
                let monto = prompt("Ingrese el monto en pesos argentinos:");

                let resultado = convertirPesos(monto, monedas[indice]);

                alert(
                    "Resultado:\n" +
                    monto + " pesos argentinos = " +
                    resultado.toFixed(2) + " " + monedas[indice].nombre
                );

                console.log("Conversión realizada:", monto, "pesos ->", resultado, monedas[indice].nombre);
            } else {
                alert("Opción de moneda inválida.");
            }

        } else if (opcion === "2") {
            let menuMonedas = mostrarMonedas();
            let seleccion = prompt(menuMonedas);

            let indice = seleccion - 1;

            if (indice >= 0 && indice < monedas.length) {
                let monto = prompt("Ingrese el monto en " + monedas[indice].nombre + ":");

                let resultado = convertirAPesos(monto, monedas[indice]);

                alert(
                    "Resultado:\n" +
                    monto + " " + monedas[indice].nombre +
                    " = " + resultado.toFixed(2) + " pesos argentinos"
                );

                console.log("Conversión realizada:", monto, monedas[indice].nombre, "->", resultado, "pesos");
            } else {
                alert("Opción de moneda inválida.");
            }

        } else if (opcion === "3") {
            alert("Gracias por usar el conversor de monedas.");
            continuar = false;
        } else {
            alert("Opción inválida. Intente nuevamente.");
        }

        if (continuar) {
            continuar = confirm("¿Desea realizar otra conversión?");
        }
    }
}

// Llamada a la función principal
iniciarSimulador();
