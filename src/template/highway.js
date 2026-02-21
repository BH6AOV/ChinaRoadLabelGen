/**
 * 模版：高速公路标志库
 * 修复：编号两侧对齐、精简菜单、缩小脚标、校准头部间距
 */
window.HighwayTemplates = {
    national: {
        name: "国家高速",
        items: {
            id_only: {
                name: "编号标识",
                fields: [
                    { id: 'hwyId', label: '高速编号 (如 G25)', type: 'text', default: 'G25' },
                    { id: 'subLabel', label: '线路角标 (如 01)', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    const unit = app.baseSize / 100;
                    const mainVal = params.hwyId; const subVal = params.subLabel;
                    const baseW = (subVal ? 160 : 100) * unit;
                    const baseH = 100 * unit; const r = 12 * unit;
                    canvas.width = baseW; canvas.height = baseH;

                    app.utils.drawRoundedRect(ctx, 0, 0, baseW, baseH, r, app.colors.green);
                    const hH = 20 * unit; 
                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, 0); ctx.lineTo(baseW - r, 0); ctx.arcTo(baseW, 0, baseW, r, r);
                    ctx.lineTo(baseW, hH); ctx.lineTo(0, hH); ctx.lineTo(0, r); ctx.arcTo(0, 0, r, 0, r);
                    ctx.fillStyle = app.colors.red; ctx.fill(); ctx.restore();

                    // 衬边紧贴边缘
                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    const off = 0.75 * unit;
                    app.utils.strokeRoundedRect(ctx, off, off, baseW - 1.5 * unit, baseH - 1.5 * unit, r - off);
                    ctx.restore();

                    const headY = 10 * unit; const headSize = 10 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1.5) * 22 * unit;
                        app.utils.text(ctx, char, charX, headY, headSize, "#FFFFFF", "RoadGen-A");
                    });

                    // 编号区两侧对齐逻辑
                    let mainFS = 70 * unit; let subFS = mainFS * 0.5; // 修复 2: 脚标降至 0.5
                    const idText = mainVal + subVal;
                    const boxW = baseW * 0.88;
                    app.utils.drawJustifiedText(ctx, idText, baseW / 2, 60 * unit, mainFS, boxW, "#FFFFFF", "RoadGen-B");
                }
            },
            name_id: {
                name: "名称编号标识",
                fields: [
                    { id: 'hwyName', label: '高速名称', type: 'text', default: '宁洛高速' },
                    { id: 'hwyId', label: '高速编号', type: 'text', default: 'G36' },
                    { id: 'subLabel', label: '线路角标', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    const unit = app.baseSize / 100;
                    const nameTxt = params.hwyName; const mainVal = params.hwyId; const subVal = params.subLabel;
                    const isLong = (subVal && subVal.length > 0) || nameTxt.length > 4;
                    const baseW = (isLong ? 160 : 125) * unit;
                    const baseH = 120 * unit; const r = 12 * unit;
                    canvas.width = baseW; canvas.height = baseH;

                    app.utils.drawRoundedRect(ctx, 0, 0, baseW, baseH, r, app.colors.green);
                    const bW = 3 * unit;
                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, bW); ctx.lineTo(baseW - r, bW);
                    ctx.arcTo(baseW - bW, bW, baseW - bW, bW + r, r - bW);
                    ctx.lineTo(baseW - bW, bW + 20 * unit); ctx.lineTo(bW, bW + 20 * unit);
                    ctx.lineTo(bW, bW + r); ctx.arcTo(bW, bW, r, bW, r - bW);
                    ctx.fillStyle = app.colors.red; ctx.fill(); ctx.restore();

                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    app.utils.strokeRoundedRect(ctx, 3 * unit, 3 * unit, baseW - 6 * unit, baseH - 6 * unit, r - 3 * unit);
                    ctx.restore();

                    // 核心修复: 国家高速头部间距校准为 24，y中心对齐 13
                    const headY = 13 * unit;
                    const headSize = 10 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1.5) * 24 * unit;
                        app.utils.text(ctx, char, charX, headY, headSize, "#FFFFFF", "RoadGen-A");
                    });

                    // 编号区两侧对齐
                    let mainFS = 55 * unit; 
                    const idBoxW = baseW - 30 * unit;
                    app.utils.drawJustifiedText(ctx, (mainVal + subVal), baseW / 2, 53.5 * unit, mainFS, idBoxW, "#FFFFFF", "RoadGen-B");

                    const nameChars = nameTxt.split("");
                    let nameSpacing = isLong ? (baseW - 40 * unit) / (nameChars.length - 1) : 22 * unit;
                    nameChars.forEach((char, i) => {
                        const charX = (baseW / 2) + (i - (nameChars.length - 1) / 2) * nameSpacing;
                        app.utils.text(ctx, char, charX, 93.5 * unit, 22 * unit, "#FFFFFF", "RoadGen-A");
                    });
                }
            }
        }
    },
    provincial: {
        name: "省级高速",
        items: {
            id_only: {
                name: "编号标识",
                fields: [
                    { id: 'prov', label: '省份简称', type: 'text', default: '苏' },
                    { id: 'hwyId', label: '高速编号 (如 S1)', type: 'text', default: 'S1' },
                    { id: 'subLabel', label: '线路角标', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    const unit = app.baseSize / 100;
                    const mainVal = params.hwyId; const subVal = params.subLabel;
                    const baseW = (subVal ? 160 : 100) * unit;
                    const baseH = 100 * unit; const r = 12 * unit;
                    canvas.width = baseW; canvas.height = baseH;

                    app.utils.drawRoundedRect(ctx, 0, 0, baseW, baseH, r, app.colors.green);
                    const hH = 20 * unit; 
                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, 0); ctx.lineTo(baseW - r, 0); ctx.arcTo(baseW, 0, baseW, r, r);
                    ctx.lineTo(baseW, hH); ctx.lineTo(0, hH); ctx.lineTo(0, r); ctx.arcTo(0, 0, r, 0, r);
                    ctx.fillStyle = app.colors.yellow; ctx.fill(); ctx.restore();

                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    app.utils.strokeRoundedRect(ctx, 0.75*unit, 0.75*unit, baseW-1.5*unit, baseH-1.5*unit, r-0.75*unit);
                    ctx.restore();

                    [params.prov||'苏', "高", "速"].forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1) * 25 * unit;
                        app.utils.text(ctx, char, charX, 10 * unit, 10 * unit, app.colors.black, "RoadGen-A");
                    });

                    // 修复 3: 省级高速收窄间距至 0.75 宽度比例
                    let idFS = 70 * unit; 
                    const idBoxW = baseW * 0.75;
                    app.utils.drawJustifiedText(ctx, (mainVal + subVal), baseW / 2, 60 * unit, idFS, idBoxW, "#FFFFFF", "RoadGen-B");
                }
            },
            name_id: {
                name: "名称编号标识",
                fields: [
                    { id: 'prov', label: '省份简称', type: 'text', default: '苏' },
                    { id: 'hwyName', label: '高速名称', type: 'text', default: '宁宣高速' },
                    { id: 'hwyId', label: '高速编号', type: 'text', default: 'S1' },
                    { id: 'subLabel', label: '线路角标', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    const unit = app.baseSize / 100;
                    const nameTxt = params.hwyName; const mainVal = params.hwyId; const subVal = params.subLabel;
                    const isLong = (subVal && subVal.length > 0) || nameTxt.length > 4;
                    const baseW = (isLong ? 160 : 125) * unit;
                    const baseH = 120 * unit; const r = 12 * unit;
                    canvas.width = baseW; canvas.height = baseH;

                    app.utils.drawRoundedRect(ctx, 0, 0, baseW, baseH, r, app.colors.green);
                    const bW = 3 * unit;
                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, bW); ctx.lineTo(baseW - r, bW);
                    ctx.arcTo(baseW - bW, bW, baseW - bW, bW + r, r - bW);
                    ctx.lineTo(baseW - bW, bW + 20 * unit); ctx.lineTo(bW, bW + 20 * unit);
                    ctx.lineTo(bW, bW + r); ctx.arcTo(bW, bW, r, bW, r - bW);
                    ctx.fillStyle = app.colors.yellow; ctx.fill(); ctx.restore();

                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    app.utils.strokeRoundedRect(ctx, 3 * unit, 3 * unit, baseW - 6 * unit, baseH - 6 * unit, r - 3 * unit);
                    ctx.restore();

                    [params.prov||'苏', "高", "速"].forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1) * 22 * unit;
                        app.utils.text(ctx, char, charX, 13 * unit, 10 * unit, app.colors.black, "RoadGen-A");
                    });

                    let idFS = 55 * unit; 
                    const idBoxW = baseW - 25 * unit;
                    app.utils.drawJustifiedText(ctx, (mainVal + subVal), baseW / 2, 53.5 * unit, idFS, idBoxW, "#FFFFFF", "RoadGen-B");

                    const nameChars = nameTxt.split("");
                    const nameSpacing = isLong ? (baseW - 40 * unit) / (nameChars.length - 1) : 22 * unit;
                    nameChars.forEach((char, i) => {
                        const charX = (baseW / 2) + (i - (nameChars.length - 1) / 2) * nameSpacing;
                        app.utils.text(ctx, char, charX, 93.5 * unit, 22 * unit, "#FFFFFF", "RoadGen-A");
                    });
                }
            }
        }
    }
};