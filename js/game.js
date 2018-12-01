/**
 * endGame & birdUnderGround控制游戏是否结束
 * 
 * 像素鸟游戏特性：
 * 小鸟等待特效（上下波动）
 * 小鸟点击上升减速上升
 * 小鸟自由落体下降效果
 * 小鸟碰撞检测（包括飞出视口）
 * 计分功能
 * 碰撞后自由落下效果
 * 碰撞后显示总分数（减速下滑），重新开始，分享和添加分数到排行榜功能
 * 
 * 不足：管道动画有点掉帧，小鸟动画物理特性不够好（相比于原版：https://flappybird.io/）
 * 
 * 下一版本：重新开始游戏和记录历史最佳分数（依赖前者）
 * 敬请期待...
 * 
 * @param {*} pen 
 * @param {*} w 
 * @param {*} h 
 * @param {*} background 
 * @param {*} groundArr 
 * @param {*} pipeArr 
 * @param {*} bird 
 * @param {*} score 
 * @param {*} gameBord 
 */
var Game = function(pen, w, h, background, groundArr, pipeArr, bird, score, gameBord) {
    this.pen = pen;
    this.w = w;
    this.h = h;
    this.background = background;
    this.groundArr = groundArr;
    this.pipeArr = pipeArr;
    this.bird = bird;
    this.score = score;
    this.gameBord = gameBord;

    this.startGame = false;

    this.timer = null;
    this.endGame = false;
    this.birdUnderGround = false;

    this.hasDelayBord = false;

    this.canMove = true;

    this.count = 0;
};
Game.prototype.init = function() {
    var sef = this;
    this.timer = setInterval(function() {
        sef.pen.clearRect(0, 0, sef.w, sef.h);
        sef.renderBackground();
        
        if (sef.startGame) {
            sef.renderPipe();
        }

        sef.renderBird();

        sef.renderGround();

        sef.renderScore();
        
        if (sef.endGame && sef.birdUnderGround /* 直到鸟落到地面上 */) {
            if (!sef.hasDelayBord) {
                setTimeout(function () {
                    sef.hasDelayBord = true;
                    sef.renderGameBord();
                }, 400);
            } else {
                sef.renderGameBord();
            }
        }
    }, 5);
};
Game.prototype.renderBackground = function() {
    this.pen.beginPath();
    this.pen.drawImage(this.background.dom, this.background.x, 
        this.background.y, this.background.w, this.background.h);
    this.pen.closePath();
};
Game.prototype.renderGround = function() {
    this.pen.beginPath();
    var pen = this.pen;
    var sef = this;
    this.groundArr.forEach(function(value, index) {
        pen.drawImage(value.dom, value.x, value.y, value.w, value.h);
        if (!sef.endGame) { /* 停止游戏地面停止运动 */
            value.move();
        }
    });
    this.pen.closePath();
};
Game.prototype.renderPipe = function() {
    this.pen.beginPath();
    var pen = this.pen;
    var sef = this;
    this.pipeArr.forEach(function(value, index) {
        pen.drawImage(value.dom1, 0, 494 - value.h1, value.w1, value.h1, value.x1, value.y1, value.w1, value.h1);
        pen.drawImage(value.dom2, 0, 0, value.w2, value.h2, value.x2, value.y2, value.w2, value.h2);
        if (!sef.endGame) {
            value.move();
        }
    });
    this.pen.closePath();
};
Game.prototype.renderBird = function() {
    var pen = this.pen;
    pen.save();
    pen.beginPath();
    pen.translate(this.bird.x, this.bird.y);

    pen.rotate(this.bird.rotateRate * this.bird.rotateCount);

    pen.drawImage(this.bird.domArr[this.bird.domIndex], -28, -20, 56, 40);
    // pen.strokeRect(-28, -20, 56, 40);
    // pen.stroke();

    if (!this.endGame) {
        this.bird.move();
        this.bird.swing();
    }

    if (!this.birdUnderGround) {
        this.bird.rotateAndMove(); // 继续调整下降角度和下降操作
    }
 
    pen.closePath();
    pen.restore();

    // 检测是否撞上管子，直接将游戏状态改为结束，主要解除鼠标控制
    this.checkHitWall();

    if (!this.endGame) {
        this.checkAddScore();
    }
    
    if (this.bird.y >= this.h - 80) { /* 判断bird是否撞墙 */
        this.endGame = true;
        this.birdUnderGround = true;
        this.gameBord.currPoint = this.score.points; /* 记录分数（当前） */
    }
};
Game.prototype.checkHitWall = function() {
    if (this.endGame) {
        return;
    }
    var l1 = [this.bird.x - 20, this.bird.y - 20];
    var l2 = [this.bird.x + 20, this.bird.y - 20];
    var l3 = [this.bird.x - 20, this.bird.y + 20];
    var l4 = [this.bird.x + 20, this.bird.y + 20];
    var rectArr = [];
    rectArr.push(l1);
    rectArr.push(l2);
    rectArr.push(l3);
    rectArr.push(l4);

    var pipeArr = this.pipeArr;

    for (var i = 0; i < 2; i++) {
        if (rectArr[i][1] < this.h - 80 && rectArr[i][1] > 0) {
            for (var j = 0; j < pipeArr.length; j++) {
                if (rectArr[i][0] >= pipeArr[j].x1 && rectArr[i][0] < pipeArr[j].x1 + pipeArr[j].w1) {
                    if (rectArr[i][1] <= pipeArr[j].y1 + pipeArr[j].h1) {
                        this.endGame = true;
                        return;
                    }
                    if (rectArr[i][1] >= pipeArr[j].y2) {
                        this.endGame = true;
                        return;
                    }
                }
            }
        } else if (rectArr[i][1] < 0) { // 外部
            for (var j = 0; j < pipeArr.length; j++) {
                if (rectArr[i][0] >= pipeArr[j].x1 && rectArr[i][0] < pipeArr[j].x1 + pipeArr[j].w1) {
                    this.endGame = true;
                    return;
                }
            }
        }
    }
};
Game.prototype.checkAddScore = function() {
    var base = this.bird.x - 28;
    for (var i = 0; i < this.pipeArr.length; i++) {
        if (base == this.pipeArr[i].x1 + this.pipeArr[i].w1) {
            this.score.add();
        }
    }
    
};
Game.prototype.renderScore = function() {
    if (this.endGame) {
        return;
    }
    var pen = this.pen;
    pen.save();
    pen.beginPath();
    pen.translate(this.w / 2, 140);
    pen.font = "54px Score";
    pen.strokeStyle = "#000";
    pen.lineWidth = 2.5;
    pen.fillStyle = "#fff";
    pen.fillText(this.score.points, this.score.x, this.score.y);
    pen.strokeText(this.score.points, this.score.x, this.score.y);
    pen.fill();
    pen.stroke();
    pen.closePath();
    pen.restore();
};
Game.prototype.renderGameBord = function() {
    var pen = this.pen;
    pen.save();
    pen.beginPath();
    // 绘制GameBord
    pen.drawImage(this.gameBord.domScore, this.gameBord.scoreX, this.gameBord.scoreY, this.gameBord.scoreW, this.gameBord.scoreH);
    pen.drawImage(this.gameBord.domRes, this.gameBord.resX, this.gameBord.resY, this.gameBord.resW, this.gameBord.resH);
    pen.drawImage(this.gameBord.domShare, this.gameBord.shareX, this.gameBord.shareY, this.gameBord.shareW, this.gameBord.shareH);
    pen.drawImage(this.gameBord.domAddBord, this.gameBord.addBordX, this.gameBord.addBordY, this.gameBord.addBordW, this.gameBord.addBordH);

    pen.font = "36px Score";
    pen.strokeStyle = "#000";
    pen.lineWidth = 2.3;
    pen.fillStyle = "#fff";
    pen.fillText(this.gameBord.currPoint, this.gameBord.currX, this.gameBord.currY);
    pen.strokeText(this.gameBord.currPoint, this.gameBord.currX, this.gameBord.currY);
    pen.fillText(this.gameBord.bestPoint, this.gameBord.bestX, this.gameBord.bestY);
    pen.strokeText(this.gameBord.bestPoint, this.gameBord.bestX, this.gameBord.bestY);
    pen.fill();
    pen.stroke();
    
    this.gameBord.move(this.timer);
    
    pen.closePath();
    pen.restore();
};
Game.prototype.restart = function() {
    this.endGame = false;
    this.canMove = true;
    this.init();
};