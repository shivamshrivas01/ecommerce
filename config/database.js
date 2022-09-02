const mongoose = require("mongoose");
const DATABASE_URL = "mongodb://localhost:27017/shopping";

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    // mongoose.connect(DATABASE_URL, DB_OPTIONS)
    mongoose
      .connect(DATABASE_URL)
      .then(() => {
        console.log("Connected Successfully..");
      })
      .catch((err) => {
        console.log("Database Connection Error" + err);
      });
  }
}

module.exports = new Database(); // initializing it's instance so as of now by only including the file the connection will establish
