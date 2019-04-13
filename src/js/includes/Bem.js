class Bem {
    constructor(base, className=base) {
        this.b = base;
        this.c = className;
    }

    toString() {
        return this.c;
    }

    static argCheck(arg) {
        const isOk = (arg) => {
            if (!arg) return false;
            if (typeof arg !== 'string') return false;
            if (!/^[a-z-]+$/.test(arg)) return false;
            if (/--/.test(arg)) return false;
            if (!/[a-z]/.test(arg.charAt(0)) || !/[a-z]/.test(arg.charAt(arg.length - 1))) return false;
            return true;
        };
        if (!isOk(arg)) {
            throw new Error(`Invalid Bem argument: \`${arg}\`. Argument must only contain lowercase letters, and non-consecutive dashes, and must not begin or end with a dash.`);
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

const b = (block) => { Bem.argCheck(block); return new Bem(block) };
export default b;
