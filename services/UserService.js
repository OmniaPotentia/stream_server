const crypto = require('crypto');

const UserModel = require('../models/UserModel');
const PasswordResetModel = require('../models/ResetTokenModel');
const ResetTokenModel = require('../models/ResetTokenModel');

class UserService {

    static async findByEmail(email) {
        return UserModel.findOne({email}).exec();
    }

    static async findByUsername(username) {
        return UserModel.findOne({username}).exec();
    }

    static async createUser(username, firstName, lastName, email, password, phoneNumber) {
        const user = new UserModel();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = password;
        user.username = username;
        user.mobileNumber = phoneNumber;
        return await user.save();
    }

    static async changeStatus(username, userStatus) {
        await UserModel.findOneAndUpdate({'username': username}, {'$set': {activeStatus: userStatus}}, {upsert: true});
    }

    static async createGoogleUser(username, email, oauthProfile) {
        const user = new UserModel();
        user.email = email;
        user.oauthprofiles = [oauthProfile];
        user.password = crypto.randomBytes(10).toString('hex');
        user.username = username;
        const savedUser = await user.save();
        return savedUser;
    }

    static async createPasswordResetToken(userId) {
        const passwordReset = new PasswordResetModel();
        passwordReset.userId = userId;
        const savedToken = await passwordReset.save();
        return savedToken.token;
    }

    static async verifyPasswordResetToken(userId, token) {
        return PasswordResetModel.findOne({
            token,
            userId,
        }).exec();
    }

    static async deletePasswordResetToken(token) {
        return PasswordResetModel.findOneAndDelete({
            token,
        }).exec();
    }

    static async changePassword(userId, password) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.password = password;
        return user.save();
    }

    static async findById(id) {
        return UserModel.findById(id).exec();
    }

    static async findByOAuthProfile(provider, profileId) {
        return UserModel.findOne({
            oauthprofiles: {$elemMatch: {provider, profileId}},
        }).exec();
    }

    static async getResetToken(userId) {
        return ResetTokenModel.findOne({userId}).exec();
    }

    static async getList() {
        return UserModel.find().sort({createdAt: -1}).exec();
    }

    static async deleteUser(id) {
        return UserModel.findByIdAndDelete(id);
    }
}

module.exports = UserService;
