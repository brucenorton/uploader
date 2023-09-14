
async function fetchImages(url){
  const repsonse = await fetch(url);
  const data = await repsonse.json();
  displayImages(data);
}

//call function to fetch data
fetchImages('app/select.php');

function displayImages(data){
  console.log(data);
  //select element from HTML where we'll put our tv show
  const gallery = document.querySelector('#gallery');
  gallery.innerHTML = '';
  
  data.forEach((image)=>{
    //console.log(image);
    //create figure, img + figcaption
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    img.src = `uploads/${image.image_name}`;
    let figcaption = document.createElement('figcaption');
    figcaption.innerHTML = image.caption;
    figure.append(img, figcaption);
    gallery.append(figure);
  })
}

const submitButton = document.querySelector('#submit');
submitButton.addEventListener('click', getFormData);
// Check for file extension:: uhoh regEx!!
const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

 function getFormData(event){
  event.preventDefault();

  //get the form data & call an async function
  const insertFormData = new FormData(document.querySelector('#upload-form'));
  //console.log(allowedExtensions.exec(document.querySelector('#fileToUpload').value));

  //prevent non-image file uploads
    //note that we need to do this in .php too, for security reasons
    //.exec( ) returns 'null' if pattern is NOT matched, or 
  if(!allowedExtensions.exec(document.querySelector('#fileToUpload').value)){
    console.log('only .jpg, .jpeg and .png files allowed');
  }else{
    let url = 'app/uploader.php';
    inserter(insertFormData, url);
  }
}

async function inserter(data, url){
  const response = await fetch(url, {
    method: "POST",
    body: data
  });
  const confirmation = await response.json();

  console.log(confirmation);
  //call function again to refresh the page
  fetchImages('app/select.php');
}
//  