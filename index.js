// Importación de Módulos
const http = require("http");
const url = require("url");
const fs = require("fs");
const PORT = 8080;

// 1.- Crear un servidor en Node con el módulo http.

http
  .createServer((req, res) => {
    //Constantes para obtener info desde la interface HTML
    const params = url.parse(req.url, true).query;
    const archivo = params.archivo;
    const contenido = params.contenido;
    const nombre = params.nombre;
    const nuevoNombre = params.nuevoNombre;

    // Agrega la fecha actual al comienzo del contenido de cada archivo creado en formato
    let dia = new Date().getDate();
    let mes = new Date().getMonth() + 1;
    let nuevoDia = "0";
    let nuevoMes = "0";
    // concatenamos un "0" a la izquierda si el DIA o MES < 10
    if (dia < 10) {
      nuevoDia = nuevoDia.concat(dia);
    } else {
      nuevoDia = dia;
    }
    if (mes < 10) {
      nuevoMes = nuevoMes.concat(mes);
    } else {
      nuevoMes = mes;
    }

    let today = `${nuevoDia}/${nuevoMes}/${new Date().getFullYear()}`;

    // 2.- Disponibilizar una ruta para crear un archivo a partir de los parámetros de la consulta recibida.
    if (req.url.includes("/crear")) {
      // Devolver un mensaje con el resultado de la operación
      fs.writeFile(`${archivo}.txt`, `Fecha: ${today}\n Contenido: ${contenido}`, () => {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write(`Con fecha ${today} el Archivo <strong>${archivo}.txt</strong> ha sido creado exitosamente ;)`);
        res.end();
      });
    // 3. Disponibilizar una ruta para devolver el contenido de un archivo cuyo nombre es declarado en los parámetros de la consulta recibida.
    } else if (req.url.includes("/leer")) {
      fs.readFile(`${archivo}.txt`, (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
        res.write(`El contenido del texto <strong>${archivo}.txt</strong> con ${data}`);
        res.end();
      });
    // 4. Disponibilizar una ruta para renombrar un archivo, cuyo nombre y nuevo nombre es declarado en los parámetros de la consulta recibida.
    } else if (req.url.includes("/renombrar")) {
      fs.rename(`${nombre}.txt`, `${nuevoNombre}.txt`, (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
        res.write(`El archivo <strong>${nombre}.txt</strong> ha sido renombrado como <strong>${nuevoNombre}.txt</strong>.`);
        res.end();
      });
    // 5. Disponibilizar una ruta para eliminar un archivo, cuyo nombre es declarado en los parámetros de la consulta recibida.
    } else if (req.url.includes("/eliminar")) {
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
      fs.unlink(`${archivo}.txt`, (err, data) => {
        res.write(`Tu solicitud para eliminar el archivo <strong>${archivo}.txt</strong> se está procesando...<br>`);
        setTimeout(() => {
          res.write(`Archivo <strong>${archivo}.txt</strong> ha sido eliminado con éxito!!`);
          res.end();
        }, 3000);
      });
    } else {
      res.end();
    }
  })
  .listen(PORT, () => console.log("Escuchando el puerto " + PORT));
