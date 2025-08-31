// utils/domUtils.js

/**
 * Safely query a single DOM element
 * @param {string} selector - CSS selector
 * @param {Element|Document} scope - Optional scope to search within
 * @returns {Element|null}
 */
export function $(selector, scope = document) {
    return scope.querySelector(selector);
}

/**
 * Safely query multiple DOM elements
 * @param {string} selector - CSS selector
 * @param {Element|Document} scope - Optional scope to search within
 * @returns {NodeListOf<Element>}
 */
export function $all(selector, scope = document) {
    return scope.querySelectorAll(selector);
}

/**
 * Extract text content from a selector
 * @param {string} selector
 * @param {Element|Document} scope
 * @returns {string|null}
 */
export function getText(selector, scope = document) {
    const el = $(selector, scope);
    return el ? el.textContent.trim() : null;
}

/**
 * Extract attribute value from a selector
 * @param {string} selector
 * @param {string} attr
 * @param {Element|Document} scope
 * @returns {string|null}
 */
export function getAttr(selector, attr, scope = document) {
    const el = $(selector, scope);
    return el ? el.getAttribute(attr) : null;
}

/**
 * Check if an element exists
 * @param {string} selector
 * @param {Element|Document} scope
 * @returns {boolean}
 */
export function exists(selector, scope = document) {
    return !!$(selector, scope);
}
