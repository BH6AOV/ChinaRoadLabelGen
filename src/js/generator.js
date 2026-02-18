/**
 * 中国道路交通标志生成器 - 核心引擎
 * 更新：同步标准色彩 (Green: 45,155,71; Red: 238,41,45)
 */

const app = {
    canvas: null,
    ctx: null,
    state: { l1: 'prohibition', l2: 'limit', l3: 'default' },
    baseSize: 800,

    fonts: {
        'RoadGen-A': { url: './src/fonts/Atype.ttf', loaded: false },
        'RoadGen-B': { url: './src/fonts/Btype.ttf', loaded: false },
        'RoadGen-C': { url: './src/fonts/Ctype.ttf', loaded: false }
    },

    colors: {
        red: 'rgb(238, 41, 45)',    // 精确修正红
        white: '#FFFFFF',
        black: '#000000',
        blue: '#003399',
        green: 'rgb(45, 155, 71)',  // 精确修正绿
        yellow: '#FFD100'
    },

    registry: {
        prohibition: { name: "禁令标识", items: {} },
        mandatory: { name: "指示标识", items: {} },
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        item.draw(this.ctx, this.canvas, params, this);
    },

    utils: {
        circle(ctx, x, y, r, color) {
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
            ctx.fillStyle = color; ctx.fill();
        },
        text(ctx, txt, x, y, size, color, font) {
            ctx.font = `bold ${size}px "${font}", sans-serif`;
            ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(txt, x, y);
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
        }
    },

    exportPNG() {
        const link = document.createElement('a');
        link.download = `PNG-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    },

    exportSVG() {
        const item = this.getCurrentItem();
        const params = {};
        item.fields.forEach(f => {
            const el = document.getElementById(f.id);
            params[f.id] = (el && el.value !== "") ? el.value : f.default;
        });
        const total = this.canvas.width;
        const svgContent = item.toSVG ? item.toSVG(params, this) : "";
        const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}"><style>@font-face { font-family: 'RoadGen-A'; src: local('RoadGen-A'); }</style>${svgContent}</svg>`;
        const blob = new Blob([svgFull], {type: 'image/svg+xml;charset=utf-8'});
        const link = document.createElement('a');
        link.download = `SVG-${Date.now()}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
    }
};

window.onload = () => app.init();