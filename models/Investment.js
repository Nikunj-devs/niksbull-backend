import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    lockInStartDate: {
        type: Date,
        required: true,
    },

    lockInEndDate: {
        type: Date,
        required: true,
    },

    isRenewed: {
        type: Boolean,
        default: false,
    },

    renewedOn: {
        type: Date,
    },

    status: {
        type: String,
        enum: ['locked', 'expired', 'withdrawal_requested', 'withdrawn'],
        default: 'locked',
    },

    createdAt: {
        type: Date,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Automatically set lockInEndDate to 365 days from start
investmentSchema.pre('validate', function (next) {
    if (!this.lockInEndDate) {
        this.lockInEndDate = new Date(this.lockInStartDate);
        this.lockInEndDate.setDate(this.lockInStartDate.getDate() + 365);
    }
    next();
});

investmentSchema.post('save', async function () {
    const clientId = this.client;
    const result = await mongoose.model('Investment').aggregate([
        { $match: { client: clientId } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ])

    const total = result.length > 0 ? result[0].totalAmount : 0;
    await mongoose.model('Client').findByIdAndUpdate(clientId, { totalInvestment: total, updatedAt: new Date() });
})

export default mongoose.model('Investment', investmentSchema);
