import mongoose from 'mongoose';

const bankDetailsSchema = new mongoose.Schema({

    bankName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Bank name must be at least 2 characters long'],
        maxlength: [100, 'Bank name cannot exceed 100 characters'],
        index: true, // Add index for bank name searches
    },

    accountNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [8, 'Account number must be at least 8 digits'],
        maxlength: [20, 'Account number cannot exceed 20 digits'],
        validate: {
            validator: function (accountNumber) {
                const accountRegex = /^[0-9]+$/;
                return accountRegex.test(accountNumber);
            },
            message: 'Account number must contain only digits'
        },
        index: true, // Add index for account number lookups
    },

    bankBranch: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Bank branch must be at least 2 characters long'],
        maxlength: [100, 'Bank branch cannot exceed 100 characters'],
    },

    ifscCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        minlength: [11, 'IFSC code must be exactly 11 characters'],
        maxlength: [11, 'IFSC code must be exactly 11 characters'],
        index: true, // Add index for IFSC code lookups
    },


    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


export default mongoose.model('BankDetails', bankDetailsSchema);