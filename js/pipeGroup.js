var PipeGroup = function(dom1, dom2, arr, w, h, x1, y1, w1, h1, x2, y2, w2, h2, spd) {
    this.dom1 = dom1;
    this.dom2 = dom2;
    this.arr = arr;
    this.w = w;
    this.h = h;

    this.x1 = x1;
    this.y1 = y1;
    this.w1 = w1;
    this.h1 = h1;

    this.x2 = x2;
    this.y2 = y2;
    this.w2 = w2;
    this.h2 = h2;

    this.spd = spd;
};
PipeGroup.prototype.move = function() {
    this.x1 -= this.spd;
    this.x2 -= this.spd;
    if (this.x1 < -(this.w1 + 300)) {
        var sibGroup = this.arr[this.arr.length - 1];
        this.x1 = sibGroup.x1 + 300;
        this.x2 = sibGroup.x1 + 300;
        // 重置高度
        this.h1 = 30 + parseInt(Math.random() * 300);
        this.h2 = 360 - this.h1;
        this.y2 = 560 - this.h2;
        this.arr.shift();
        this.arr.push(this);
    }
}