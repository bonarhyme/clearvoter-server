const mongoose = require("mongoose");
const slugify = require("slugify");

const partiesSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  voters: [String],
});

const targetLocationSchema = mongoose.Schema({
  location: {
    type: String,
  },
});

const voteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    allowVpn: {
      type: Boolean,
      default: true,
    },
    targetLocations: [targetLocationSchema],
    parties: [partiesSchema],
    expiration: {
      type: String,
    },
    endVoting: {
      type: Boolean,
      default: false,
    },
    draft: {
      type: Boolean,
      default: true,
    },
    creator: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

voteSchema.pre("save", async function (next) {
  this.slug = await slugify(this.title);
  next();
});

const VoteModel = mongoose.model("Vote", voteSchema);

module.exports = VoteModel;
