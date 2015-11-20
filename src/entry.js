require("./assets/css/style.css");

var Iceleaf = require('./iceleaf');
var iceleaf = new Iceleaf(document.body);

iceleaf.start();

iceleaf.sprite(10,'assets/res/bg1.png',[0,0,900,300]);
iceleaf.addto(10,-1,10,[200,0],255);


setTimeout(()=>{
    iceleaf.remove(10)  
},1500)

// setTimeout(()=>{
//     iceleaf.anchor_set(10,'bottomcenter')
//     iceleaf.addto(10,-1,10,[640,360],255);
// },5000)


//test

var SoundManager = require('./Classes/SoundManager');

iceleaf.bgm('assets/res/op_cut.mp3',true,50,0,5000);



PIXI.loader.add('animate', 'assets/res/LineBreak_a.png').load((loader,resources)=>{

let Animation = require('./Classes/Animation');

let ani = new Animation();

ani
// .setFile(["assets/res/ch-1.png","assets/res/ch-2.png","assets/res/ch-3.png"])
// .setType('multifiles')
.setFile('assets/res/LineBreak_a.png')
.setType('horizontal')
.setFrame(16)
.setLoopType('bouncing')
.setInterval(33)
.setIndex(100)
.setLoop(true)
//.setDelay(2000)
.exec();


iceleaf.stage.addChild(ani);
    
})

iceleaf.sprite(90,"assets/res/BG32a_1280.jpg");
iceleaf.addto(90,-1);


iceleaf.textsprite(100,"TextSprite 测试",0xffcc00,20,"思源黑体 CN Light");
iceleaf.addto(100,-1,100,[745,25],255)

iceleaf.textwindow("assets/res/textwindow.png",0.8,[126,450],[20,55,1008,231]);
//iceleaf.textwindow(0x333333,0.8,[50,50]);
iceleaf.texton();

iceleaf.textstyle({
    name: "思源黑体 CN Regular",
    size: 24,
    color: 0x000000,
    bold: false,
    italic: false,
    shadow: false,
    shadowColor: 0xffffff,
    stroke: false

})

iceleaf.text('你好，世界！');

iceleaf.textspeed(100)

iceleaf.text('abcde,ABCD, 这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。');



