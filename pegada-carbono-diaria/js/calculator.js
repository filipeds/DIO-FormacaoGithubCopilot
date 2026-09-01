/**
 * Calculator - Global calculator object for weekly CO2 footprint
 * Contains pure calculation functions (no DOM access) for each habit
 * category, the combined total, and carbon credit estimates
 */
const Calculator = {
    /**
     * Calculate CO2 emission from weekly electricity consumption
     * @param {number} kwh - kWh consumed in the week
     * @returns {number} CO2 emission in kg, rounded to 2 decimal places
     */
    calculateEnergyEmission: function(kwh) {
        const emission = kwh * CONFIG.EMISSION_FACTORS.energy;
        return Math.round(emission * 100) / 100;
    },

    /**
     * Calculate CO2 emission from weekly transport, summing every mode
     * @param {Object} kmByMode - km per week, keyed by transport mode (car, bus, bicycle, walk)
     * @returns {number} CO2 emission in kg, rounded to 2 decimal places
     */
    calculateTransportEmission: function(kmByMode) {
        const factors = CONFIG.EMISSION_FACTORS.transport;
        const total = Object.keys(factors).reduce(function(sum, mode) {
            const km = kmByMode[mode] || 0;
            return sum + km * factors[mode];
        }, 0);
        return Math.round(total * 100) / 100;
    },

    /**
     * Calculate CO2 emission from weekly meals, summing every diet type
     * @param {Object} meals - number of meals per week, keyed by diet type (redMeat, chickenFish, vegetarian)
     * @returns {number} CO2 emission in kg, rounded to 2 decimal places
     */
    calculateFoodEmission: function(meals) {
        const factors = CONFIG.EMISSION_FACTORS.food;
        const total = Object.keys(factors).reduce(function(sum, type) {
            const count = meals[type] || 0;
            return sum + count * factors[type];
        }, 0);
        return Math.round(total * 100) / 100;
    },

    /**
     * Calculate CO2 emission from weekly waste, applying the factor only
     * to the fraction that was not recycled
     * @param {number} kg - kg of waste generated in the week
     * @param {number} recycledPercent - percentage recycled, clamped to 0-100
     * @returns {number} CO2 emission in kg, rounded to 2 decimal places
     */
    calculateWasteEmission: function(kg, recycledPercent) {
        const clampedPercent = Math.min(100, Math.max(0, recycledPercent || 0));
        const nonRecycledKg = kg * (1 - clampedPercent / 100);
        const emission = nonRecycledKg * CONFIG.EMISSION_FACTORS.waste;
        return Math.round(emission * 100) / 100;
    },

    /**
     * Calculate the combined weekly footprint across all four categories
     * @param {Object} categoriesInput - { energy, transport, food, waste: { kg, recycledPercent } }
     * @returns {Object} { total, byCategory: [{ category, emission, percentageOfTotal }] (sorted highest first), vsNationalAverage }
     */
    calculateTotalFootprint: function(categoriesInput) {
        const energy = this.calculateEnergyEmission(categoriesInput.energy || 0);
        const transport = this.calculateTransportEmission(categoriesInput.transport || {});
        const food = this.calculateFoodEmission(categoriesInput.food || {});
        const wasteInput = categoriesInput.waste || {};
        const waste = this.calculateWasteEmission(wasteInput.kg || 0, wasteInput.recycledPercent || 0);

        const total = Math.round((energy + transport + food + waste) * 100) / 100;

        const byCategory = [
            { category: 'energy', emission: energy },
            { category: 'transport', emission: transport },
            { category: 'food', emission: food },
            { category: 'waste', emission: waste }
        ]
            .map(function(entry) {
                return {
                    category: entry.category,
                    emission: entry.emission,
                    percentageOfTotal: total > 0
                        ? Math.round((entry.emission / total) * 100 * 100) / 100
                        : 0
                };
            })
            .sort(function(a, b) {
                return b.emission - a.emission;
            });

        const vsNationalAverage = Math.round(
            ((total - CONFIG.NATIONAL_AVERAGE_WEEKLY_KG) / CONFIG.NATIONAL_AVERAGE_WEEKLY_KG) * 100 * 100
        ) / 100;

        return { total: total, byCategory: byCategory, vsNationalAverage: vsNationalAverage };
    },

    /**
     * Calculate carbon credits needed to offset a given emission
     * @param {number} totalEmissionKg - total CO2 emission in kg
     * @returns {number} number of carbon credits needed, rounded to 4 decimal places
     */
    calculateCarbonCredits: function(totalEmissionKg) {
        const credits = totalEmissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
        return Math.round(credits * 10000) / 10000;
    },

    /**
     * Estimate the price range for carbon credits in Brazilian Reais
     * @param {number} credits - number of carbon credits
     * @returns {Object} { min, max, average } in BRL, rounded to 2 decimal places
     */
    estimateCreditPrice: function(credits) {
        const min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
        const max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
        const average = (min + max) / 2;
        return {
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            average: Math.round(average * 100) / 100
        };
    }
};
