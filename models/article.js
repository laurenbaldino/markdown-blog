const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const articleShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  decription: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHTML: {
	type: String,
	required: true
  },

});
articleShema.pre("validate", function () {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strictt: true });
  }
  if(this.markdown){
	  this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
  }
  next();
});
module.exports = mongoose.model("Article", articleShema);
