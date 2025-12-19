const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("Database connected successfully");
	} catch (error) {
		console.log("Database connection failed:", error);
		process.exit(1);
	}
};
mongoose.connection.once("open", () => {
  console.log("✅ Connected to DB:", mongoose.connection.name);
  console.log("📌 Host:", mongoose.connection.host);
});
