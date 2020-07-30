Number.prototype.pad = function(n = 1) {
    let s = String(this);
    while(s.length < n)
        s = '0' + s;
    return s;
}


Number.prototype.center = function(n) {
    return String(this).center(n);
}