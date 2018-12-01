window.onload = function() {
    var img_arr = [];
    img_arr.push("../image/add-to-leaderboard.png");
    img_arr.push("../image/background.png");
    img_arr.push("../image/share.png");
    img_arr.push("../image/ground.png");
    img_arr.push("../image/logo.png");
    img_arr.push("../image/pipe.png");
    img_arr.push("../image/pipe_d.png");
    img_arr.push("../image/restart.png");
    img_arr.push("../image/score.png");
    img_arr.push("../image/bird1.png");
    img_arr.push("../image/bird2.png");
    img_arr.push("../image/bird3.png");

    var loadImg = function(arr, callback) {
        var loadedimg_arr = [];
        var count = 0;
        arr.forEach(function(value, index) {
            var img = new Image();
            img.src = value;
            loadedimg_arr[index] = img;
            img.onload = function() {
                count++;
                if (count == arr.length) {
                    callback(loadedimg_arr);
                }
            };
        });
    };

    loadImg(img_arr, function(loadedimg_arr) {
        var can = document.getElementById("can");
        var pen = can.getContext("2d");

        var w = can.width;
        var h = can.height;

        // 初始化背景图
        var background = new Background(loadedimg_arr[1], 0, 0, w, h - 80);

        // 初始化地面数组
        var groundArr = [];
        var spd = 1;
        for (var i = 0; i < 48; i++) {
            var ground = new Ground(loadedimg_arr[3], groundArr, 22 * i, h - 80, 22, 80, spd);
            groundArr.push(ground);
        }

        // 初始化管道数组
        var pipeGroupArr = [];
        var spd = 1;
        var pipeGroup1 = new PipeGroup(loadedimg_arr[6], loadedimg_arr[5], pipeGroupArr, w, h, w, 0, 86, 100, w, h - 80 - 242, 86, 242, spd);
        var pipeGroup2 = new PipeGroup(loadedimg_arr[6], loadedimg_arr[5], pipeGroupArr, w, h, w + 300, 0, 86, 50, w + 300, h - 80 - 310, 86, 310, spd);
        var pipeGroup3 = new PipeGroup(loadedimg_arr[6], loadedimg_arr[5], pipeGroupArr, w, h, w + 600, 0, 86, 100, w + 600, h - 80 - 242, 86, 242, spd);
        var pipeGroup4 = new PipeGroup(loadedimg_arr[6], loadedimg_arr[5], pipeGroupArr, w, h, w + 900, 0, 86, 50, w + 900, h - 80 - 310, 86, 310, spd);
        pipeGroupArr.push(pipeGroup1);
        pipeGroupArr.push(pipeGroup2);
        pipeGroupArr.push(pipeGroup3);
        pipeGroupArr.push(pipeGroup4);

        // 创建鸟类
        var bird = new Bird(loadedimg_arr.slice(9, 12), w / 2 - 30, h / 2);

        // 积分器
        var score = new Score(-15, 0, 30, 45, 0);

        var gameBord = new GameBord(loadedimg_arr[8], 186, 146, 106, 141, 
            loadedimg_arr[7], 98, 320, 134, 47, 
            loadedimg_arr[2], 248, 320, 134, 47, 
            loadedimg_arr[0], 98, 382, 288, 47, 
            0, 228, 216, 0, 228, 266);

        // 创建game类
        var game = new Game(pen, w, h, background, groundArr, pipeGroupArr, bird, score, gameBord);

        this.game = game;
        game.init();
        
        can.onclick = function() {
            game.startGame = true;
            // console.log(game.endGame);
            if (!game.endGame) {
                bird.up();
                // score.add();
            }
        };
    });
};