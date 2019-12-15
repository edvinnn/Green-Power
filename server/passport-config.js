const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByMail, getUserById) {

    const authenticateUser = async (email, password, done) => {
        const users = await getUserByMail(email)
        let counter = 0
        for(const user of users) {
            counter++
            if (user != null){
                try {
                    if (await bcrypt.compare(password, user.password)) {
                        return done(null, user)
                    } else {
                        continue
                    }
                } catch (err) {
                    return done(err)
                }
            }
        }
        if(counter == 0){
            return done(null, false, {message: 'No user found with that email'})
        } else {
            return done(null, false, {message: 'Incorrect password'})
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser((id, done) => {
        getUserById(id).then(function(user) {
            return done(null, user)
        })
    })
}

module.exports = initialize
