const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-scripts');

function loadCalculator() {
    const sandbox = loadScripts(['js/config.js', 'js/calculator.js']);
    return sandbox.Calculator;
}

test('calculateEnergyEmission multiplies kWh by the energy factor', () => {
    const Calculator = loadCalculator();
    assert.equal(Calculator.calculateEnergyEmission(10), 0.82);
    assert.equal(Calculator.calculateEnergyEmission(0), 0);
});

test('calculateTransportEmission sums each mode by its own factor, treating missing modes as zero', () => {
    const Calculator = loadCalculator();
    assert.equal(Calculator.calculateTransportEmission({ car: 10, bus: 0, bicycle: 0, walk: 0 }), 1.2);
    assert.equal(Calculator.calculateTransportEmission({ bus: 10 }), 0.89);
    assert.equal(Calculator.calculateTransportEmission({}), 0);
});

test('calculateFoodEmission sums meals by diet type', () => {
    const Calculator = loadCalculator();
    assert.equal(
        Calculator.calculateFoodEmission({ redMeat: 2, chickenFish: 3, vegetarian: 5 }),
        20.22
    );
    assert.equal(Calculator.calculateFoodEmission({}), 0);
});

test('calculateWasteEmission applies the factor only to the non-recycled fraction', () => {
    const Calculator = loadCalculator();
    assert.equal(Calculator.calculateWasteEmission(10, 0), 5);
    assert.equal(Calculator.calculateWasteEmission(10, 50), 2.5);
});

test('calculateWasteEmission clamps recycledPercent to the 0-100 range', () => {
    const Calculator = loadCalculator();
    assert.equal(Calculator.calculateWasteEmission(10, 150), 0);
    assert.equal(Calculator.calculateWasteEmission(10, -20), 5);
});

test('calculateTotalFootprint sums all categories and ranks them by emission', () => {
    const Calculator = loadCalculator();
    const result = Calculator.calculateTotalFootprint({
        energy: 10,
        transport: { car: 10 },
        food: { redMeat: 2 },
        waste: { kg: 10, recycledPercent: 0 }
    });

    assert.equal(result.total, 20.24);
    assert.deepEqual(
        JSON.parse(JSON.stringify(result.byCategory.map((entry) => entry.category))),
        ['food', 'waste', 'transport', 'energy']
    );
    assert.equal(result.byCategory[0].percentageOfTotal, 65.32);
    assert.equal(result.byCategory[1].percentageOfTotal, 24.7);
    assert.equal(result.byCategory[2].percentageOfTotal, 5.93);
    assert.equal(result.byCategory[3].percentageOfTotal, 4.05);
    assert.equal(result.vsNationalAverage, -78.69);
});

test('calculateTotalFootprint returns all zeros without dividing by zero when every input is empty', () => {
    const Calculator = loadCalculator();
    const result = Calculator.calculateTotalFootprint({
        energy: 0,
        transport: {},
        food: {},
        waste: { kg: 0, recycledPercent: 0 }
    });

    assert.equal(result.total, 0);
    result.byCategory.forEach((entry) => {
        assert.equal(entry.emission, 0);
        assert.equal(entry.percentageOfTotal, 0);
    });
    assert.equal(result.vsNationalAverage, -100);
});

test('calculateCarbonCredits converts kg of CO2 into credits', () => {
    const Calculator = loadCalculator();
    assert.equal(Calculator.calculateCarbonCredits(20.24), 0.0202);
    assert.equal(Calculator.calculateCarbonCredits(0), 0);
});

test('estimateCreditPrice returns min, max and average BRL price', () => {
    const Calculator = loadCalculator();
    const price = Calculator.estimateCreditPrice(0.0202);
    assert.equal(price.min, 1.01);
    assert.equal(price.max, 3.03);
    assert.equal(price.average, 2.02);
});
