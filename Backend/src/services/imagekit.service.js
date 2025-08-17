require("dotenv").config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey : process.env.PUBLIC_KEY,
    privateKey : process.env.PRIVATE_KEY,
    urlEndpoint : process.env.URL_END
});

async function uploadToImageKit(file,filename) {
  try {

    const uploadResponse = await imagekit.upload({
      file:file,
      fileName:filename,
      folder:"social"           
    });

    return uploadResponse; // contains url, fileId, etc.

  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
}

module.exports=uploadToImageKit;