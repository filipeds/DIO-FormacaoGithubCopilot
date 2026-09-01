/**
 * app.js - Main application file
 * Wires the form to Calculator and UI: reads input, validates, calculates
 * and renders the weekly carbon footprint results
 */

document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('footprint-form');
    const submitButton = form.querySelector('.form-submit');

    form.addEventListener('submit', handleFormSubmit);

    console.log('✅ Calculadora de Pegada de Carbono inicializada!');

    /**
     * Read a numeric field from the DOM, defaulting to 0 for blank values
     * @param {string} elementId - id of the input element
     * @returns {number} parsed value, or NaN if the field holds invalid text
     */
    function readNumber(elementId) {
        const rawValue = document.getElementById(elementId).value.trim();
        if (rawValue === '') {
            return 0;
        }
        return parseFloat(rawValue);
    }

    /**
     * FORM SUBMIT HANDLER
     * @param {Event} event - form submit event
     */
    function handleFormSubmit(event) {
        event.preventDefault();

        const categoriesInput = {
            energy: readNumber('energy-kwh'),
            transport: {
                car: readNumber('transport-car'),
                bus: readNumber('transport-bus'),
                bicycle: readNumber('transport-bicycle'),
                walk: readNumber('transport-walk')
            },
            food: {
                redMeat: readNumber('food-red-meat'),
                chickenFish: readNumber('food-chicken-fish'),
                vegetarian: readNumber('food-vegetarian')
            },
            waste: {
                kg: readNumber('waste-kg'),
                recycledPercent: readNumber('waste-recycled')
            }
        };

        const allValues = [
            categoriesInput.energy,
            categoriesInput.transport.car,
            categoriesInput.transport.bus,
            categoriesInput.transport.bicycle,
            categoriesInput.transport.walk,
            categoriesInput.food.redMeat,
            categoriesInput.food.chickenFish,
            categoriesInput.food.vegetarian,
            categoriesInput.waste.kg,
            categoriesInput.waste.recycledPercent
        ];

        if (allValues.some(function(value) { return Number.isNaN(value); })) {
            alert('❌ Por favor, preencha os campos apenas com números válidos.');
            return;
        }

        if (allValues.some(function(value) { return value < 0; })) {
            alert('❌ Nenhum valor pode ser negativo.');
            return;
        }

        const onlyZerosOrEmpty = allValues.every(function(value) { return value === 0; });
        if (onlyZerosOrEmpty) {
            alert('❌ Preencha pelo menos uma categoria para calcular sua pegada de carbono.');
            return;
        }

        UI.showLoading(submitButton);
        UI.hideElement('resultado-total');
        UI.hideElement('resultado-categorias');
        UI.hideElement('resultado-creditos');

        setTimeout(function() {
            try {
                const totalData = Calculator.calculateTotalFootprint(categoriesInput);
                const carbonCredits = Calculator.calculateCarbonCredits(totalData.total);
                const creditPrice = Calculator.estimateCreditPrice(carbonCredits);

                const creditsData = {
                    credits: carbonCredits,
                    price: creditPrice
                };

                document.getElementById('resultado-total-content').innerHTML = UI.renderTotal(totalData);
                document.getElementById('resultado-categorias-content').innerHTML = UI.renderCategoryBreakdown(totalData.byCategory);
                document.getElementById('resultado-creditos-content').innerHTML = UI.renderCarbonCredits(creditsData);

                UI.showElement('resultado-total');
                UI.showElement('resultado-categorias');
                UI.showElement('resultado-creditos');
                UI.scrollToElement('resultado-total');

                console.log('✅ Cálculo concluído:', { total: totalData.total, credits: carbonCredits });
            } catch (error) {
                console.error('❌ Erro ao calcular a pegada de carbono:', error);
                alert('❌ Ocorreu um erro ao calcular sua pegada de carbono. Por favor, tente novamente.');
            } finally {
                UI.hideLoading(submitButton);
            }
        }, 1000);
    }

});
