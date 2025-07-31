import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({

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
        select: false, // Don't include password in queries by default
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

    totalFunds: {
        type: Number,
        default: 0,
        min: [0, 'Total funds cannot be negative'],
    },

    totalInterest: {
        type: Number,
        default: 0,
        min: [0, 'Total interest cannot be negative'],
    },

    role: {
        type: String,
        enum: {
            values: ['admin', 'client'],
            message: 'Invalid role'
        },
        default: 'admin',
        required: true,
    },

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
        default: Date.now(),
    },
})

export default mongoose.model('Admin', adminSchema);