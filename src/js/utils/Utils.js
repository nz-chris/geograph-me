export default {
    /**
     * Shuffle array in place.
     * @param {Array} a items An array containing the items.
     */
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },
    el(base, element) {
        return base + '__' + element;
    },
    mod(base, modifier) {
        return base + '--' + modifier;
    },
    elMod(base, element, modifier) {
        return this.mod(this.el(base, element), modifier)
    }
};