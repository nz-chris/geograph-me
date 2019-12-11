class Bem {
    constructor(base, className=base) {
        this.b = base;
        this.c = className;
    }

    toString() {
        return this.c;
    }

    toArrayOfStrings() {
        return this.c.split(' ');
    }

    static argCheck(arg) {
        const isOk = (arg) => {
            if (!arg) return false;
            if (typeof arg !== 'string') return false;
            if (!/^[a-z0-9-]+$/.test(arg)) return false;
            if (/__/.test(arg)) return false;
            if (/--/.test(arg)) return false;
            if (/^[_-]/.test(arg) || /[_-]$/.test(arg)) return false;
            return true;
        };
        if (!isOk(arg)) {
            throw new Error(`Invalid Bem argument: \`${arg}\`. Argument must only contain lowercase letters, digits, non-consecutive underscores, non-consecutive dashes, and must not begin or end with an underscore or dash.`);
        }
    }

    el(element) {
        Bem.argCheck(element);
        if (/(__)|(--)/.test(this.c)) {
            throw new Error(`Invalid Bem \`el\` invocation: Current class name \`${this.c}\` already contains an element or modifier.`);
        }
        const b = `${this.b}__${element}`;
        return new Bem(b, b);
    }

    mod(modifier) {
        Bem.argCheck(modifier);
        const c = this.c + ` ${this.b}--${modifier}`;
        return new Bem(this.b, c);
    }

    mods(...modifiers) {
        let c = this.c;
        for (const modifier of modifiers) {
            Bem.argCheck(modifier);
            c += ` ${this.b}--${modifier}`;
        }
        return new Bem(this.b, c);
    }

    modIf(modifier, condition) {
        Bem.argCheck(modifier);
        if (condition) {
            return this.mod(modifier);
        } else {
            return new Bem(this.b, this.c);
        }
    }

    modIfElse(modifier, condition, elseModifier) {
        if (condition) {
            return this.mod(modifier);
        } else {
            return this.mod(elseModifier);
        }
    }
}

const bem = block => {
    if (/^[0-9]/.test(block)) {
        throw new Error(`Invalid Bem block: \`${block}\`. Block must not start with a digit.`);
    }
    Bem.argCheck(block);
    return new Bem(block);
};

export default bem;
