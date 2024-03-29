// Name, Email, Password and Profile

const {Schema, model} = require('mongoose')


const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        maxlength: 15,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    profilePics: {
        type: String,
        default: '/uploads/default.png'
    }
}, {
    timestamps: true
})

const User = model('User', userSchema)

module.exports = User