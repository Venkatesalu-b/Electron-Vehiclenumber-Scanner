const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;
const fs = require('fs');
const venki = require('fs').promises;
const path = require("path");

const vision = require('@google-cloud/vision');
const { log } = require('console');



const CREDENTIALS = JSON.parse(JSON.stringify({
  "type": "service_account",
  "project_id": "imagetext-364605",
  "private_key_id": "f0b48e383d61ffc64c4760bfe6ab3ed79ca41aa9",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsFIldLxmHwnxy\npVtTkAfrg+7yvlAi3PVWw7UX2Sgtk1WqHUWFohgZqc9s3a3fcvn87CanaU+Vt8Y0\nk+aTU6XdWoueyHNQgkH02uTUEfWvsmuGd7peNXUsRfd16a/V4ssrJleGXO7z0TFa\n9XCoZ6yaWitDRDAvh2djuASmtxOGz833VKP5dVvu8vrj6odnGMW1rABortd7o+xG\nYMXnDQ0nl6w5GDx2fbTMutRzu/O+VhMOWXb9TppFKq3aUhk1dUxnMfErHx5ti8Lk\nr7W9j23Zu6BDW4NPkA02hPFYOQXEank7at1KPCqSLUJELsV7/PglAsXX4yUr9yR+\nLowh5qoFAgMBAAECggEAKMkcTrELas1KvEybgwiMDAMDB1davIyk/LnZqgufFYBK\niU2zTOtgrXJ9VqcLHz9L56ncNolEIu8CJDOa7rfghADCP3HwvPgGpH+eRXJ1Sj2u\ndRpbGpmuij4SG0k2UypUL8fAbnkH7NOcEFxEpbGe7B2ri9+1UQqVk4HJ3m7dirHB\nzmHc9OgDxQwYK0+D07Oa5mkTAQYtqKu5mRCmPdjxz9LQqOGI25eMPGfHsUWPeWGZ\nWEa/514Me1KeUUkbqeUH6EE9x6qzYRsmuyYZCEaxptKBDflxGm6unnS7E36Z7tlp\nLHpFI6GyDQZRtzfWRjvQR6OGN2Cord48n8c5o5kb+QKBgQDl38giHOAvRspvxbor\nIxbwARx4i+uWfO1Z8vbivpKdntCG53Z+pQ4kWNGaX5uEYsTiAU6R0UmD0vZs176j\nqkMaNyNJOrjfWPKBnvdFmPcLv4y4Oi1wz/WPlLYN+gbjpqoYE2Aei2n6MoC15pmT\nMaduepVB9TBG/CoOYWmUJ6j7aQKBgQC/ozulogKwvsF5JKE+Q1DrlERa5aWfX+b3\nkhkp34CgLl3NCl2gahDZFIhMNfMGwmCMiro+WgOuWf4BUlo45gfhfCJZl0nFX4UO\nbJjpVh7QX/fv0br/grOHQBzTQRiaA8FxMJ8DMRGJvcCmoIbe42O/glunBBQVPHa/\ncq6bCX5yPQKBgDRnG1yLcJ/WZ3erf5Et4qC74B2q5/3aZNFIjfeKsim0dp0KTvz3\n641logKrIOzBB1juK1caesPOZ9bQJ+lvevSS9TxQYqynvkDGWGBJSqgm9pFY0dsR\nzUz5/baZ9NAYwlXStOrBpVsgAC93bjMb8qtAzp3Go0bLXVsB4eugTulhAoGBAKKc\nJe7D7DiBhLYAyPmGMVHUu7PNjZ4QyHFmfQe06PYCogFsPEnz9lvdOlJArPkdUsOu\nq55gzyLQpeIFOR1yw1kn9hXDdAuQo9y7dXz5YKg75qyOcHiDNUcctdjkMbXuXeRn\n92XD6zfP1XsOV6Mlm+xS9uZfZZMnfTOyYkqX4b2ZAoGAX4XN6eA9Xw+3RwVKvkPC\n7W7UB5LeXzGKv9DZtaisLDHrn+hmsEJI6nK1HVV5rR1CRhY/EOSHnWaKWrWl164G\njn/c2uUdQ7LxVd+8Tmi9c9qnNa/XGgoDYKJBCowK1YE7XMMUe8nt6xtJMyv5E9T5\nNkF7I6qQ9PNLSgxwkOQHudc=\n-----END PRIVATE KEY-----\n",
  "client_email": "textdetect@imagetext-364605.iam.gserviceaccount.com",
  "client_id": "107008627228903993544",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/textdetect%40imagetext-364605.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"

}));


const CONFIG = {
  credentials: {
    private_key: CREDENTIALS.private_key,
    client_email: CREDENTIALS.client_email,
    mimeType: 'application/pdf',


  }
}

const client = new vision.ImageAnnotatorClient(CONFIG);


ipcMain.on('close-main-window', function () {
  app.quit()
})


app.on('ready', function () {
  mainWindow = new BrowserWindow({
    resizable: true,
    height: 600,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });
  mainWindow.loadURL(__dirname + './index.html');
  mainWindow.on('closed', function () {

    mainWindow = null;
  });
});


ipcMain.on("chooseFile", (event) => {
  dialog.showOpenDialog({
    properties: ["Upload"],
    filters: [{ name: "images", extensions: ["jpg", "jpeg", "png", "webp"] }]
  })

    .then(result => {
      if (result.canceled) {
        console.log('no file');
      }
      else {
        const filePath = result.filePaths[0]
        const fileName = path.basename(filePath)
        const imgFolderPath = path.join(app.getPath('userData'), fileName);

        fs.copyFile(filePath, imgFolderPath, (err) => {
          if (err) {
            throw err;
          }

          console.log(imgFolderPath);


          const detectText = async (filepath) => {
            let [result] = await client.textDetection(filepath);
            let list = result.fullTextAnnotation.text;

            let d = list.split('\n');
            console.log(d, 'split');




            event.reply("chosenFile", '');
            event.reply("ChosenFiles", d);



            const regexPattern = /[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{4}/;
            const regexPattern1 = /[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{4}/;
            const regexPattern2 = /[A-Z]{2}\.[0-9]{2}\.[A-Z]{1,2}\.[0-9]{4}/;
            const regexPattern3 = /[A-Z]{2}\s?\d{2}[A-Z]{2}\s?\d{4}/;
            const regexPattern4 = /[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}/;
            const regexPattern5 = /[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{4}/g;
            const regexPattern6 = /[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{3}/;
            const regexPattern7 = /[A-Z]{2} [0-9]{1,2} [A-Z]{1,2}\s\d{4}/;
            const regexPattern9 = /[A-Z]{2}\-[0-9]{2}\-[A-Z]{2}\-[0-9]{4}/;
            const regexPattern10 = /[A-Z]{2}\-[0-9]{2}[A-Z]{1,2}\-[0-9]{4}/;

            const regexPattern11 = /[A-Z]{2}\s\d{4}/;
            const regexPattern12 = /[A-Z]{2}[A-Z]{1}\d{1}[A-Z]{1,2}\d{1,4}/;
            const regexPattern13 = /[A-Z]{2}\s\d{2}\s[A-Z]{2}/;
            const regexPattern14 = /[A-Z]{2}\s[A-Z]{1}\d{1}\s[A-Z]{2}/;
            const regexPattern15 = /[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{0,1}/;
            const regexPattern16 = /[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{2}/;
            const regexPattern17 = /[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{3}/;
            const regexPattern18 = /[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{4}/;





            // const a2 = /[0-9]{4}/;
            // const a3 = /[A-Z]{1,2}/;
            // const a4 = /[0-9]{2}/;
            // const a5 = [a3,a4]

            const regexPatterns = [
              regexPattern,
              regexPattern1,
              regexPattern2,
              regexPattern3,
              regexPattern4,
              regexPattern5,
              regexPattern6,
              regexPattern7,
              regexPattern9,
              regexPattern10,
              regexPattern11,
              regexPattern12,
              regexPattern13,
              regexPattern14,
              regexPattern15,
              regexPattern16,regexPattern17,regexPattern18
              // a2,
              // a3,
              // a4
            ];




            let vehicleNumbers = []; // Initialize vehicleNumbers as an empty array
            for (let i = 0; i < d.length; i++) {
              const element = d[i];


              // if (regexPattern1.test(element)||regexPattern2.test(element)||regexPattern3.test(element) || regexPattern.test(element) || regexPattern4.test(element)||regexPattern5.test(element)
              // ||regexPattern6.test(element)||regexPattern7.test(element)) {
              //   vehicleNumbers = element; 
              //   console.log('gettext');
              // }
              if (regexPatterns.some(pattern => pattern.test(element))) {
                vehicleNumbers.push(element);
               
                var joinedString =vehicleNumbers.join(' ');
                console.log(joinedString, 'number');
              }

//               if (regexPatterns1.some(pattern => pattern.test(element))) {

//                 vehicleNumbers.push(element)
//                 const joinedString =vehicleNumbers.join(' ');

// console.log(joinedString,'222');
//               }
            }
         



            if (vehicleNumbers !== '') {
              console.log('Vehicle number:', vehicleNumbers);
              event.reply("chosenFile", joinedString);
              event.reply("chosenFiles", d);

            } else {

              console.log('No vehicle number found in the array.');
              event.reply("chosenFile", []);

            }
          };


          detectText(imgFolderPath);

  

          // async function batchAnnotateFiles() {

          //   const inputConfig = {
          //     mimeType: 'application/pdf',

          //     content: await venki.readFile(imgFolderPath),

          //   };


          //   const features = [{ type: 'DOCUMENT_TEXT_DETECTION' }];



          //   const fileRequest = {
          //     inputConfig: inputConfig,
          //     features: features,

          //     pages: [1, 2, -1],
          //   };

          //   // Add each `AnnotateFileRequest` object to the batch request.
          //   const request = {
          //     requests: [fileRequest],
          //   };

          //   // Make the synchronous batch request.
          //   const [result] = await client.batchAnnotateFiles(request);


          //   const responses = result.responses[0].responses;

          //   for (const response of responses) {
          //     console.log(`Full text: ${response.fullTextAnnotation.text}`);

          //     event.reply('chosenFile', response.fullTextAnnotation.text);

          //   }

          // }

          // batchAnnotateFiles();
        })
      }
    });
});