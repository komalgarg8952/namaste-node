

const validator =  require('validator');
const validationFunction = (req)=>{
    const {firstName, lastName, email,password} = req.body;
    if(!firstName || !lastName){
         throw new Error('firstname or lastname is not present');
    }
    if(!validator.isEmail(email)){
        throw new Error('email is not valid') 
    }
    if(!validator.isStrongPassword(password)){
        throw new Error('password is not strong')
    }

}

const validateUpdatedField = (req)=>{
    const allowedFieldsForUpdation = ['firstName','lastName','about','skills','age','gender','photoUrl'];
    // console.log(req.body,user)
    const isupdateAllowed = Object.keys(req.body).every(key=>allowedFieldsForUpdation.includes(key));
    return isupdateAllowed;
}

module.exports = {
    validationFunction,
    validateUpdatedField
}