

const electron=require('electron');

const buttonCreated = document.getElementById('upload');

 
buttonCreated.addEventListener('click',  (event) =>{

   
    electron.ipcRenderer.send('chooseFile');
   

}) 

 

//   const buttontextview = document.getElementById('gettext');

//   buttontextview.addEventListener('click', (event) => {

//   electron.ipcRenderer.on('chosenFiles', (event, base64) => {
//     const txt = document.createElement("h1");
//     txt.innerText = base64;
//     console.log(txt.innerText, 'str');
//     const element = document.getElementById("fulltext");
//     element.innerHTML = txt.innerText;
//     console.log(txt.innerText, 'text');
//   });
// });





electron.ipcRenderer.on('chosenFile', (event, base64) => {
  

    const txt = document.createElement("h1");

    txt.innerText=`${base64}`;
    console.log(txt,'str');
 const element= document.getElementById("img");
 element.innerHTML = txt.innerText
})    



