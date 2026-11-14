// CONFIGURACIÓN DE WHATSAPP DE LA AGENCIA
// Reemplaza este número con el tuyo (código de país + número, sin el símbolo +)
//const TELEFONO_AGENCIA = "59176984810"; 

// BASE DE DATOS DE PAQUETES TURÍSTICOS
const paquetes = [
    {
        id: 1,
        titulo: "Aventura en la Amazonía y Pampas",
        descripcion: "Navega por ríos rodeados de fauna silvestre, avistamiento de delfines rosados y caminatas guiadas.",
        duracion: "3 Días / 2 Noches",
        precio: 280,
        imagen: "https://unsplash.com",
        fechas: ["15 de Diciembre, 2026", "10 de Enero, 2027", "22 de Febrero, 2027"]
    },
    {
        id: 2,
        titulo: "Expedición Salar y Lagunas de Colores",
        descripcion: "Recorre el desierto de sal más grande del mundo, visita la Isla Incahuasi y duerme bajo las estrellas.",
        duracion: "4 Días / 3 Noches",
        precio: 350,
        imagen: "https://unsplash.com",
        fechas: ["20 de Diciembre, 2026", "05 de Enero, 2027", "14 de Febrero, 2027"]
    },
    {
        id: 3,
        titulo: "Paraíso Tropical Caribeño Todo Incluido",
        descripcion: "Playas de arena blanca, snorkel en arrecifes de coral, traslados y alimentación completa frente al mar.",
        duracion: "5 Días / 4 Noches",
        precio: 620,
        imagen: "https://unsplash.com",
        fechas: ["28 de Diciembre, 2026", "18 de Enero, 2027", "01 de Marzo, 2027"]
    }
];

// 1. EFECTO DE TEXTO EN EL HERO (MÁQUINA DE ESCRIBIR)
const palabras = ["nuevos destinos", "la naturaleza", "tu próxima aventura", "culturas únicas"];
let indicePalabra = 0;
let indiceLetra = 0;
let borrando = false;
const elementoTexto = document.getElementById("efecto-texto");

function animarTexto() {
    const palabraActual = palabras[indicePalabra];
    
    if (borrando) {
        elementoTexto.textContent = palabraActual.substring(0, indiceLetra - 1);
        indiceLetra--;
    } else {
        elementoTexto.textContent = palabraActual.substring(0, indiceLetra + 1);
        indiceLetra++;
    }

    let velocidad = borrando ? 60 : 120;

    if (!borrando && indiceLetra === palabraActual.length) {
        velocidad = 1800; // Pausa al completar la palabra
        borrando = true;
    } else if (borrando && indiceLetra === 0) {
        borrando = false;
        indicePalabra = (indicePalabra + 1) % palabras.length;
        velocidad = 400;
    }

    setTimeout(animarTexto, velocidad);
}

// 2. RENDERIZAR PAQUETES EN LA PÁGINA
const contenedorPaquetes = document.getElementById("lista-paquetes");

function cargarPaquetes() {
    paquetes.forEach(paquete => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-paquete");

        tarjeta.innerHTML = `
            <div class="contenedor-img">
                <img src="${paquete.imagen}" alt="${paquete.titulo}">
                <span class="etiqueta-duracion"><i class="far fa-clock"></i> ${paquete.duracion}</span>
            </div>
            <div class="info-paquete">
                <h3>${paquete.titulo}</h3>
                <p>${paquete.descripcion}</p>
                <div class="fechas-badge">
                    <i class="far fa-calendar-alt"></i> Próxima salida: ${paquete.fechas[0]}
                </div>
                <div class="pie-tarjeta">
                    <div class="precio">$${paquete.precio} <span>USD / pers.</span></div>
                    <button class="btn-reservar" onclick="abrirModal(${paquete.id})">Reservar</button>
                </div>
            </div>
        `;
        contenedorPaquetes.appendChild(tarjeta);
    });

    activarAnimacionScroll();
}

// 3. EFECTO DE APARICIÓN DE IMÁGENES Y TARJETAS AL HACER SCROLL
function activarAnimacionScroll() {
    const tarjetas = document.querySelectorAll(".tarjeta-paquete");
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
            }
        });
    }, { threshold: 0.15 });

    tarjetas.forEach(tarjeta => observador.observe(tarjeta));
}

// 4. LÓGICA DEL SISTEMA DE RESERVAS Y WHATSAPP
const modal = document.getElementById("modal-reserva");
const cerrarBtn = document.querySelector(".cerrar-modal");
const formReserva = document.getElementById("form-reserva");
const selectFecha = document.getElementById("fecha-viaje");
const inputPersonas = document.getElementById("cantidad-personas");
const spanTotal = document.getElementById("precio-total");

let paqueteActual = null;

function abrirModal(id) {
    paqueteActual = paquetes.find(p => p.id === id);
    if (!paqueteActual) return;

    document.getElementById("modal-titulo-paquete").textContent = paqueteActual.titulo;
    
    // Llenar fechas disponibles
    selectFecha.innerHTML = "";
    paqueteActual.fechas.forEach(fecha => {
        const opcion = document.createElement("option");
        opcion.value = fecha;
        opcion.textContent = fecha;
        selectFecha.appendChild(opcion);
    });

    inputPersonas.value = 1;
    actualizarTotal();
    modal.style.display = "flex";
}

function actualizarTotal() {
    if (!paqueteActual) return;
    const cantidad = parseInt(inputPersonas.value) || 1;
    const total = paqueteActual.precio * cantidad;
    spanTotal.textContent = `$${total} USD`;
}

inputPersonas.addEventListener("input", actualizarTotal);

cerrarBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Enviar datos a WhatsApp
formReserva.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre-cliente").value;
    const fecha = selectFecha.value;
    const personas = inputPersonas.value;
    const total = paqueteActual.precio * personas;

    const mensaje = `Hola *Explora Mundo*, quiero confirmar una reserva:%0A%0A` +
                    `*Paquete:* ${paqueteActual.titulo}%0A` +
                    `*Cliente:* ${nombre}%0A` +
                    `*Fecha elegida:* ${fecha}%0A` +
                    `*Personas:* ${personas}%0A` +
                    `*Total estimado:* $${total} USD%0A%0A` +
                    `¿Me confirman disponibilidad por favor?`;

    const urlWhatsApp = `https://wa.me/59176984810?text=${mensaje}`;
    window.open(urlWhatsApp, "_blank");
    modal.style.display = "none";
});

// Iniciar funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    animarTexto();
    cargarPaquetes();
});
