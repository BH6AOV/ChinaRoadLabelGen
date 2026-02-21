/**
 * 中国道路交通标志生成器 - 核心引擎
 * 优化：提升至 2000px 高清分辨率，移除伪粗体以解决文字模糊问题
 */

const app = {
    canvas: null,
    ctx: null,
    state: { l1: 'prohibition', l2: 'limit', l3: 'default' },
    // 提升分辨率至 2000px，匹配 Photoshop 实验标准
    baseSize: 2000,

    fonts: {
        'RoadGen-A': { url: './src/fonts/Atype.ttf', loaded: false },
        'RoadGen-B': { url: './src/fonts/Btype.ttf', loaded: false },
        'RoadGen-C': { url: './src/fonts/Ctype.ttf', loaded: false }
    },

    colors: {
        red: 'rgb(238, 41, 45)',
        white: '#FFFFFF',
        black: '#000000',
        blue: '#003399',
        green: 'rgb(45, 155, 71)',
        yellow: '#FFD100'
    },

    registry: {
        prohibition: { name: "禁令标识", items: {} },
        highway: { name: "高速标识", items: {} }
    },

    init() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        if (window.SpeedLimitTemplates) this.registry.prohibition.items = window.SpeedLimitTemplates;
        if (window.HighwayTemplates) this.registry.highway.items = window.HighwayTemplates;

        this.loadFonts();
        this.setL1('prohibition');
    },

    loadFonts() {
        Object.keys(this.fonts).forEach(key => {
            const font = this.fonts[key];
            const xhr = new XMLHttpRequest();
            xhr.open('GET', font.url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = async () => {
                if (xhr.status === 200) {
                    try {
                        const fontFace = new FontFace(key, xhr.response);
                        await fontFace.load();
                        document.fonts.add(fontFace);
                        font.loaded = true;
                        this.updateFontUI(key, "OK", "ok");
                        this.render();
                    } catch (err) { this.updateFontUI(key, "失败", "fail"); }
                }
            };
            xhr.send();
        });
    },

    updateFontUI(key, text, className) {
        const id = key.split('-')[1];
        const el = document.querySelector(`#f-stat-${id} span`);
        if(el) { el.innerText = text; if(className) el.className = className; }
    },

    setL1(key) {
        this.state.l1 = key;
        const l2Items = this.registry[key].items;
        this.setL2(Object.keys(l2Items)[0] || '');
    },

    setL2(key) {
        this.state.l2 = key;
        const item = this.registry[this.state.l1].items[key];
        if (item && item.items) {
            this.setL3(Object.keys(item.items)[0]);
        } else {
            this.setL3('default');
        }
    },

    setL3(key) {
        this.state.l3 = key;
        this.renderMenus();
        this.renderEditor();
        this.render();
    },

    renderMenus() {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${this.state.l1}'`));
        });

        const l2Nav = document.getElementById('menu-l2');
        l2Nav.innerHTML = '';
        const l2Items = this.registry[this.state.l1].items;
        Object.keys(l2Items).forEach(key => {
            const btn = document.createElement('button');
            btn.className = `tab-l2 ${this.state.l2 === key ? 'active' : ''}`;
            btn.innerText = l2Items[key].name;
            btn.onclick = () => this.setL2(key);
            l2Nav.appendChild(btn);
        });

        const l3Nav = document.getElementById('menu-l3');
        l3Nav.innerHTML = '';
        const currentL2Item = l2Items[this.state.l2];
        if (currentL2Item && currentL2Item.items) {
            Object.keys(currentL2Item.items).forEach(key => {
                const btn = document.createElement('button');
                btn.className = `tab-l3 ${this.state.l3 === key ? 'active' : ''}`;
                btn.innerText = currentL2Item.items[key].name;
                btn.onclick = () => this.setL3(key);
                l3Nav.appendChild(btn);
            });
        }
    },

    renderEditor() {
        const container = document.getElementById('editor-fields');
        container.innerHTML = '';
        const item = this.getCurrentItem();
        if(!item) return;
        item.fields.forEach(f => {
            const group = document.createElement('div');
            group.className = 'control-group';
            group.innerHTML = `<label>${f.label}</label><input type="${f.type}" id="${f.id}" placeholder="${f.default}">`;
            group.querySelector('input').oninput = () => this.render();
            container.appendChild(group);
        });
    },

    getCurrentItem() {
        const l2Obj = this.registry[this.state.l1].items[this.state.l2];
        if (!l2Obj) return null;
        if (this.state.l3 === 'default') return l2Obj;
        return l2Obj.items ? l2Obj.items[this.state.l3] : l2Obj;
    },

    render() {
        const item = this.getCurrentItem();
        if(!item || !this.ctx) return;
        const params = {};
        item.fields.forEach(f => {
            const el = document.getElementById(f.id);
            params[f.id] = (el && el.value !== "") ? el.value : f.default;
        });
        
        // 清理并设置渲染环境
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.textSmoothingEnabled = true;
        this.ctx.imageSmoothingEnabled = true;
        
        item.draw(this.ctx, this.canvas, params, this);
    },

    utils: {
        circle(ctx, x, y, r, color) {
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
            ctx.fillStyle = color; ctx.fill();
        },
        circleOutline(ctx, x, y, r, lw, color) {
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
            ctx.lineWidth = lw; ctx.strokeStyle = color; ctx.stroke();
        },
        // 核心修正：移除硬编码的 "bold"，确保汉字按原始比例渲染，不再糊字
        text(ctx, txt, x, y, size, color, font) {
            ctx.save();
            ctx.font = `${size}px "${font}", sans-serif`;
            ctx.fillStyle = color; 
            ctx.textAlign = 'center'; 
            ctx.textBaseline = 'middle';
            ctx.fillText(txt, x, y);
            ctx.restore();
        },
        // 新增：支持两侧对齐的绘制工具
        drawJustifiedText(ctx, txt, x, y, size, totalW, color, font) {
            ctx.save();
            ctx.font = `${size}px "${font}"`;
            ctx.fillStyle = color;
            ctx.textBaseline = 'middle';
            const chars = txt.split("");
            if (chars.length <= 1) {
                ctx.textAlign = 'center';
                ctx.fillText(txt, x, y);
            } else {
                const charWidths = chars.map(c => ctx.measureText(c).width);
                const sumWidth = charWidths.reduce((a, b) => a + b, 0);
                const gap = (totalW - sumWidth) / (chars.length - 1);
                let currentX = x - totalW / 2;
                chars.forEach((c, i) => {
                    ctx.textAlign = 'left';
                    ctx.fillText(c, currentX, y);
                    currentX += charWidths[i] + gap;
                });
            }
            ctx.restore();
        },
        drawRoundedRect(ctx, x, y, w, h, r, color) {
            ctx.beginPath(); ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
            ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
            ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r); ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
            ctx.fillStyle = color; ctx.fill();
        },
        strokeRoundedRect(ctx, x, y, w, h, r) {
            ctx.beginPath(); ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
            ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
            ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r); ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
            ctx.stroke();
        },
        drawStrikes(ctx, cx, cy, r) {
            ctx.save();
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.clip();
            ctx.strokeStyle = "#000"; ctx.lineWidth = r * 0.03;
            const step = r * 0.12; ctx.translate(cx, cy); ctx.rotate(-45 * Math.PI / 180);
            for(let i = -2; i <= 2; i++) {
                ctx.beginPath(); ctx.moveTo(-r*2, i * step); ctx.lineTo(r*2, i * step); ctx.stroke();
            }
            ctx.restore();
        }
    },

    exportPNG() {
        const link = document.createElement('a');
        link.download = `Sign-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    },

    exportSVG() {
        const total = this.canvas.width;
        const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${this.canvas.height}"><image href="${this.canvas.toDataURL()}" width="100%" height="100%"/></svg>`;
        const blob = new Blob([svgFull], {type: 'image/svg+xml;charset=utf-8'});
        const link = document.createElement('a');
        link.download = `Sign-${Date.now()}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
    }
};

window.onload = () => app.init();