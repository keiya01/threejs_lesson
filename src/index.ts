import Drewer from "./drewer";

const start = () => {
  const route = location.href.split("/#/");
  
  switch (route[1]) {
    case "square-rotate": {
      const drewer = new Drewer();
      drewer.rotate();
      break;
    }
    case "square-mouse": {
      const drewer = new Drewer();
      drewer.mouseMove();
      break;
    }
    case "multi-shadow": {
      const drewer = new Drewer();
      drewer.multiShadow();
      break;
    }
    case "perspective-camera": {
      const drewer = new Drewer();
      drewer.perspectiveCamera();
      break;
    }
  }

  setRouter();
}

const setRouter = () => {
  const routes = [
    {
      value: "square-rotate",
      href: "/#/square-rotate"
    },
    {
      value: "square-mouse",
      href: "/#/square-mouse"
    },
    {
      value: "multi-shadow",
      href: "/#/multi-shadow"
    },
    {
      value: "perspective-camera",
      href: "/#/perspective-camera"
    },
  ]

  const linkList: HTMLDivElement | null = document.querySelector("#link-list");
  if(!linkList) return;
  routes.forEach(route => {
    const li = document.createElement("li");
    li.innerText = route.value;
    li.style.cursor = "pointer";
    li.style.color = "#007bff";
    li.style.textDecoration = "underline solid #007bff";
    li.addEventListener("click", () => {
      location.href = route.href;
      location.reload();
    });
    linkList.appendChild(li);
  });
}

window.addEventListener("load", start);
