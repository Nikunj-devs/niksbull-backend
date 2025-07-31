import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true, // Add index for email lookups
        validate: {
            validator: function (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: 'Please provide a valid email address'
        }
    },

    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        trim: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        index: true, // Add index for name searches
    },

    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Phone number must be at least 10 digits'],
        maxlength: [15, 'Phone number cannot exceed 15 digits'],
        validate: {
            validator: function (phone) {
                const phoneRegex = /^[0-9+\-\s()]+$/;
                return phoneRegex.test(phone);
            },
            message: 'Please provide a valid phone number'
        }
    },

    role: {
        type: String,
        enum: {
            values: ['admin', 'client'],
            message: 'Invalid role'
        },
        default: 'client',
        required: true,
    },

    bankDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankDetails',
        required: true,
    },

    investments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Investment',
        }
    ],

    totalInvestment: {
        type: Number,
        default: 0,
        min: [0, 'Total investment cannot be negative'],
    },

    totalInterest: {
        type: Number,
        default: 0,
        min: [0, 'Total interest cannot be negative'],
    },

    totalWithdrawn: {
        type: Number,
        default: 0,
        min: [0, 'Total withdrawn cannot be negative'],
    },

    totalBalance: {
        type: Number,
        default: 0,
        min: [0, 'Total balance cannot be negative'],
    },

    transactionRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TransactionRequest',
        }
    ],

    statements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payout',
        }
    ],

    token: {
        type: String,
        default: null,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('Client', clientSchema);