"use strict";

module.exports = function (mongoose) {

    const Schema = mongoose.Schema;

    const planDetailsSchema = new Schema({
        // _id: String,
        code: String,
        name: String,
        description: String,
        duration: String,
        offer_duration: String,
        monthoryear: {
            type: String,
            enum: ['Month(s)', 'Year(s)']
        },
        monthsno: Number,
        feeFieldName : String,
        createdAt: Date,
        updatedAt: Date,
    },
    {
        timestamps: true,
    });

    return mongoose.model("plan_details", planDetailsSchema);
}