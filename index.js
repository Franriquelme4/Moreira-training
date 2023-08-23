const { google } = require("googleapis");
const readline = require("readline");
var cron = require('node-cron');
const credentials = require("./moreira-training-49f2c4474d58.json");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const clientT = require('twilio')(accountSid, authToken);
// Configurar el cliente OAuth2 con las credenciales
const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  // Crear una instancia de Google Sheets API
  const sheets = google.sheets("v4");
  // ID de la hoja de cálculo y rango de celdas que deseas leer
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = process.env.RANGE;

// Cargar las credenciales desde el archivo JSON descargado


// Autenticarse y leer los datos
async function getData() {
  try {
    await client.authorize();
    const result = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });

    const rows = result.data.values.slice(1);

    const arrayDeObjetos = rows.map(item => {
        return {
          nombre: item[0],
          apellido: item[1],
          telefono: item[2],
          estado: item[3]
        };
      });

    // appendData();
    if (rows.length) {
      arrayDeObjetos.forEach((row) => {
        if(parseInt(row.estado) < 0){
            console.log("Enviando mensaje a: " + row.nombre + " " + row.apellido + " " + row.telefono);
            appendData(row.telefono);
            // sendMessage(row.telefono);
        }
      });
    } else {
      console.log("No se encontraron datos.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}



async function appendData(numeroTelefono) {
  var botId = "114116981783521";
  var phoneNbr = numeroTelefono;
  var bearerToken = "EAAPhE2ZAoehUBO44WRB3qqwm5wezZCZATSSdevNtZBqBlw4sIV7PTItpjjTOAfqmHouxMiZAlAAQW6wqfHB0n5kZArWexhJnGIZBrDIZC9lHXvddWJUM81IbJL6OD8s244JR8ihv6POUGQmaNiCJ8QcFdqItH6ZA0MUpGEifouZCCJlKB4khyIIuR16M2DciQxXbmmizEOJxT9zWAiRgUvycgZD";
  var url = "https://graph.facebook.com/v17.0/" + botId + "/messages";
  var data = {
    messaging_product: "whatsapp",
    to: phoneNbr,
    type: "template",
    template: {
      name: "hello_world",
      language: { code: "en_US" },
    },
  };
  var postReq = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + bearerToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    json: true,
  };
  fetch(url, postReq)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));
}

// async function sendMessage(numeroTelefono){  
//     clientT.messages
//           .create({
//              from: 'whatsapp:+14155238886',
//              body: 'Su cuota esta venciendo, por favor regularice su deuda.',
//              to: `whatsapp:+${numeroTelefono}`
//            })
//           .then(message => console.log(message.sid));
// }

// cron.schedule('0 * * * *', () => {
//     console.log('running a task every one hore');
//     getData();
//   });
  getData();