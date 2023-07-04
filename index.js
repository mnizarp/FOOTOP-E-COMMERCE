const express = require("express");
const app = express();
const path = require("path");

const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");

app.use("/", userRouter);
app.use("/admin", adminRouter);
const PORT = process.env.PORT ;

app.listen(PORT, console.log("Server don start for port: " + PORT));

  const mongoose = require('mongoose');

  main().catch(err => console.log(err));
  
  async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
          console.log("mongodb connected successfully");
        })
  
    
  }







