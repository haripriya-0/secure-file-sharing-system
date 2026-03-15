const dropArea = document.getElementById("dropArea");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.querySelector(".progress-container");

/* ===== KEEP YOUR EXPAND / COLLAPSE EXACTLY SAME ===== */
dropArea.addEventListener("mouseenter", () => {
    dropArea.classList.remove("collapsed");
    dropArea.classList.add("expanded");
});

dropArea.addEventListener("mouseleave", () => {
    dropArea.classList.remove("expanded");
    dropArea.classList.add("collapsed");
});

/* ===== DRAG HIGHLIGHT (NO LAYOUT CHANGE) ===== */
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");
    handleFile(e.dataTransfer.files[0]);
});
function handleSignin() {

    const token = localStorage.getItem("token");

    // user already logged in
    if (token && token !== "null") {
        window.location.href = "user_data.html";
    } 
    // user not logged in
    else {
        window.location.href = "login/login.html";
    }
}
/* ===== BUTTON ===== */
uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    handleFile(fileInput.files[0]);
});

/* ===== FILE VALIDATION (ONLY ADDITION) ===== */
function handleFile(file) {
    if (!file) return;

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "video/mp4"
    ];

    const maxSize = 50 * 1024 * 1024;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

    fileName.style.color = "#94a3b8";
    fileName.textContent = `File: ${file.name} (${sizeInMB} MB)`;

    /* REMOVE OLD ANIMATION CLASSES */
    dropArea.classList.remove("error-shake","success-glow");

    if (!allowedTypes.includes(file.type)) {
        fileName.style.color = "red";
        fileName.textContent = "Invalid file type!";
        triggerError();
        return;
    }

    if (file.size > maxSize) {
        fileName.style.color = "red";
        fileName.textContent = "File exceeds 50MB limit!";
        triggerError();
        return;
    }

    simulateUpload(file);
}
function triggerError(){
    dropArea.classList.add("error-shake");

    setTimeout(()=>{
        dropArea.classList.remove("error-shake");
    },400);
}

/* ===== KEEP YOUR FAKE ENCRYPTION SAME ===== */
async function simulateUpload(file) {

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (!token || token === "null") {
        alert("Session expired. Please login again.");
        window.location.href = "./login/login.html";
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        "http://127.0.0.1:5000/upload_s3",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        }
    );

    const data = await response.json();

    if (response.ok) {
        fileName.textContent = "File uploaded successfully ✔";
    } else {
        fileName.textContent = data.error;
    }
}
async function handleSignin() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login/login.html";
        return;
    }

    try {
        const res = await fetch(
            "https://secure-file-sharing-4k5x.onrender.com/profile",
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (res.ok) {
            window.location.href = "user_data.html";
        } else {
            localStorage.removeItem("token");
            window.location.href = "login/login.html";
        }

    } catch {
        window.location.href = "login/login.html";
    }
}
/* ===== KEEP YOUR TYPING EFFECT SAME ===== */
const text = "Secure your files. Share with confidence.";
let i = 0;
function typing() {
    if (i < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(i);
        i++;
        setTimeout(typing, 40);
    }
}
typing();

/* ===== KEEP PARTICLES SAME ===== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 60; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2,
        dx: (Math.random() - 0.5),
        dy: (Math.random() - 0.5)
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
    });
    requestAnimationFrame(animate);
}
animate();