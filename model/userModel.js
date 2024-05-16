const { boolean } = require("@tma.js/sdk");
const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    telegram_id: String,
    ref_link: String,
    referrer_id: String,
    tasks: {
      task_1: { type: Boolean, default: false },
      task_2: { type: Boolean, default: false },
      task_3: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;
