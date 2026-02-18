/**
 * 完整脚本：修复字体加载失效及映射错误问题
 */
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const provInput = document.getElementById('provInput');
const mainInput = document.getElementById('mainInput');
const subInput = document.getElementById('subInput'); 
const inputLabel = document.getElementById('inputLabel');
const savePngBtn = document.getElementById('savePng');
const saveSvgBtn = document.getElementById('saveSvg');

let currentMain = 'speed-limit';
let currentSub = 'limit';
let currentTri = 'national'; 

const inputStorage = {
    'speed-limit': '120',
    'road-name-main': 'G4',
    'road-name-sub': '',
    'road-name-prov': '皖'
};

const getV = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// 辅助函数：确保在字体加载后再绘制
function safeDraw() {
    if (document.fonts) {
        document.fonts.ready.then(() => {
            requestAnimationFrame(draw);
        });
    } else {
        draw();
    }
}

function draw() {
    const val = mainInput.value;
    const extraVal = subInput ? subInput.value : ""; 
    const provVal = provInput ? provInput.value : "皖";
    const D = parseFloat(getV('--sign-diameter')) || 600;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentMain === 'speed-limit') {
        canvas.width = D + 20;
        canvas.height = D + 20;
        renderSpeedSigns(val || '120', canvas.width/2, D);
    } else if (currentMain === 'road-name') {
        const totalLen = (val || 'G4').length + (extraVal ? extraVal.length : 0);
        let aspect = 1.0;
        if (totalLen >= 4) aspect = 1.7;
        else if (totalLen >= 3) aspect = 1.25;
        
        const rectW = D * aspect;
        const rectH = D;
        canvas.width = rectW + 40;
        canvas.height = rectH + 40;
        
        if (currentSub === 'hwy-id') {
            renderHwyId(provVal, val || (currentTri === 'national' ? 'G4' : 'S1'), extraVal, canvas.width/2, canvas.height/2, rectW, rectH);
        }
    }
}

function renderHwyId(prov, mainVal, subVal, cx, cy, w, h) {
    const unit = h / 100; 
    const r = 12 * unit;  
    const padding = 3 * unit; 
    const borderWidth = 2 * unit; 
    const hwyGreen = "rgb(45, 155, 71)"; 
    
    const isNational = currentTri === 'national';
    const headerBg = isNational ? (getV('--gb-red') || "#e60012") : "rgb(255, 210, 0)";
    const headerTextColor = isNational ? "#FFFFFF" : "#000000";
    
    const headerTextStr = isNational ? ["国", "家", "高", "速"] : [(prov || "皖"), "高", "速"];

    const innerX = cx - w/2 + padding;
    const innerY = cy - h/2 + padding;
    const innerW = w - 2*padding;
    const innerH = h - 2*padding;

    drawRoundedRect(innerX, innerY, innerW, innerH, r, hwyGreen);

    const headerH = 20 * unit; 
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(innerX + r, innerY);
    ctx.lineTo(innerX + innerW - r, innerY);
    ctx.arcTo(innerX + innerW, innerY, innerX + innerW, innerY + r, r);
    ctx.lineTo(innerX + innerW, innerY + headerH); 
    ctx.lineTo(innerX, innerY + headerH);
    ctx.lineTo(innerX, innerY + r);
    ctx.arcTo(innerX, innerY, innerX + r, innerY, r);
    ctx.closePath();
    ctx.fillStyle = headerBg;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = borderWidth;
    ctx.stroke();

    // 1. 顶部汉字：严格使用 RoadGen-A
    const charSize = 10 * unit;
    const charGap = isNational ? 10 * unit : 15 * unit; 
    ctx.fillStyle = headerTextColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${charSize}px "RoadGen-A"`;
    
    const textY = innerY + (headerH / 2); 
    const totalHeaderWidth = (headerTextStr.length - 1) * (charSize + charGap);
    const startX = cx - totalHeaderWidth / 2;
    
    headerTextStr.forEach((char, i) => {
        ctx.fillText(char, startX + i * (charSize + charGap), textY);
    });

    // 2. 中间编号：严格使用 RoadGen-B
    const mainFontSize = 45 * unit;
    const subFontSize = 27 * unit; 
    const interGap = 2 * unit; 

    ctx.font = `bold ${mainFontSize}px "RoadGen-B"`;
    const mainWidth = ctx.measureText(mainVal).width;
    let totalContentWidth = mainWidth;
    let subWidth = 0;
    if (subVal) {
        ctx.font = `bold ${subFontSize}px "RoadGen-B"`;
        subWidth = ctx.measureText(subVal).width;
        totalContentWidth += interGap + subWidth;
    }

    let drawX = cx - totalContentWidth / 2;
    const baselineY = innerY + headerH + ((innerH - headerH) / 2) + (mainFontSize * 0.35);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic'; 
    ctx.fillStyle = "#FFFFFF";
    
    // 再次显式设置字体防止丢失
    ctx.font = `bold ${mainFontSize}px "RoadGen-B"`;
    ctx.fillText(mainVal, drawX, baselineY);

    if (subVal) {
        ctx.font = `bold ${subFontSize}px "RoadGen-B"`;
        ctx.fillText(subVal, drawX + mainWidth + interGap, baselineY);
    }
}

function drawRoundedRect(x, y, w, h, r, color) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function renderSpeedSigns(val, center, D) {
    const a = parseFloat(getV('--red-ring-width')) || 60;
    let h = parseFloat(getV('--font-height')) || 250;
    const visualBias = - (D * 0.025);

    // 限速数字属于非汉字，使用 RoadGen-B
    const speedFont = "RoadGen-B";

    if (currentSub === 'limit') {
        if (val.length >= 3) h *= 0.72; else h *= 0.92;
        drawCircle(center, center, D/2, getV('--gb-white'));
        drawCircle(center, center, D/2, getV('--gb-red'));
        drawCircle(center, center, (D/2) - a, getV('--gb-white'));
        drawLabelText(val, center, center + visualBias, h, "#000000", speedFont);
    } 
    else if (currentSub === 'release') {
        if (val.length >= 3) h *= 0.72; else h *= 0.92;
        drawCircle(center, center, D/2, getV('--gb-white'));
        ctx.beginPath(); ctx.arc(center, center, D/2 - a/2, 0, Math.PI * 2);
        ctx.strokeStyle = "#000000"; ctx.lineWidth = a; ctx.stroke();
        drawLabelText(val, center, center + visualBias, h, "#000000", speedFont);
        drawReleaseStrikes(center, center, (D/2) - a);
    }
    else if (currentSub === 'minimum') {
        if (val.length >= 3) h *= 0.75; else h *= 0.95;
        drawCircle(center, center, D/2, getV('--gb-blue'));
        const offsetRatio = 0.5; const angle = Math.asin(offsetRatio);
        ctx.save(); ctx.beginPath(); ctx.arc(center, center, D/2, angle, Math.PI - angle, false); ctx.closePath();
        ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore();
        drawLabelText(val, center, center + visualBias, h, "#FFFFFF", speedFont);
    }
}

function drawCircle(x, y, r, color) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
}

function drawLabelText(txt, x, y, size, color, font) {
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `bold ${size}px "${font}"`;
    ctx.fillText(txt, x, y);
}

function drawReleaseStrikes(x, y, r) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = "#000000"; ctx.lineWidth = 7;
    const spacing = 20; const lineCount = 5;
    for (let i = 0; i < lineCount; i++) {
        const offset = -(4 * spacing) / 2 + (i * spacing);
        ctx.beginPath(); ctx.moveTo(x - r * 1.5 + offset, y + r * 1.5 + offset);
        ctx.lineTo(x + r * 1.5 + offset, y - r * 1.5 + offset); ctx.stroke();
    }
    ctx.restore();
}

window.changeMainTab = (category, el) => {
    if (currentMain === 'speed-limit') {
        inputStorage['speed-limit'] = mainInput.value;
    } else {
        inputStorage['road-name-main'] = mainInput.value;
        inputStorage['road-name-sub'] = subInput.value;
        inputStorage['road-name-prov'] = provInput.value;
    }

    currentMain = category;
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    
    const navSpeed = document.getElementById('nav-speed');
    const navRoad = document.getElementById('nav-road');
    const navTri = document.getElementById('nav-tertiary');
    
    if (category === 'speed-limit') {
        navSpeed.classList.remove('hidden'); navRoad.classList.add('hidden'); navTri.classList.add('hidden');
        provInput.classList.add('hidden');
        subInput.classList.add('hidden');
        inputLabel.innerText = "请输入数值：";
        mainInput.value = inputStorage['speed-limit'];
        currentSub = 'limit';
    } else {
        navSpeed.classList.add('hidden'); navRoad.classList.remove('hidden'); navTri.classList.remove('hidden');
        currentSub = 'hwy-id';
        const hwyIdBtn = Array.from(document.querySelectorAll('.sub-tab')).find(b => b.textContent.includes('编号标志'));
        document.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
        if(hwyIdBtn) hwyIdBtn.classList.add('active');
        updateRoadInputUI();
        subInput.classList.remove('hidden');
        mainInput.value = inputStorage['road-name-main'];
        subInput.value = inputStorage['road-name-sub'];
        provInput.value = inputStorage['road-name-prov'];
    }
    safeDraw();
};

window.changeSubTab = (type, el) => {
    currentSub = type;
    document.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    safeDraw();
};

window.changeTriTab = (level, el) => {
    currentTri = level;
    document.querySelectorAll('.tri-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    updateRoadInputUI();
    if (mainInput.value === 'G4' || mainInput.value === 'S1' || !mainInput.value) {
        mainInput.value = level === 'national' ? 'G4' : 'S1';
    }
    safeDraw();
};

function updateRoadInputUI() {
    if (currentMain !== 'road-name') return;
    if (currentTri === 'national') {
        provInput.classList.add('hidden');
        inputLabel.innerText = "请输入编号与角标：";
    } else {
        provInput.classList.remove('hidden');
        inputLabel.innerText = "请输入省简称、编号与角标：";
    }
}

function saveAsPNG() {
    const link = document.createElement('a');
    link.download = `sign-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function saveAsSVG() {
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${canvas.toDataURL('image/png')}" width="${canvas.width}" height="${canvas.height}" /></svg>`;
    const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const link = document.createElement('a');
    link.download = `sign-${Date.now()}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
}

provInput.addEventListener('input', safeDraw);
mainInput.addEventListener('input', safeDraw);
subInput.addEventListener('input', safeDraw);
savePngBtn.addEventListener('click', saveAsPNG);
saveSvgBtn.addEventListener('click', saveAsSVG);

// 页面加载启动字体监听
window.onload = safeDraw;