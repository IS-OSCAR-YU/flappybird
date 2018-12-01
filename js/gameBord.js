var GameBord = function(domScore, scoreX, scoreY, scoreW, scoreH, 
    domRes, resX, resY, resW, resH, domShare, shareX, shareY, shareW, shareH, 
    domAddBord, addBordX, addBordY, addBordW, addBordH,
    currPoint, currX, currY, bestPoint, bestX, bestY) {
    
    this.domScore = domScore;
    this.scoreX = scoreX;
    this.scoreY = scoreY;
    this.ori_scoreY = scoreY;
    this.scoreW = scoreW;
    this.scoreH = scoreH;

    this.domRes = domRes;
    this.resX = resX;
    this.resY = resY;
    this.ori_resY = resY;
    this.resW = resW;
    this.resH = resH;

    this.domShare = domShare;
    this.shareX = shareX;
    this.shareY = shareY;
    this.ori_sharY = shareY;
    this.shareW = shareW;
    this.shareH = shareH;

    this.domAddBord = domAddBord;
    this.addBordX = addBordX;
    this.addBordY = addBordY;
    this.ori_addBY = addBordY;
    this.addBordW = addBordW;
    this.addBordH = addBordH;

    this.currPoint = currPoint;
    this.currX = currX;
    this.currY = currY;
    this.ori_cY = currY;

    this.bestPoint = bestPoint;
    this.bestX = bestX;
    this.bestY = bestY;
    this.ori_bY = bestY;

    this.t = 0;
    this.freq = 0;

    this.sum = 0;
};
GameBord.prototype.move = function(timer) {
    this.freq++;
    if (this.freq % 4 != 0) {
        return;
    }
    this.freq = 0;
    if (this.t >= 4) {
        var timeout = setTimeout(function() {
            clearInterval(timer);
            clearTimeout(timeout);
        }, 2000);
        
        return;
    }
    var s = 40 * this.t - (10 * Math.pow(this.t, 2) / 2);
    s = s / 2;
    this.scoreY = this.ori_scoreY + s;
    this.resY = this.ori_resY + s;
    this.shareY = this.ori_sharY + s;
    this.addBordY = this.ori_addBY + s;
    this.currY  = this.ori_cY + s;
    this.bestY = this.ori_bY + s;
    this.t += 0.1;
};