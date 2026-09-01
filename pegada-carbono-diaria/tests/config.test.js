const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-scripts');

function loadConfig() {
    const sandbox = loadScripts(['js/config.js']);
    return sandbox.CONFIG;
}

test('CONFIG exposes the four emission factor categories', () => {
    const CONFIG = loadConfig();
    // CONFIG objects come from a separate vm realm, so cross-realm plain
    // objects are serialized through JSON before structural comparison.
    const asPlainObject = (value) => JSON.parse(JSON.stringify(value));

    assert.equal(CONFIG.EMISSION_FACTORS.energy, 0.0817);
    assert.deepEqual(asPlainObject(CONFIG.EMISSION_FACTORS.transport), {
        car: 0.12,
        bus: 0.089,
        bicycle: 0,
        walk: 0
    });
    assert.deepEqual(asPlainObject(CONFIG.EMISSION_FACTORS.food), {
        redMeat: 6.61,
        chickenFish: 1.5,
        vegetarian: 0.5
    });
    assert.equal(CONFIG.EMISSION_FACTORS.waste, 0.5);
});

test('CONFIG exposes carbon credit pricing constants', () => {
    const CONFIG = loadConfig();
    assert.equal(CONFIG.CARBON_CREDIT.KG_PER_CREDIT, 1000);
    assert.equal(CONFIG.CARBON_CREDIT.PRICE_MIN_BRL, 50);
    assert.equal(CONFIG.CARBON_CREDIT.PRICE_MAX_BRL, 150);
});

test('CONFIG exposes a positive national weekly average for comparison', () => {
    const CONFIG = loadConfig();
    assert.ok(CONFIG.NATIONAL_AVERAGE_WEEKLY_KG > 0);
});

test('CONFIG exposes label and icon metadata for all four categories', () => {
    const CONFIG = loadConfig();
    ['energy', 'transport', 'food', 'waste'].forEach((category) => {
        assert.ok(CONFIG.CATEGORY_META[category].label);
        assert.ok(CONFIG.CATEGORY_META[category].icon);
    });
});
