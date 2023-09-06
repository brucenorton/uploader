<?php
  require_once "_includes/db_connect.php";

  // ** uploader should do the following **
  /* pseudo code **
    -check input of $_FILES
      -if yes, insert into db
      -if no, respond with error message
 */

  $results = [];
  $insertedRows = 0;

  //abstracted 3 functions
    // 1 validates file is either .jpg or .png
    // 2 uploads the image
    // 3 adds the caption & image to the demo_db.images table

    function validateFile() {
      // Get file extension
      $fileExtension = strtolower(pathinfo($_FILES["fileToUpload"]["name"], PATHINFO_EXTENSION));
      
      // Check MIME type
      $fileInfo = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
      $mime = $fileInfo['mime'];
      $allowedMimeTypes = ['image/jpeg', 'image/png'];
      
      if(!in_array($mime, $allowedMimeTypes)) {
        throw new Exception('Invalid file type. Only .jpg and .png files are allowed.');
      }
      
      // You can also limit by extension, but MIME type check is more robust
      if(!in_array($fileExtension, ['jpg', 'jpeg', 'png'])) {
        throw new Exception('Invalid file extension. Only .jpg and .png files are allowed.');
      }
      
      return true;
    }



  function uploadImage(){
    $target_dir = "../uploads/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    //should return true if file uploads (moves)
    return move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file);
  }

  function insertData($link){
    $query = "INSERT INTO images (caption, image_name) VALUES (?,?)";

    if($stmt = mysqli_prepare($link, $query)){
      mysqli_stmt_bind_param($stmt, "ss", $_REQUEST["caption"], basename($_FILES["fileToUpload"]["name"]));
      mysqli_stmt_execute($stmt);
      $insertedRows = mysqli_stmt_affected_rows($stmt);

      if($insertedRows > 0){
        $results[] = [
          "insertedRows"=>$insertedRows,
          "id" => $link->insert_id,
          "caption" => $_REQUEST["caption"],
          "image_name" => $_REQUEST["tvshow"]
        ];
      }else{
        throw new Exception("No rows were inserted");
      }
    }
  }

  //main logic of the application is in this try{} block of code.
  try{
    //see if user has entered data
    if(!isset($_REQUEST["caption"]) || !isset($_FILES["fileToUpload"])){
      throw new Exception('Required data is missing i.e. caption, file to upload');
    }else{
      //if they have see if user (email) exists & update data
      validateFile(); // should this be wrapped?
      if(uploadImage()){
        $results[] = ["insertData() affected_rows " => insertData($link)];
      }
    }
      
  }catch(Exception $error){
    //add to results array rather than echoing out errors
    $results[] = ["error"=>$error->getMessage()];
  }finally{
    //echo out results
    echo json_encode($results);
  }
 
?>