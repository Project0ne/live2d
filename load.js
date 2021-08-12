
// ==UserScript==
// @name                #相亲相爱一嘉人#
// @description         在哔站右下角添加嘉然小姐的live2d模型
// @version             1.0.1
// @namespace           https://github.com/journey-ad
// @author              journey-ad
// @include             /^https:\/\/(www|live|space|t)\.bilibili\.com\/.*$/
// @icon                https://www.google.com/s2/favicons?domain=bilibili.com
// @license             GPL v2
// @run-at              document-end
// @grant               none
// ==/UserScript==

(async function () {
  'use strict';

  if (inIframe()) {
    console.log('iframe中不加载');
    return false;
  }

  const 引流 = [
  "https://islu.cn",
  ]

  const CUSTOM_CSS = `#pio-container {
  display: block !important;
  bottom: -0.3rem;
  z-index: 22637261;
  transition: transform 0.3s;
  cursor: grab;
}
#pio-container:hover {
  transform: translateY(-0.3rem);
}
#pio-container:active {
  cursor: grabbing;
}
#pio-container .pio-dialog {
  right: 10%;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.9);
}
#pio {
  height: 240px;
}
#pio-container[data-model='Diana'] .pio-action .pio-skin {
  background-image: url("https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/clothing.svg");
}

.pio-action span {
  background: none;
  background-size: 100%;
  border: 1px solid #fdcf7b;
  border: 0;
  width: 2em;
  height: 2em;
  margin-bottom: 0.6em;
}
.pio-action .pio-home {
    background-image: url("https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/index.svg");
}

.pio-action .pio-info {
    background-image: url("https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/link.svg");
}

.pio-action .pio-skin {
    background-image: url("https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/clothing.svg");
}
.pio-action .pio-night {
    background-image: url("https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/moon.svg");
}

.pio-action .pio-music {
  background-image: url("https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/music.svg");
}

.pio-action .pio-close {
    background-image: url("https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/close.png");
}
html[theme="dark"] .pio-action .pio-night{
    background-image: url("https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/sun.svg");
}
`

  // 用到的库
  const LIBS = [
    'https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/pio.css',
    'https://cdn.jsdelivr.net/gh/ialoe/live2d@master/dist/TweenLite.js',
    'https://cdn.jsdelivr.net/gh/ialoe/live2d@master/cubismcore/live2dcubismcore.min.js',
    'https://cdn.jsdelivr.net/gh/ialoe/live2d@master/dist/pixi.min.js',
    'https://cdn.jsdelivr.net/gh/ialoe/live2d@master/dist/cubism4.min.js',
    'https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/pio_sdk4.js',
    'https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/lib/pio.js'
  ]

  const reqArr = LIBS.map(src => loadSource(src))

  // 创建顺序加载队列
  const doTask = reqArr.reduce((prev, next) => prev.then(() => next()), Promise.resolve());

  // 队列执行完毕后
  doTask.then(() => {
    // 移除自带看板娘
    const haruna = document.getElementById('my-dear-haruna-vm')
    haruna && haruna.remove()

    // 初始化pio
    _pio_initialize_pixi()

    // 添加自定义样式
    addStyle(CUSTOM_CSS)

    加载圣·嘉然()

    console.log("all done.")
  });

  // 初始化设定
  const initConfig = {
    mode: "fixed",
// 移动端隐藏
  hidden: true,
// 移动端显示
//   hidden:false,
    content: {
      link: 引流[Math.floor(Math.random() * 引流.length)], // 引流链接
      referer: "Hi!", // 存在访问来源时的欢迎文本
      welcome: ["Hi!"], // 未开启时间问好时的欢迎文本
      skin: ["诶，想看看其他团员吗？", "替换后入场文本"], // 0更换模型提示文案  1更换完毕入场文案
        custom: [// 鼠标移上去提示元素
      { "selector": ".comment-form", "text": "Content Tooltip" },
      { "selector": ".home-social a:last-child", "text": "Blog Tooltip" },
      { "selector": ".list .postname", "type": "read" },
      { "selector": ".post-content a, .page-content a, .post a", "type": "link" }
    ],
  },
//   夜间模式控件
  night: "DarkMode()",
    model: [
      // 待加载的模型列表
      "https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/Ava/Ava.model3.json",
      "https://cdn.jsdelivr.net/gh/ialoe/live2d@master/live2d/Diana/Diana.model3.json",
    ],
    tips: true, // 时间问好
    onModelLoad: onModelLoad // 模型加载完成回调
  }

  let pio_reference // pio实例

  function 加载圣·嘉然() {
    pio_reference = new Paul_Pio(initConfig)

    // pio_alignment = "right" // 右下角
    pio_alignment = "left" // 左下角

    const closeBtn = document.querySelector(".pio-container .pio-action .pio-close")
    closeBtn.insertAdjacentHTML('beforebegin', '<span class="pio-music"></span>')
    const music = document.querySelector(".pio-container .pio-action .pio-music")
    // 返回顶部
    music.onclick = function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    topBtn.onmouseover = function () {
      pio_reference.modules.render("想来一首音乐么吗？");
    };

    // Then apply style
    pio_refresh_style()
  }

  // 模型加载完成回调
  function onModelLoad(model) {
    //   修改
    const container = document.getElementById("pio-container")
    const canvas = document.getElementById("pio")
    const modelNmae = model.internalModel.settings.name
    const coreModel = model.internalModel.coreModel
    const motionManager = model.internalModel.motionManager

    let touchList = [
      {
        text: "点击展示文本1",
        motion: "Idle"
      },
      {
        text: "点击展示文本2",
        motion: "Idle"
      }
    ]

    // 播放动作
    function playAction(action) {
      action.text && pio_reference.modules.render(action.text) // 展示文案
      action.motion && pio_reference.model.motion(action.motion) // 播放动作

      if (action.from && action.to) {
        // 指定部件渐入渐出
        Object.keys(action.from).forEach(id => {
          const hidePartIndex = coreModel._partIds.indexOf(id)
          TweenLite.to(coreModel._partOpacities, 0.6, { [hidePartIndex]: action.from[id] });
          // coreModel._partOpacities[hidePartIndex] = action.from[id]
        })

        motionManager.once("motionFinish", (data) => {
          Object.keys(action.to).forEach(id => {
            const hidePartIndex = coreModel._partIds.indexOf(id)
            TweenLite.to(coreModel._partOpacities, 0.6, { [hidePartIndex]: action.to[id] });
            // coreModel._partOpacities[hidePartIndex] = action.to[id]
          })
        })
      }
    }

    canvas.onclick = function () {
      // 除闲置动作外不打断
      if (motionManager.state.currentGroup !== "Idle") return

      // 随机选择并播放动作
      const action = pio_reference.modules.rand(touchList)
      playAction(action)
    }

    if (modelNmae === "Diana") {
      // 嘉然小姐

      // 入场动作及文案
      initConfig.content.skin[1] = ["我是吃货担当 嘉然 Diana~", "嘉心糖们 想然然了没有呀~", "有人在吗？"]
      playAction({ motion: "Tap抱阿草-左手" })

      // 点击动作及文案，不区分区域
      touchList = [
        {
          text: "嘉心糖屁用没有",
          motion: "Tap生气 -领结"
        },
        {
          text: "有人急了，但我不说是谁~",
          motion: "Tap= =  左蝴蝶结"
        },
        {
          text: "呜呜...呜呜呜....",
          motion: "Tap哭 -眼角"
        },
        {
          text: "想然然了没有呀~",
          motion: "Tap害羞-中间刘海"
        },
        {
          text: "阿草好软呀~",
          motion: "Tap抱阿草-左手"
        },
        {
          text: "不要再戳啦！好痒！",
          motion: "Tap摇头- 身体"
        },
        {
          text: "嗷呜~~~",
          motion: "Tap耳朵-发卡"
        },
        {
          text: "zzZ。。。",
          motion: "Leave"
        },
        {
          text: "哇！好吃的！",
          motion: "Tap右头发"
        },
      ]

    } else if (modelNmae === "Ava") {
      initConfig.content.skin[1] = ["我是<s>拉胯</s>Gamer担当 向晚 AvA~", "怎么推流辣！", "AAAAAAAAAAvvvvAAA 向晚！"]
      playAction({
        motion: "Tap左眼",
        from: {
          "Part15": 1
        },
        to: {
          "Part15": 0
        }
      })

      touchList = [
        {
          text: "水母 水母~ 只是普通的生物",
          motion: "Tap右手"
        },
        {
          text: "可爱的鸽子鸽子~我喜欢你~",
          motion: "Tap胸口项链",
          from: {
            "Part12": 1
          },
          to: {
            "Part12": 0
          }
        },
        {
          text: "好...好兄弟之间喜欢很正常啦",
          motion: "Tap中间刘海",
          from: {
            "Part12": 1
          },
          to: {
            "Part12": 0
          }
        },
        {
          text: "啊啊啊！怎么推流辣",
          motion: "Tap右眼",
          from: {
            "Part16": 1
          },
          to: {
            "Part16": 0
          }
        },
        {
          text: "你怎么老摸我，我的身体是不是可有魅力",
          motion: "Tap嘴"
        },
        {
          text: "AAAAAAAAAAvvvvAAA 向晚！",
          motion: "Tap左眼",
          from: {
            "Part15": 1
          },
          to: {
            "Part15": 0
          }
        }
      ]

      // 钻头比较大，宽度*1.2倍，模型位移也要重新计算
      canvas.width = model.width * 1.2
      model.x = canvas.width - model.width

      // 模型问题，手动隐藏指定部件
      const hideParts = [
        "Part5", // 晕
        "neko", // 喵喵拳
        "game", // 左手游戏手柄
        "Part15", // 墨镜
        "Part21", // 右手小臂
        "Part22", // 左手垂下
        "Part", // 双手抱拳
        "Part16", // 惊讶特效
        "Part12" // 小心心
      ]
      const hidePartsIndex = hideParts.map(id => coreModel._partIds.indexOf(id))
      hidePartsIndex.forEach(idx => {
        coreModel._partOpacities[idx] = 0
      })
    }
  }

  // 检测是否处于iframe内嵌环境
  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  // 加载js或css，返回函数包裹的promise实例，用于顺序加载队列
  function loadSource(src) {
    return () => {
      return new Promise(function (resolve, reject) {
        const TYPE = src.split('.').pop()
        let s = null;
        let r = false;
        if (TYPE === 'js') {
          s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = src;
          s.async = true;

        } else if (TYPE === 'css') {
          s = document.createElement('link');
          s.rel = 'stylesheet';
          s.type = 'text/css';
          s.href = src;

        }
        s.onerror = function (err) {
          reject(err, s);
        };
        s.onload = s.onreadystatechange = function () {
          // console.log(this.readyState); // uncomment this line to see which ready states are called.
          if (!r && (!this.readyState || this.readyState == 'complete')) {
            r = true;
            console.log(src)
            resolve();
          }
        };
        const t = document.getElementsByTagName('script')[0];
        t.parentElement.insertBefore(s, t);
      });
    }
  }

  // 添加css
  function addStyle(css) {
    if (typeof GM_addStyle != "undefined") {
      GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
      PRO_addStyle(css);
    } else {
      const node = document.createElement("style");
      node.type = "text/css";
      node.appendChild(document.createTextNode(css));
      const heads = document.getElementsByTagName("head");

      if (heads.length > 0) {
        heads[0].appendChild(node);
      } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
      }
    }
  }

})();

