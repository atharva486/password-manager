const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/passwordManager');
const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    passid:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'password',
        default:'',

    }]
})

module.exports = mongoose.model('user',userSchema);