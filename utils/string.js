String.prototype.center = function(n) {
    let l = Math.floor((n - this.length) / 2);
    let r = n - l - this.length;
    return `${' '.repeat(l)}${this}${' '.repeat(r)}`;
}


String.prototype.replaceSpecial = function() {
    let rep = ['NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', '\\t', '\\n', '\\v', '\\f', '\\r', 'SO', 'SI', 'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US', 'space'];
    if(this.includes('\x7F'))
        return this.replace(/\x7F/g, 'DEL');
    for(let i = 0; i < rep.length; i++) {
        let c = String.fromCharCode(i);
        if(this.includes(c))
            return this.replace(new RegExp(c, 'g'), rep[i]);
    }
    return this;
}


String.prototype.BF = function() {
    let s = this.replace(/[^><\+\-.,[\]#]|[ \t\n]/g, '');
    if(BF_INP.dbg_mode) return s;
    return s.replace(/#/g, '');
}