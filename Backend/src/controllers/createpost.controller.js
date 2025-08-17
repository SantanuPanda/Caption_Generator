const postmodel = require(`../model/post.model`);
const userModel = require("../model/user.model");
const GenerateCaption = require(`../services/ai.service`);
const uploadToImageKit = require(`../services/imagekit.service`);
const { v4: uuidv4 } = require("uuid");

async function createpostscontroller(req, res) {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file" }); // sends response
  }

  const base64ImageFile = new Buffer.from(file.buffer).toString("base64");
  const caption = await GenerateCaption(base64ImageFile); // might send again inside here
  const result = await uploadToImageKit(file.buffer, `${uuidv4()}.jpg`);
  const post=await postmodel.create({
    image:result.url,
    caption:caption,
    user:req.user._id
  })

  return res.status(200).json({message:"post create sucessfully",post});
}

module.exports = { createpostscontroller };
