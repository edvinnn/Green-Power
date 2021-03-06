if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
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
    };
}

retriveUserHouseImage = async function(userId) {
    return await Model.Picture.findOne({user: userId}).exec().then(picture => {
        if (picture == null) {
            return "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2255&q=80"
        } else {
            return process.env.SERVER_ROOT_ADDRESS + picture.imageUrl
        }
    })
}

updateConsumptionById = async function(id, consumption) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"consumption": consumption}).exec()
}

getAllUsers = async function() {
    return await Model.User.find().exec()
}

getAllProsumers = async function() {
    return await Model.User.find({isManager: false}, {password: 0}).exec()
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

deleteUserById = async function (id){
    return await Model.User.findOneAndDelete({"_id":id}).exec()
}

updateUserPasswordById = async function (id, password) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"password": password}).exec()
}

setProsumerBlackoutFlag = async function (id) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"blackout": true}).exec()
}

removeProsumerBlackoutFlag = async function (id) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"blackout": false}).exec()
}

addToManagerBufferById = async function (id, amount) {
    const manager = await Model.User.findById(id);
    const new_buffer = manager.buffer + amount
    if (new_buffer > manager.buffer_max) {
        return await Model.User.findOneAndUpdate({"_id": id}, {"buffer": manager.buffer_max})
    }
    return await Model.User.findOneAndUpdate({"_id": id}, {"buffer": new_buffer});
}

takeFromManagerBufferById = async function (id, amount) {
    const manager = await Model.User.findById(id);
    const new_buffer = manager.buffer - amount
    if (new_buffer < 0) {
        return await Model.User.findOneAndUpdate({"_id": id}, {"buffer": 0})
    }
    return await Model.User.findOneAndUpdate({"_id": id}, {"buffer": new_buffer});
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

updateOnlineById = async function (id, new_state) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"is_online": new_state}).exec()
}

blockUserById = async function (id, new_state) {
    return await Model.User.findOneAndUpdate({"_id": id}, {"isBlocked": new_state}).exec()
}

setBlockCounterById = async function (id, number){
    return await Model.User.findOneAndUpdate({"_id": id}, {"blockedCounter": number}).exec()
}

decreaseBlockCounterById = async function (id){
    let user = await Model.User.findOne({"_id": id}).exec()
    user.blockedCounter--
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
    updateOnlineById: updateOnlineById,
    deleteUserById: deleteUserById,
    model: Model,
    uploadUserImage: uploadUserImage,
    retriveUserHouseImage: retriveUserHouseImage,
    updateUserPasswordById: updateUserPasswordById,
    addToManagerBufferById: addToManagerBufferById,
    takeFromManagerBufferById: takeFromManagerBufferById,
    setProsumerBlackoutFlag: setProsumerBlackoutFlag,
    removeProsumerBlackoutFlag: removeProsumerBlackoutFlag,
    blockUserById: blockUserById,
    setBlockCounterById: setBlockCounterById,
    decreaseBlockCounterById: decreaseBlockCounterById
}