var Score = function(x, y, w, h, points) {
    this.points = points;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};
Score.prototype.add = function() {
    this.points ++;
};