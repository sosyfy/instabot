const  mongoose = require('mongoose')

const travelSchema = new mongoose.Schema(
    {
     type: {
        type: String,
      },
     likes: {
        type: Number,
      },
     comments: {
        type: Number,
      },
     links: [],
     caption: {
        type: String,
      },

    },
    {
      timestamps: true,
    }
  )



module.exports = mongoose.model('Travel', travelSchema)