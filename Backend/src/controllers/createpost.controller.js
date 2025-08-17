const postmodel = require(`../model/post.model`);
const userModel = require("../model/user.model");
const GenerateCaption = require(`../services/ai.service`);
const uploadToImageKit = require(`../services/imagekit.service`);
const { v4: uuidv4 } = require("uuid");

async function createpostscontroller(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: "File must be an image" });
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "File size too large. Maximum size is 10MB" });
    }

    const base64ImageFile = Buffer.from(file.buffer).toString("base64");
    const caption = await GenerateCaption(base64ImageFile);
    const result = await uploadToImageKit(file.buffer, `${uuidv4()}.jpg`);
    
    const post = await postmodel.create({
      image: result.url,
      caption: caption,
      user: req.user._id
    });

    return res.status(200).json({
      message: "Post created successfully",
      post
    });
  } catch (error) {
    console.error('Error in createpostscontroller:', error);
    return res.status(500).json({ 
      error: "Failed to create post",
      details: error.message 
    });
  }
}

module.exports = { createpostscontroller };
