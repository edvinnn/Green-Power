const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByMail, getUserById) {

    const authenticateUser = async (email, password, done) => {
        const users = await getUserByMail(email)
        const user = users[0] //Todo: Match the right user (itterate)
        if (user != null){
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Incorrect password'})
                }
            } catch (err) {
                return done(err)
            }
        }
        return done(null, false, {message: 'No user found with that email'})
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize
