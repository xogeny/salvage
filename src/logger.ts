export interface Logger {
    enter(a: any, b: any): void;
    fact(msg: string): void;
    leave(c: any): void;
    done(): void;
}

export class ConsoleLogger implements Logger {
    depth: number;
    stack: Array<[any, any]> = [];
    constructor(private silent: boolean) {
        this.depth = 0;
        this.stack = [];
    }
    private prefix(): string {
        let ret = "";
        for (let i = 0; i < this.depth; i++) {
            ret = ret + "  ";
        }
        return ret;
    }
    enter(a: any, b: any) {
        if (!this.silent) console.log(this.prefix() + "Comparing ", a, " to ", b, "...");
        this.depth++;
        this.stack.push([a, b]);
    }
    fact(msg: string) {
        if (!this.silent) console.log(this.prefix() + "=> " + msg);
    }
    leave(c: any) {
        this.depth--;
        if (this.stack.length > 0) {
            let context = this.stack.pop();
            if (!this.silent) {
                if (context[0] === c) {
                    console.log(this.prefix()+"... result from A: ", c);
                } else if (context[1] === c) {
                    console.log(this.prefix()+"... result from B: ", c);
                } else {
                    console.log(this.prefix()+"... new result: ", c);
                }
            }
        } else {
            if (!this.silent) {
                console.log(this.prefix()+"... result: ", c);
            }
        }
        if (this.depth < 0) {
            throw new Error("Called log.leave too many time");
        }
    }
    done() {
        if (this.depth !== 0) {
            throw new Error("Improper nesting for logger, final depth was " + this.depth + " and stack was: " + JSON.stringify(this.stack));
        }
    }
}