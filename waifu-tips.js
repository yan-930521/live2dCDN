function loadWidget(live2d_path, others_path) {
  localStorage.removeItem("waifu-display");
  sessionStorage.removeItem("waifu-text");
  document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="2000" height="2000"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-camera-retro"></span>
			</div>
		</div>`);
  setTimeout(() => {
    document.getElementById("waifu").style.bottom = 0;
  }, 0);


  // loadModel(live2d_path+"Datas/Tia/index.json");
  let molist = [
    {
      name:"狂三",
      id:"l_234600111"
    },
    {
      name:"折紙",
      id:"l_234500311"
    },
    {
      name:"琴里",
      id:"l_234200211"
    },
    {
      name:"四糸乃",
      id:"l_234100511"
    },
  ]

  loadModel(others_path + "方舟指令/"+molist[Math.floor(Math.random()*molist.length)].id+"/model.json");
  // 檢測用戶狀態

  let userAction = false,
    userActionTimer,
    messageTimer,
    messageArray = ["好久不見啊！", "人家好無聊喔......"];

  window.addEventListener("mousemove", () => userAction = true);
  window.addEventListener("keydown", () => userAction = true);

  setInterval(() => {
    if (userAction) {
      userAction = false;
      clearInterval(userActionTimer);
      userActionTimer = null;
    } else if (!userActionTimer) {
      userActionTimer = setInterval(() => {
        showMessage(randomSelection(messageArray), 6000, 9);
      }, 20000);
    }
  }, 1000);

  (function registerEventListener() {

    document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () => {
      showMessage("人家可愛吧？", 6000, 9);
      Live2D.captureName = "photo.png";
      Live2D.captureFrame = true;
    });

    window.addEventListener("copy", () => {
      showMessage("hummm 你複製了什麼呢？", 6000, 9);
    });

    window.addEventListener("visibilitychange", () => {
      if (!document.hidden) showMessage("歡迎回家～", 6000, 9);
    });

  })();

  (function welcomeMessage() {
    let text;
    if (location.pathname === "/") { // 如果是主页
      const now = new Date().getHours();
      if (now > 5 && now <= 11) text = "早安安呦！";
      else if (now > 11 && now <= 17) text = "午安！ 吃午餐了嗎？";
      else if (now > 17 && now <= 21) text = "晚安阿，今天過的如何？";
      else if (now > 21 && now <= 23) text = "記得早一點睡喔！";
      else text = "好晚了... 快點去睡覺啦...！";
    }
    showMessage(text, 7000, 8);
  })();

  fetch(live2d_path + "waifu-tips.json")
    .then(response => response.json())
    .then(result => {
      window.addEventListener("mouseover", event => {
        for (let { selector, text } of result.mouseover) {
          if (!event.target.matches(selector)) continue;
          text = randomSelection(text);
          text = text.replace("{text}", event.target.innerText);
          showMessage(text, 4000, 8);
          return;
        }
      });
      window.addEventListener("click", event => {
        for (let { selector, text } of result.click) {
          if (!event.target.matches(selector)) continue;
          text = randomSelection(text);
          text = text.replace("{text}", event.target.innerText);
          showMessage(text, 4000, 8);
          return;
        }
      });
      result.seasons.forEach(({ date, text }) => {
        const now = new Date(),
          after = date.split("-")[0],
          before = date.split("-")[1] || after;
        if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
          text = randomSelection(text);
          text = text.replace("{year}", now.getFullYear());
          //showMessage(text, 7000, true);
          messageArray.push(text);
        }
      });
    });

  function randomSelection(obj) {
    return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
  }

  function showMessage(text, timeout, priority) {
    if (!text || (sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > priority)) return;
    if (messageTimer) {
      clearTimeout(messageTimer);
      messageTimer = null;
    }
    text = randomSelection(text);
    sessionStorage.setItem("waifu-text", priority);
    const tips = document.getElementById("waifu-tips");
    tips.innerHTML = text;
    tips.classList.add("waifu-tips-active");
    messageTimer = setTimeout(() => {
      sessionStorage.removeItem("waifu-text");
      tips.classList.remove("waifu-tips-active");
    }, timeout);
  }

  async function loadModel(live2d_path) {
    loadlive2d("live2d", `${live2d_path}`);
  }
}
function initWidget(live2d_path, others_path) {
  loadWidget(live2d_path, others_path);
}
