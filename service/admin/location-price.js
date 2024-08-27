"use strict";

module.exports = function (mongoose, utils) {
    
    const locationPriceService = {};
    

    // Method to add a new location
    locationPriceService.addLocation = async (req, res, data) => {
        try {
            const Location = mongoose.model("location_details");
            
            // Create a new location document
            const locationDataObject = new Location({
                country_name: data.countryName,
                country_code: data.countryCode,
                phone_code: data.phoneCode,
                currency_code: data.currencyCode,
                country_flag: data.countryFlag,
                currency_symbol: data.currencySymbol,
                currency_name: data.currencyName,
                currency_symbol_position: data.currencySymbolPosition,
                localityLanguage: data.localityLanguage,
            });

            // Save the location document
            return await locationDataObject.save();
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    // Method to update or add price details
    locationPriceService.addPrice = async (req, res, _id, data) => {
        try {
            const PriceDetails = mongoose.model("location_price"); // Ensure you have this model defined somewhere
            const priceDataObject = new PriceDetails({
                location_id: _id,
                month_fee: data.monthFee,
                extendedplan1_fee: data.extendedPlan1Fee,
                extendedplan2_fee: data.extendedPlan2Fee,
            });

            // Save the price document
            return await priceDataObject.save();
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    return locationPriceService;
};
