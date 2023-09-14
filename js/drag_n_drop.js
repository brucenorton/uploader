
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

/* image upload code */
const submitButton = document.querySelector('#submit');
submitButton.addEventListener('click', getFormData);
const fileInput = document.querySelector('#fileToUpload');
// Check for file extension:: uhoh regEx!!
const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

function getFormData(event){
  event.preventDefault();

  //get the form data & call an async function
  const insertFormData = new FormData(document.querySelector('#upload-form'));
  //console.log(allowedExtensions.exec(document.querySelector('#fileToUpload').value));

  //prevent non-image file uploads
    //note that we need to do this in .php too, for security reasons
    //.exec( ) executes a RegEx search & returns 'null' if pattern is NOT matched, or 
  if(!allowedExtensions.exec(document.querySelector('#fileToUpload').value)){
    console.log('only .jpg, .jpeg and .png files allowed');
  }else{
    let url = 'app/uploader.php';
    inserter(insertFormData, url);
  }
}
//after user browses & chooses a photo, display name
fileInput.addEventListener('change', () => {
  // Display the selected file name or do something else
  if (fileInput.files.length) {
      imageInfo.innerText = fileInput.files[0].name;
      displayImagePreview(fileInput.files[0]);
  } else {
    imageInfo.innerText = "Drop files here or click to upload.";
  }
});

//** drag & drop zone **/
//we use the same file input element, but drag & drop instead of browse
  const dropZone = document.querySelector('#drop-zone');
  const imageInfo = document.querySelector('#image-info');

  //drag & dragleave event listeners
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    //console.log('dragover');
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  //drop event listener
  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    fileInput.files = event.dataTransfer.files;
    if (fileInput.files.length) {
        //displayFileInfo(fileInput.files[0]);
        imageInfo.innerText = fileInput.files[0].name;
        displayImagePreview(fileInput.files[0]);
    }
  });

  const imagePreview = document.getElementById('image-preview');
  function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // Remove previous image if it exists
        while (dropZone.firstChild) {
            dropZone.removeChild(dropZone.firstChild);
        }
        // Create new image element and set the source
        const img = document.createElement('img');
        img.src = e.target.result;
        dropZone.appendChild(img);
        dropZone.classList.add('dropped');
    }
    reader.readAsDataURL(file);
  } 



///insert image link & caption in the db
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