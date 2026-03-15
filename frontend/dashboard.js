async function loadProfile() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://127.0.0.1:5000/profile",
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const data = await response.json();

    document.getElementById("userName").textContent = data.username;
}

loadProfile();
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login/login.html";
}

async function loadFiles() {

    const response = await fetch(
        "http://127.0.0.1:5000/files",
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const data = await response.json();

    const table =
        document.getElementById("fileTable");

    table.innerHTML = "";

    data.files.forEach(file => {

    const sizeKB = (file.file_size / 1024).toFixed(2);

    table.innerHTML += `
    <tr>
        <td>${file.filename}</td>
        <td>${sizeKB} KB</td>
        <td>${new Date(file.uploaded_at).toLocaleString()}</td>
        <td>
            <button onclick="startDownload('${file.id}', this)">
                Download
            </button>

            <button onclick="generateShareLink('${file.id}')"
                style="color:blue;">
                Share
            </button>

            <button onclick="deleteFile('${file.id}')"
                style="color:red;">
                Delete
            </button>
        </td>
    </tr>`;
});
}
function startDownload(fileId, button){

    let time = 3;

    button.disabled = true;
    button.innerText = "Preparing " + time;

    const timer = setInterval(()=>{

        time--;

        if(time > 0){
            button.innerText = "Preparing " + time;
        }else{

            clearInterval(timer);

            button.innerText = "Downloading...";

            downloadFile(fileId);

            setTimeout(()=>{
                button.innerText = "Download";
                button.disabled = false;
            },2000);
        }

    },1000);

}
async function downloadFile(fileId){

    const token = localStorage.getItem("token");

    if(!token){
        alert("Please login again");
        return;
    }

    const response = await fetch(
        `https://secure-file-sharing-4k5x.onrender.com/download/${fileId}`,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    if(!response.ok){
        const err = await response.json();
        alert(err.msg || err.error || "Download failed");
        return;
    }

    const blob = await response.blob();

    // extract filename from backend header
    const disposition =
        response.headers.get("Content-Disposition");

    let filename = "downloaded_file";

    if(disposition){
        const match =
            disposition.match(/filename="?(.+)"?/);
        if(match) filename = match[1];
    }

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
}
async function deleteFile(fileId){

    const confirmDelete =
        confirm("Delete this file permanently?");

    if(!confirmDelete) return;

    const response = await fetch(
        `https://secure-file-sharing-4k5x.onrender.com/delete/${fileId}`,
        {
            method:"DELETE",
            headers:{
                "Authorization":"Bearer "+token
            }
        }
    );

    const data = await response.json();

    if(response.ok){
        alert("File deleted");
        loadFiles(); // refresh table
    }else{
        alert(data.error);
    }
}
async function generateShareLink(fileId){

    const hours = prompt(
        "Enter link validity in hours (example: 1, 24, 48):",
        "24"
    );

    if(!hours) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
        `https://secure-file-sharing-4k5x.onrender.com/generate-share-link/${fileId}`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
            },
            body: JSON.stringify({
                expiry_hours: hours
            })
        }
    );

    const data = await res.json();

    if(res.ok){

        await navigator.clipboard.writeText(data.share_link);

        alert(
            "Share link copied to clipboard\n\n" +
            data.share_link
        );

    }else{
        alert(data.error);
    }
}
loadFiles();

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login/login.html";
}
