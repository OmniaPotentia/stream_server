const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            index: {unique: true},
            minlength: 6,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            index: {unique: true},
            minlength: 6,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            index: {unique: true},
            minlength: 6,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: {unique: true},
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: false,
            index: {unique: true},
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: true,
            index: true,
            unique: true,
            default: () => Math.floor(100000 + Math.random() * 900000),
        },
        oauthprofiles: [
            {
                provider: {type: String},
                profileId: {type: String},
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.index({
    'oauthprofiles.provider': 1,
    'oauthprofiles.profileId': 1,
});

async function generateHash(password) {
    return bcrypt.hash(password, 12);
}

userSchema.pre('save', function preSave(next) {
    const user = this;
    if (user.isModified('password')) {
        return generateHash(user.password)
            .then((hash) => {
                user.password = hash;
                return next();
            })
            .catch((error) => {
                return next(error);
            });
    }
    return next();
});

userSchema.methods.comparePassword = async function comparePassword(
    candidatePassword
) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
