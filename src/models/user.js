const mongoose = require('mongoose');
const validator  = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema =  new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw  new Error('email id is not valid')
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw  new Error('pasword is not strong')
            }
        }
    },
    age:{
        type:Number,
    },
    gender:{
        type: String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("this is not acceptable"+value)
            }
        }
    },
    about:{
        type:String,
        default:'this is default about for everyone'
    },
    skills:{
        type:[String]
    },
    photoUrl:{
        type:String,
        default:'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg'
    }
},
{timestamps:true}
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN,{expiresIn:'7d'});
    return token;
}

userSchema.methods.validatePassword = async function(passwordinputFromUser){
    const user = this;
    const hashedPassword = user.password;
    const comparePassword = await bcrypt.compare(passwordinputFromUser,hashedPassword );
    return comparePassword
}

module.exports = mongoose.model('User',userSchema);