function Interpreter(cells = 30000) {
    this.stack = new Array(cells).fill(0);
    this.code  = editor.getValue().BF();
    this.mp    = 0; // memory pointer
    this.ip    = 0; // instruction pointer
    this.inpi  = 0; // input iterator
    this.start = new Map();
    this.end   = new Map();
}


Interpreter.prototype.data = function() {
    return {
        stack: this.stack,
        code: this.code,
        ip: this.ip,
        mp: this.mp
    };
},


Interpreter.prototype.eoc = function() {
    return this.ip >= this.code.length;
}


Interpreter.prototype.init = function() {
    let stack = [];
    for(let i = 0; i < this.code.length; i++)
        if(this.code[i] == '[') stack.push(i);
        else if(this.code[i] == ']') {
            let start = stack.pop();
            this.start[i] = start;
            this.end[start] = i;
        }
}


Interpreter.prototype.step = function(by = 1) {
    switch(this.code[this.ip]) {
        case '>':
            if(++this.mp >= this.stack.length)
                this.mp = 0;
            break;
        case '<':
            if(--this.mp < 0)
                this.mp = this.stack.length - 1;
            break;
        case '+':
            if(++this.stack[this.mp] > 255)
                this.stack[this.mp] = 0;
            break;
        case '-':
            if(--this.stack[this.mp] < 0)
                this.stack[this.mp] = 255;
            break;
        case '.':
            BF_INP.el.output.value += String.fromCharCode(this.stack[this.mp]);
            break;
        case ',':
            if(this.inpi >= BF_INP.el.input.value.length) break;
            this.stack[this.mp] = BF_INP.el.input.value.charCodeAt(this.inpi++);
            break;
        case '[':
            if(this.stack[this.mp] == 0)
                this.ip = this.end[this.ip];
            break;
        case ']':
            if(this.stack[this.mp] != 0)
                this.ip = this.start[this.ip];
            break;
    }
    this.ip += by;
}


Interpreter.prototype.skip = function() {
    this.ip++;
}


Interpreter.prototype.run = function() {
    while(this.ip < this.code.length)
        this.step();
}