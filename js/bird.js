var Bird = function(domArr, x, y) {
    this.dom = domArr[1];
    this.domArr = domArr;
    this.x = x;
    this.y = y;
    this.count = 0;
    this.flyUp = true;
    this.freq = 0;

    this.domIndex = 1;
    this.domSwitchFreq = 0;
    this.domIndexDir = 0;

    this.rotateRate = Math.PI / 180;
    this.rotateCount = 0;
    this.rotateCountFreq = 0;
    this.rotateCountMin = -16;
    this.rotateCountMax = 64;
    this.rotateDir = 2;
    this.rotatefreq = 0;

    this.downDelayCount = 0;
    this.countForDown = 0;
    this.ori_y = 0;

    this.setUp = false;
    this.countForUp = 0;
    this.upFreq = 0;
    this.upTimer = null;
    this.varcount = 1;

    this.start = false; // 开启游戏标识（等待状态标识）
};

/**
 * 等候形态（开始游戏后应该禁用）
 */
Bird.prototype.move = function() {
    if (this.start) {
        return;
    }
    this.freq ++;
    if (this.freq % 3 != 0) {
        return;
    }
    this.freq = 0;
    if (this.flyUp) {
        this.y -= 0.5;
        this.count++;
        if (this.count == 40) {
            this.flyUp = false;
        }
    } else {
        this.y += 0.5;
        this.count--;
        if (this.count == 0) {
            this.flyUp = true;
        }
    }
};
Bird.prototype.swing = function() {
    this.domSwitchFreq++;
    if (this.domSwitchFreq % 40 != 0) {
        return;
    }
    this.domSwitchFreq = 0;

    if (this.domIndexDir == 0) {
        this.domIndex += 1;
    } else if (this.domIndexDir == 1) {
        this.domIndex -= 1;
    }
    
    if (this.domIndex == 2) {
        this.domIndexDir = 1;
    } else if (this.domIndex == 0) {
        this.domIndexDir = 0;
    }
};

// S=vt-（at^2）/2
Bird.prototype.up = function() {

    this.start = true;

    this.setUp = true;
    this.rotateDir = 0;

    this.countForDown = 0; // 清除下降过程时间计数
    this.downDelayCount = 0; // 清除下降延时器
    this.rotateCountFreq = 0; // 清除下降角度计数器

    var sef = this;
    if (this.upTimer != null) {
        clearInterval(this.upTimer);
        this.countForUp = 0;
        this.ori_y = sef.y; // 实时更新用于下降的参考高度
    }
    var origin_y = this.y; // 保存当前未弹跳高度
    this.upTimer = setInterval(function() {
        sef.y = origin_y - (40 * sef.countForUp - (10 * Math.pow(sef.countForUp, 2) / 2));
        sef.countForUp += 0.1;
        if (sef.countForUp >= 4) {
            sef.countForUp = 0;
            sef.rotateDir = 1;
            sef.setUp = false;
            sef.ori_y = sef.y; // 实时更新用于下降的参考高度
            clearInterval(sef.upTimer);
        }
    }, 3);
};
Bird.prototype.rotateAndMove = function() {
    this.rotatefreq++;
    if (this.rotatefreq % 2 != 0) {
        return;
    }
    this.rotatefreq = 0;

    if (this.rotateDir == 0) {
        this.rotateCount = this.rotateCountMin;
    } else if (!this.setUp && this.rotateDir == 1) {
        this.y = this.ori_y + (10 * Math.pow(this.countForDown, 2) / 2);
        this.countForDown += 0.1;
        if (this.downDelayCount < 40) {
            this.downDelayCount++;
            return;
        }

        if (this.rotateCount >= this.rotateCountMax) {
            this.rotateCountFreq = 0;
            this.rotateCount = 88;
            this.downDelayCount = 0;
            return;
        }
        this.rotateCount = Math.pow(1.5, this.rotateCountFreq++); 
    }
};
