import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  isMan: {
    type: Boolean,
    require: true
  },
  age: {
    type: Number,
    require: true
  },
  password: {
    type: String,
    require: true
  }
}, { versionKey: false });

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
  delete ret.password;
  delete Object.assign(ret, { ID: ret._id })._id;
  return ret;
}

userSchema.post("find", function (result) {
  if (Array.isArray(result)) {
    result.forEach(item => {
      delete item.password;
      delete Object.assign(item, { ID: item._id })._id;
    });
  }
  return result;
})

export default mongoose.model("user", userSchema);