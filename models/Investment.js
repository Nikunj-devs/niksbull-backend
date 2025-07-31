import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({

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
            message: 'Investment amount must be greater than 0'
        }
    },

    lockInStartDate: {
        type: Date,
        required: true,
        default: Date.now,
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
        enum: {
            values: ['locked', 'expired', 'withdrawal_requested', 'withdrawn'],
            message: 'Invalid investment status'
        },
        default: 'locked',
        index: true, // Add index for status queries
    },

    createdAt: {
        type: Date,
        default: Date.now,
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
    try {
        const clientId = this.client;
        const result = await mongoose.model('Investment').aggregate([
            { $match: { client: clientId } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ])

        const total = result.length > 0 ? result[0].totalAmount : 0;
        await mongoose.model('Client').findByIdAndUpdate(clientId, {
            totalInvestment: total,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error updating client totalInvestment in post-save hook:', error);
    }
})

investmentSchema.post('findOneAndDelete', async function () {
    try {
        const clientId = this.client;
        if (clientId) {
            const result = await mongoose.model('Investment').aggregate([
                { $match: { client: clientId } },
                { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
            ])

            const total = result.length > 0 ? result[0].totalAmount : 0;
            await mongoose.model('Client').findByIdAndUpdate(clientId, {
                totalInvestment: total,
                updatedAt: new Date()
            });
        }
    } catch (error) {
        console.error('Error updating client totalInvestment in post-delete hook:', error);
    }
})

investmentSchema.post('findByIdAndDelete', async function () {
    try {
        const clientId = this.client;
        if (clientId) {
            const result = await mongoose.model('Investment').aggregate([
                { $match: { client: clientId } },
                { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
            ])

            const total = result.length > 0 ? result[0].totalAmount : 0;
            await mongoose.model('Client').findByIdAndUpdate(clientId, {
                totalInvestment: total,
                updatedAt: new Date()
            });
        }
    } catch (error) {
        console.error('Error updating client totalInvestment in post-delete hook:', error);
    }
})

export default mongoose.model('Investment', investmentSchema);
