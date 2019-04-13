class Enumeration {
    constructor(obj) {
        if (new Set(Object.values(obj)).size !== Object.values(obj).length) {
            throw new Error('Must not have duplicate Enumeration values.')
        }
        if (Object.values(obj).some(val => typeof val !== 'object')) {
            throw new Error('Enumeration values must be objects.')
        }
        for (const [key, val] of Object.entries(obj)) {
            this[key] = Object.freeze(val);
        }
        return Object.freeze(this)
    }
    has = (aVal) => {
        return Object.values(this).some(val => val === aVal)
    }
}

export default Enumeration;
