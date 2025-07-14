const mongoose = require('mongoose');

const passwordsSchema = mongoose.Schema({
    sitename:String,
    password:String,
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

})

module.exports = mongoose.model('password',passwordsSchema);