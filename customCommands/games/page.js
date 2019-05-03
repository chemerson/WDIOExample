// Creating page objects this way allows us to set functions as value properties on the object prototype
// without explicitly using setter or getter accessors.

exports.createPage = function (pageObject) {
    return Object.create(Object.prototype, pageObject);
};

/**
 * Given a selector, returns an object with a WebElement and the selector string
 * @param {*} selector
 */
exports.elementBy = function (selector) {
    return {
        get() {
            let element = $(selector);
            element.selector = selector;
            return element;
        },
    };
};

/**
 * Given a selector, returns and object with an array of WebElements and the selector string
 * @param {*} selector
 */
exports.elementsBy = (selector) => {
    return {
        get() {
            let elements = $$(selector);
            elements.selector = selector;
            return elements;
        },
    };
};
