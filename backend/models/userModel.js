const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: String, default: "XYZ" },
  photo: {
    type: String,
    default:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fstock-photos%2Fnature-and-landscapes&psig=AOvVaw1lE7-xjXvTZAVArY6y-Vgv&ust=1755173418853000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKDKxtTgh48DFQAAAAAdAAAAABAE",
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
