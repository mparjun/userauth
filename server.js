const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose
  .connect(
    `mongodb+srv://arjun:${process.env.DATABASE_PASSWORD}@cluster0.smpnklh.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("db connection successful");
  });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
