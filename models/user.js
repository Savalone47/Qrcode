const mongoose    =   require('mongoose');
const userSchema  =   new mongoose.Schema({
    name:{
        type:String
    },
    phone:{
        type:Number
    }
});
module.exports = mongoose.model('user',userSchema);