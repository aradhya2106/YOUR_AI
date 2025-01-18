import mongoose from "mongoose";

function connect() {
  // Check if the MONGODB_URI is defined
  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in the environment variables.");
    process.exit(1); // Exit the process with a failure code
  }

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1); // Exit the process with a failure code
    });
}

export default connect;
