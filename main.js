const dropArea = document.getElementById("dropArea");
const uploadInput = document.getElementById("upload");
const resultImg = document.getElementById("result");
const loader = document.querySelector(".loader");
const removeBtn = document.getElementById("removeBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const dropText = document.getElementById("dropText");

let selectedFile = null;
let imageBlobURL = "";

// Open file picker if user clicks drop area
dropArea.addEventListener("click", () => uploadInput.click());

// When user selects file manually
uploadInput.addEventListener("change", () => {
  handleFile(uploadInput.files[0]);
});

// Drag events
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("hover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("hover");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("hover");
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    alert("Please drop a valid image file.");
    return;
  }

  selectedFile = file;

  const reader = new FileReader();
  reader.onload = function (e) {
    resultImg.src = e.target.result;
    resultImg.style.display = "block";
    dropText.style.display = "none";
  };
  reader.readAsDataURL(file);
}

removeBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("Please upload or drop an image first.");
    return;
  }
  // Hide For processing
  loader.style.display = "block";
  resultImg.style.display = "none";

  const formData = new FormData();
  formData.append("image_file", selectedFile);
  formData.append("size", "auto");

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": "5zeWuCJnngV6vS2L9ryYSDGV", // My API Key
      },
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      imageBlobURL = URL.createObjectURL(blob);
      resultImg.src = imageBlobURL;
      resultImg.style.display = "block";
    } else {
      const errorText = await response.text();
      alert("Error: " + response.status + "\n" + errorText);
    }
  } catch (error) {
    alert("Network Error: " + error.message);
  }
  loader.style.display = "none";
});
resetBtn.addEventListener("click", () => {
  uploadInput.value = "";
  resultImg.src = "";
  resultImg.style.display = "none";
  dropText.style.display = "block";
  selectedFile = null;
  imageBlobURL = "";
});
downloadBtn.addEventListener("click", () => {
  if (!imageBlobURL) {
    alert("No processed image to download.");
    return;
  }
  const a = document.createElement("a");
  a.href = imageBlobURL;
  a.download = "no-bg.png";
  a.click();
});

// Code injected by live-server
// <![CDATA[  <-- For SVG support

if ("WebSocket" in window) {
  (function () {
    function refreshCSS() {
      var sheets = [].slice.call(document.getElementsByTagName("link"));
      var head = document.getElementsByTagName("head")[0];
      for (var i = 0; i < sheets.length; ++i) {
        var elem = sheets[i];
        var parent = elem.parentElement || head;
        parent.removeChild(elem);
        var rel = elem.rel;
        if (
          (elem.href && typeof rel != "string") ||
          rel.length == 0 ||
          rel.toLowerCase() == "stylesheet"
        ) {
          var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, "");
          elem.href =
            url +
            (url.indexOf("?") >= 0 ? "&" : "?") +
            "_cacheOverride=" +
            new Date().valueOf();
        }
        parent.appendChild(elem);
      }
    }
    var protocol = window.location.protocol === "http:" ? "ws://" : "wss://";
    var address =
      protocol + window.location.host + window.location.pathname + "/ws";
    var socket = new WebSocket(address);
    socket.onmessage = function (msg) {
      if (msg.data == "reload") window.location.reload();
      else if (msg.data == "refreshcss") refreshCSS();
    };
    if (
      sessionStorage &&
      !sessionStorage.getItem("IsThisFirstTime_Log_From_LiveServer")
    ) {
      console.log("Live reload enabled.");
      sessionStorage.setItem("IsThisFirstTime_Log_From_LiveServer", true);
    }
  })();
} else {
  console.error(
    "Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading."
  );
}
// ]]>
