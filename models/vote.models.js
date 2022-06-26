const mongoose = require("mongoose");

const partiesSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const voteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetLocation: {
      type: String,
      required: true,
      default: "global",
    },
    parties: [partiesSchema],
    expiration: {
      type: mongoose.Schema.Types.Date,
    },
    endVoting: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps }
);

const VoteModel = mongoose.model("Vote", voteSchema);

module.exports = VoteModel;
