const tvScreen = document.getElementById("tv-screen");
const remoteScreen = document.getElementById("remote-screen");
let check = 0;
let infoVisible = 0;
let channelInput = "";
let currentChannel = channelInput;
let channels = {
    101: "img/101.jpeg",
    123: "img/123.png",
    222: "img/222.mp4",
    444: "img/444.gif",
    777: "img/777.gif",
    999: "img/999.mp4",
}
let channelList = [101, 123, 222, 444, 777, 999];

document.getElementById('info-button').addEventListener('click', toggleChannelInfo);
powerOn();

function powerOn(){
    const indicator = document.querySelector('.power-indicator');
    if (indicator) {
        if (check === 0) {
            indicator.style.background = "#000";
            indicator.style.boxShadow = "none";
            indicator.style.animation = "none"; 
        } else {
            indicator.style.background = ""; 
            indicator.style.boxShadow = "";  
            indicator.style.animation = "";  
        }
    }
}

function powerOnTV(){
    if (check === 0) {
        const img = document.createElement("img");
        img.src = "img/static.gif";

        tvScreen.appendChild(img);
        check = 1;
        powerOn();
    } else {
        const infoDiv = document.getElementById('channel-info-list');
        if (infoDiv){
            infoVisible = 0;
            infoDiv.remove();
        } 
        const img = tvScreen.querySelector("img");
        if (img) {
            tvScreen.removeChild(img);
        }

        const video = tvScreen.querySelector("video");
        if (video) {
            tvScreen.removeChild(video);
        }
        check = 0;
        powerOn();
    }
}

document.querySelectorAll('#remote-button').forEach(remoteButton => {
    remoteButton.addEventListener('click', function() {
        if (check === 0){
            return;
        }

        if (channelInput.length < 3) {
            channelInput += remoteButton.textContent;
            remoteScreen.textContent = channelInput;
            if (channelInput.length === 3) {
                remoteScreen.textContent = "CH " + channelInput;
                changeChannel(channelInput);
            }
        }

        if (channelInput.length === 3) {
            channelInput = "";
        }
    });
});

function changeChannel(channel) {
    currentChannel = channel*1;

    let extension = verifyextension(channel);

    if (extension === "no") {
        const img = document.createElement("img");
        img.src = "img/static.gif";

        tvScreen.innerHTML = ""; 
        tvScreen.appendChild(img);
    }

    if (extension === ".gif" || extension === ".jpg" || extension === ".png" || extension === ".jpeg") {
        const img = document.createElement("img");
        img.src = channels[channel];
        img.alt = "Channel " + channel;

        tvScreen.innerHTML = "";
        tvScreen.appendChild(img);
    }

    if (extension === ".mp4"){
        const video = document.createElement("video");
        video.src = channels[channel];
        video.id = "canal-video";
        video.controls = true;
        video.autoplay = true;

        tvScreen.innerHTML = ""; // 
        tvScreen.appendChild(video);
    }
}

function verifyextension(channel) {
    const channelResource = channels[channel];
    if (!channelResource) {
        return "no";
    }
    let dot = -1;
    for (let i = 0; i < channelResource.length; i++) {
        if (channelResource[i] === ".") {
            dot = i;
        }
    }

    let extension = "";
    for (let j = dot; j < channelResource.length; j++) {
        extension += channelResource[j];
    }

    return extension;
}

function toggleChannelInfo() {
    let infoDiv = document.getElementById('channel-info-list');
    if (infoVisible === 1) {
        if (infoDiv){
            infoDiv.remove();
        }
        infoVisible = 0;
        return;
    } else {
        const img = tvScreen.querySelector("img");
        
        infoDiv = document.createElement('div');
        infoDiv.id = 'channel-info-list';
        infoDiv.style.position = 'absolute';
        infoDiv.style.fontFamily = '"Courier New", monospace';
        infoDiv.style.top = '0';
        infoDiv.style.left = '0';
        infoDiv.style.width = '100%';
        infoDiv.style.height = '100%';
        infoDiv.style.background = 'rgba(44, 62, 80, 0.97)';
        infoDiv.style.color = '#fff';
        infoDiv.style.padding = '24px 18px 18px 18px';
        infoDiv.style.borderRadius = '10px';
        infoDiv.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
        infoDiv.style.zIndex = '10';
        infoDiv.style.fontSize = '16px';
        infoDiv.style.textAlign = 'left';
        infoDiv.style.overflowY = 'auto';
        infoDiv.style.display = 'flex';
        infoDiv.style.flexDirection = 'column';
        infoDiv.style.justifyContent = 'flex-start';

        let html = '<b style="font-size:18px;">Canales disponibles:</b><ul style="margin:12px 0 0 0;padding-left:18px;">';
        for (let i = 0; i < channelList.length; i++) {
            let ch = channelList[i];
            html += `<li style="margin-bottom:6px;">${ch}</li>`;
        }
        html += '</ul>';
        infoDiv.innerHTML = html;

        tvScreen.style.position = 'relative';
        tvScreen.appendChild(infoDiv);
    }
    infoVisible = 1;
}

function increaseVolume() {
    const video = document.getElementById("canal-video");
    if (video && video.volume < 1) {
        video.volume += 0.1;
        if (video.volume > 1) {
            video.volume = 1;
        }
    }
}

function decreaseVolume() {
    const video = document.getElementById("canal-video");
    if (video && video.volume > 0) {
        video.volume -= 0.1;
        if (video.volume < 0) {
            video.volume = 0;
        }
    }
}

function nextChannel() {
    let index = -1;
    for (let i = 0; i < channelList.length; i++) {
        if (channelList[i] == currentChannel) {
            index = i;
            break;
        }
    }

    if (index >= 0) {
        if (index === channelList.length - 1) {
            currentChannel = channelList[0];
        } else {
            currentChannel = channelList[index + 1];
        }
        changeChannel(currentChannel);
    }
}

function previousChannel() {
    let index = -1;
    for (let i = 0; i < channelList.length; i++) {
        if (channelList[i] == currentChannel) {
            index = i;
            break;
        }
    }

    if (index >= 0) {
        if (index === 0) {
            currentChannel = channelList[channelList.length - 1];
        } else {
            currentChannel = channelList[index - 1];
        }
        changeChannel(currentChannel);
    }
}