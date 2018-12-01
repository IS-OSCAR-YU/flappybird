var Ground = function(dom, arr, x, y, w, h, spd) {
    this.dom = dom;
    this.arr = arr;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.spd = spd;
};
Ground.prototype.move = function() {
    this.x -= this.spd;
    if (this.x <= - 3 * this.w) {
        var sib = this.arr[this.arr.length - 1];
        this.x = sib.x + this.w;
        this.arr.shift();
        this.arr.push(this);
    }
};