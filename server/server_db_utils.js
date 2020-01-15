const Model = require('./model')
const passport = require('passport')
const initializePassport = require('./passport-config')

initializePassport(
    passport, 
    email => Model.User.find({email: email}).exec(),
    id => Model.User.findById(id).exec()
)

uploadUserImage = async function(image, userId) {
    let oldEntry = await Model.Picture.findOneAndUpdate({"user": userId}, {"user": userId, "imageUrl": image});
    if(oldEntry == null){
        let picture =  new Model.Picture({
            imageUrl: image,
            user: userId
        });
        await picture.save();
        return;
    }
}

retriveUserHouseImage = async function(userId) {
    return await Model.Picture.find({user: userId}).exec()
}

updateConsumptionById = async function(id, consumption) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"consumption": consumption}).exec()
}

getAllUsers = async function() {
    return await Model.User.find().exec()
}

getAllProsumers = async function() {
    return await Model.User.find({isManager: false}).exec()
}

getAllManagers = async function() {
    return await Model.User.find({isManager: true}).exec()
}

getUserById = async function(id) {
    return await Model.User.findOne({'_id': id}).exec()
}

updateProductionById = async function(id, production) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"production": production}).exec()
}

updateBufferById = async function(id, buffer) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"buffer": buffer}).exec()
}

updateBufferSizeById = async function(id, size) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"buffer_max": size}).exec()
}

updateOverProductionById = async function(id, over_production_sell) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"over_production_sell": over_production_sell}).exec()
}

updateUnderProductionById = async function(id, under_production_buy) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"under_production_buy": under_production_buy}).exec()
}

updateBalanceById = async function(id, new_balance){
    return await Model.User.findOneAndUpdate({"_id": id}, {"balance": new_balance}).exec()
}

updateOnOffById = async function (id, production_on_off) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"production_on_off": production_on_off}).exec()
}

registerNewUser = async function(name, email, hashed_password, isManager, buffer_max) {
    const user = new Model.User({
        name: name,
        email: email,
        password: hashed_password,
        isManager: isManager,
        buffer_max: buffer_max
    })
    await user.save()
    return user
}

module.exports = {
    updateConsumptionById: updateConsumptionById,
    getAllProsumers: getAllProsumers,
    updateProductionById: updateProductionById,
    getUserById: getUserById,
    updateBufferById: updateBufferById,
    updateBufferSizeById: updateBufferSizeById,
    registerNewUser: registerNewUser,
    updateBalanceById: updateBalanceById,
    updateUnderProductionById: updateUnderProductionById,
    updateOverProductionById: updateOverProductionById,
    getAllManagers: getAllManagers,
    getAllUsers: getAllUsers,
    updateOnOffById: updateOnOffById,
    model: Model,
    uploadUserImage: uploadUserImage,
    retriveUserHouseImage, retriveUserHouseImage
}