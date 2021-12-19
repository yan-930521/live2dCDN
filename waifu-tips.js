function loadWidget(live2d_path, others_path) {
  localStorage.removeItem("waifu-display");
  sessionStorage.removeItem("waifu-text");
  document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="800" height="800"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-camera-retro"></span>
			</div>
		</div>`);
  setTimeout(() => {
    document.getElementById("waifu").style.bottom = 0;
  }, 0);


  // loadModel(live2d_path+"Datas/Tia/index.json");
  alert(others_path+"方舟指令/l_234600111/model.json")
  loadModel(others_path+"方舟指令/l_234600111/model.json");
  // 檢測用戶狀態

  let userAction = false,
    userActionTimer,
    messageTimer,
    messageArray = ["好久不见，日子过得好快呢……", "大坏蛋！你都多久没理人家了呀，嘤嘤嘤～", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！", "记得把小家加入 Adblock 白名单哦！"];

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
      showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
      Live2D.captureName = "photo.png";
      Live2D.captureFrame = true;
    });

    window.addEventListener("copy", () => {
      showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
    });

    window.addEventListener("visibilitychange", () => {
      if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
    });

  })();

  (function welcomeMessage() {
    let text;
    if (location.pathname === "/") { // 如果是主页
      const now = new Date().getHours();
      if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";
      else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
      else if (now > 11 && now <= 13) text = "中午了，工作了一个上午，现在是午餐时间！";
      else if (now > 13 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
      else if (now > 17 && now <= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
      else if (now > 19 && now <= 21) text = "晚上好，今天过得怎么样？";
      else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
      else text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
    }
    showMessage(text, 7000, 8);
  })();

  fetch(live2d_path+"waifu-tips.json")
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
