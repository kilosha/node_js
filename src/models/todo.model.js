import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  isCompleted: {
    type: Boolean,
    require: true
  },
  userID: {
    type: String,
    require: true
  }
}, { versionKey: false });

if (!todoSchema.options.toObject) todoSchema.options.toObject = {};
todoSchema.options.toObject.transform = function (doc, ret, options) {
  delete Object.assign(ret, {ID: ret._id })._id;
  return ret;
}

todoSchema.post('find', function(result) {
  if (Array.isArray(result)) {
    result.forEach(item => {
      delete Object.assign(item, {ID: item._id })._id;
    });
  } 
  return result;
})

export default mongoose.model("todo", todoSchema);