CERCANÍAS - SITIO WEB DE TURISMO LOCAL

Abrí index.html en un navegador moderno. Para probarlo como sitio, también podés usar Live Server desde Visual Studio Code.

PÁGINAS
- index.html: inicio y accesos principales.
- lugares.html: guía turística con fotografías reales de Marcos Paz, filtros y enlaces a fuentes.
- comercios.html: listado inicial de comercios con datos del directorio municipal.
- eventos.html: sección de agenda local preparada para futuras publicaciones.
- mapa.html: mapa Leaflet + OpenStreetMap con puntos turísticos y comercios orientativos.
- experiencia.html: planificador inicial de recorridos mediante reglas simples.
- reservas.html: demostración de solicitudes de reserva guardadas en el navegador.
- pagos.html: pantalla demostrativa; no procesa pagos.

DISEÑO Y TECNOLOGÍAS
HTML5, CSS3, JavaScript, Leaflet y OpenStreetMap. Identidad visual: blanco, rojo #B92929, verde #13B768 y gris #D9D9D9. El logo se utiliza en el encabezado y como favicon.

IMPORTANTE
Este proyecto sigue siendo un prototipo frontend. Las reservas no llegan a los establecimientos: se guardan solo en el navegador actual mediante localStorage. El mapa contiene ubicaciones aproximadas. Los horarios, accesos y actividad comercial deben verificarse. Las fotografías reales se cargan desde servidores municipales/locales externos y requieren conexión a internet.

Para convertirlo en una plataforma real faltan backend, base de datos, autenticación, paneles para comercios, moderación de reseñas/eventos, disponibilidad de reservas y pagos integrados mediante un proveedor seguro (por ejemplo Mercado Pago). No almacenar datos de tarjetas en el sitio.

Ver FUENTES_Y_ESTADO.txt para créditos de fotografías, fuentes del directorio y estado detallado de cada función.

ACTUALIZACIÓN DE FUNCIONES (noviembre 2026)
- Se agregaron comercios gastronómicos de Merlo, Buenos Aires, y espacios culturales/museos de Merlo.
- Cada ficha incorpora accesos a indicaciones de Google Maps y búsquedas de Instagram/Facebook.
- Se añadió permiso opcional de ubicación del navegador. Al autorizarlo, el origen se agrega a las indicaciones de Google Maps para consultar distancia y tiempo de viaje.
- Se agregó un módulo de opiniones y calificaciones.
- Se agregó un formulario de actualización de fichas comerciales.

IMPORTANTE SOBRE ESTA VERSIÓN DEMOSTRATIVA
Las opiniones y modificaciones se guardan en localStorage, únicamente en el navegador y dispositivo usados. No se publican para otros visitantes ni existe todavía inicio de sesión por comercio. Para habilitar cuentas reales, edición segura y publicación compartida hace falta un backend, base de datos, autenticación y moderación. Las redes sociales se ofrecen como búsquedas por nombre cuando no se pudo verificar un perfil oficial. Los comercios y lugares deben confirmar sus datos antes de publicar.

FUENTES CONSULTADAS PARA LAS NUEVAS FICHAS
- Municipalidad de Merlo (Buenos Aires), Espacios Culturales: https://www.merlo.gob.ar/espaciosculturales/
- Directorio de restaurantes y comercios de Merlo, Buenos Aires: https://restaurantargentina.com/restaurantes/localidad/merlo/
- Fichas de negocios de Merlo, Buenos Aires: https://www.google.com/maps


ACTUALIZACIÓN: CUENTAS Y PROMOCIÓN LOCAL
- acceso.html permite crear cuenta como usuario/visitante o comerciante e iniciar sesión.
- cuenta.html muestra el área básica de usuario.
- panel-comerciante.html permite editar la ficha del negocio y solicitar aparecer en destacados.
- Los usuarios registrados pueden publicar opiniones y calificaciones.
- La sección “Comercios para descubrir” muestra una vidriera ilustrativa de promoción para negocios locales. Se aclara que los comercios listados no necesariamente contrataron publicidad ni confirmaron afiliación.
- IMPORTANTE: esta es una demostración front-end. Las cuentas, perfiles y opiniones se guardan en el navegador local. No hay servidor, base de datos compartida, verificación de identidad ni seguridad suficiente para uso comercial real. No usar contraseñas reutilizadas. Para producción hay que implementar autenticación y almacenamiento en backend, recuperación de contraseña, autorización por roles, moderación de reseñas y aprobación de comercios destacados.
