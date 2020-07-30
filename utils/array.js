Array.prototype.add = function(e) {
    if(typeof e === 'object')
        return this.concat(e);
    this.push(e);
    return this;
}


Array.prototype.prev = function(n, i) {
    let prev = [];
    while(prev.length != n)
        prev.push((--i < 0 ? i = this.length - 1 : i).pad(5));
    return prev.reverse();
}


Array.prototype.next = function(n, i) {
    let next = [];
    while(next.length != n)
        next.push((++i >= this.length ? i = 0 : i).pad(5));
    return next;
}