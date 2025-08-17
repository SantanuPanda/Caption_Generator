require("dotenv").config();
const app=require("./src/app")
const connectDB = require("./src/db/Db");
connectDB();

app.listen(process.env.PORT,()=>{
  console.log(`the server is running on port ${process.env.PORT}`);
})