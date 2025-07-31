import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        index: true, // Add index for better query performance
    },

    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount cannot be negative'],
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Payout amount must be greater than 0'
        }
    },

    reference: {
        type: String,
        required: true,
        trim: true,
        index: true, // Add index for reference lookups
    },

    payoutType: {
        type: String,
        enum: {
            values: ['credit', 'debit', 'return'],
            message: 'Invalid payout type'
        },
        required: true,
        index: true, // Add index for payout type queries
    },

    clientPayoutType: {
        type: String,
        enum: {
            values: ['credit', 'withdraw', 'return'],
            message: 'Invalid client payout type'
        },
        required: true,
    },

    payoutDate: {
        type: Date,
        default: Date.now,
        index: true, // Add index for date-based queries
    },

})

export default mongoose.model('Payout', payoutSchema);