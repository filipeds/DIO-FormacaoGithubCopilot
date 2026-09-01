/**
 * UI - Global UI object for rendering and DOM manipulation
 * Contains utility methods and rendering functions for the footprint
 * calculator interface
 */
const UI = {
    /**
     * UTILITY METHODS
     */

    /**
     * Format a number with specified decimal places using pt-BR conventions
     * @param {number} number - number to format
     * @param {number} decimals - number of decimal places
     * @returns {string} formatted number string
     */
    formatNumber: function(number, decimals) {
        const decimalPlaces = decimals === undefined ? 2 : decimals;
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        });
    },

    /**
     * Format a value as Brazilian Real currency
     * @param {number} value - value to format
     * @returns {string} formatted currency string
     */
    formatCurrency: function(value) {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    },

    /**
     * Show an element by removing the 'hidden' class
     * @param {string} elementId - id of the element to show
     */
    showElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    },

    /**
     * Hide an element by adding the 'hidden' class
     * @param {string} elementId - id of the element to hide
     */
    hideElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    },

    /**
     * Smoothly scroll to an element
     * @param {string} elementId - id of the element to scroll to
     */
    scrollToElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    /**
     * RENDERING METHODS
     */

    /**
     * Render the total weekly footprint and its comparison to the national average
     * @param {Object} totalData - { total, vsNationalAverage }
     * @returns {string} HTML string
     */
    renderTotal: function(totalData) {
        const isAboveAverage = totalData.vsNationalAverage > 0;
        const comparisonClass = isAboveAverage
            ? 'total-summary__comparison--bad'
            : 'total-summary__comparison--good';
        const comparisonSign = isAboveAverage ? '+' : '';
        const comparisonText = isAboveAverage
            ? 'acima da média nacional'
            : 'abaixo da média nacional';

        return `
            <h2 class="section-title">Sua Pegada de Carbono Semanal</h2>
            <div class="total-summary">
                <div>
                    <p class="total-summary__value">${this.formatNumber(totalData.total)} kg</p>
                    <p class="total-summary__label">CO₂ por semana</p>
                </div>
                <div class="total-summary__comparison ${comparisonClass}">
                    ${comparisonSign}${this.formatNumber(totalData.vsNationalAverage)}% ${comparisonText}
                </div>
            </div>
        `;
    },

    /**
     * Render the emission breakdown by category, with a proportional bar per category
     * @param {Array} byCategoryArray - [{ category, emission, percentageOfTotal }], sorted highest first
     * @returns {string} HTML string
     */
    renderCategoryBreakdown: function(byCategoryArray) {
        const self = this;
        const items = byCategoryArray.map(function(entry) {
            const meta = CONFIG.CATEGORY_META[entry.category];
            return `
                <div class="category-item">
                    <div class="category-item__header">
                        <span class="category-item__label">
                            <span>${meta.icon}</span>
                            <span>${meta.label}</span>
                        </span>
                        <span class="category-item__value">${self.formatNumber(entry.emission)} kg (${self.formatNumber(entry.percentageOfTotal)}%)</span>
                    </div>
                    <div class="category-item__bar-container">
                        <div class="category-item__bar" style="width: ${entry.percentageOfTotal}%;"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <h2 class="section-title">Detalhamento por Categoria</h2>
            <div class="category-list">${items}</div>
        `;
    },

    /**
     * Render the carbon credits needed and their estimated price range
     * @param {Object} creditsData - { credits, price: { min, max, average } }
     * @returns {string} HTML string
     */
    renderCarbonCredits: function(creditsData) {
        return `
            <h2 class="section-title">Créditos de Carbono para Compensar</h2>
            <div class="credits-grid">
                <div class="credits-card">
                    <p class="credits-card__title">Créditos Necessários</p>
                    <p class="credits-card__value">${this.formatNumber(creditsData.credits, 4)}</p>
                </div>
                <div class="credits-card">
                    <p class="credits-card__title">Custo Estimado</p>
                    <p class="credits-card__value">${this.formatCurrency(creditsData.price.average)}</p>
                </div>
            </div>
            <p class="footer__credits" style="margin-top: 1rem;">
                Faixa de preço: ${this.formatCurrency(creditsData.price.min)} - ${this.formatCurrency(creditsData.price.max)}
                &middot; 1 crédito compensa 1.000 kg de CO₂
            </p>
        `;
    },

    /**
     * Show loading state on a button
     * @param {HTMLElement} buttonElement - button element to show loading state on
     */
    showLoading: function(buttonElement) {
        buttonElement.dataset.originalText = buttonElement.innerHTML;
        buttonElement.disabled = true;
        buttonElement.classList.add('is-loading');
        buttonElement.innerHTML = '<span class="spinner"></span>Calculando...';
    },

    /**
     * Hide loading state and restore the button
     * @param {HTMLElement} buttonElement - button element to restore
     */
    hideLoading: function(buttonElement) {
        buttonElement.disabled = false;
        buttonElement.classList.remove('is-loading');
        if (buttonElement.dataset.originalText) {
            buttonElement.innerHTML = buttonElement.dataset.originalText;
        }
    }
};
