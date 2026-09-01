/**
 * CONFIG - Global configuration object
 * Contains emission factors, reference values, and category metadata for
 * the weekly carbon footprint calculator
 */
const CONFIG = {
    /**
     * CO2 emission factors per category. Values are educational
     * approximations for the purposes of this project, not an audited
     * scientific source.
     */
    EMISSION_FACTORS: {
        // kg CO2 per kWh - average Brazilian electricity grid factor
        energy: 0.0817,

        // kg CO2 per km, by transport mode
        transport: {
            car: 0.12,
            bus: 0.089,
            bicycle: 0,
            walk: 0
        },

        // kg CO2 per meal, by diet type
        food: {
            redMeat: 6.61,
            chickenFish: 1.5,
            vegetarian: 0.5
        },

        // kg CO2 per kg of non-recycled waste
        waste: 0.5
    },

    /**
     * Carbon credit configuration: how much CO2 one credit offsets, and
     * the estimated price range in Brazilian Reais.
     */
    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    // Educational estimate of an average Brazilian's weekly footprint,
    // used only as a reference point for comparison in the UI.
    NATIONAL_AVERAGE_WEEKLY_KG: 95,

    /**
     * Metadata for rendering each category in the UI.
     */
    CATEGORY_META: {
        energy: { label: 'Energia', icon: '⚡' },
        transport: { label: 'Transporte', icon: '🚗' },
        food: { label: 'Alimentação', icon: '🍽️' },
        waste: { label: 'Resíduos', icon: '🗑️' }
    }
};
