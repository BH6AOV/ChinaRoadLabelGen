/**
 * 模版：高速公路标志库
 * 状态：校准 2 位编号宽度为 125，实现 100/125/160 三级尺寸自适应
 */
window.HighwayTemplates = {
    // 二级：国家高速
    national: {
        name: "国家高速",
        items: {
            id_only: {
                name: "编号标识",
                fields: [
                    { id: 'hwyId', label: '高速编号 (如 G1, G36)', type: 'text', default: 'G36' },
                    { id: 'subLabel', label: '线路角标 (如 11)', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    const unit = app.baseSize / 100;
                    let mainVal = params.hwyId || 'G36';
                    const subVal = params.subLabel || '';

                    // 1. 补零逻辑：有角标且主号为1位数字时补0 (G1 -> G01)
                    if (subVal !== "") {
                        const match = mainVal.match(/^(G)(\d)$/);
                        if (match) mainVal = match[1] + "0" + match[2];
                    }

                    // 2. 确定画布宽度 (三级自适应)
                    let baseW = 100;
                    let idBoxW_ratio = 0.56; // 默认 1 位数比例

                    if (subVal !== "") {
                        baseW = 160;       // 带角标 (4位)
                        idBoxW_ratio = 0.92;
                    } else if (mainVal.length === 3) {
                        baseW = 125;       // 2 位数编号 (如 G36)
                        idBoxW_ratio = 0.85;
                    } else if (mainVal.length > 3) {
                        baseW = 125;       // 容错处理
                        idBoxW_ratio = 0.85;
                    }
                    
                    const drawW = baseW * unit;
                    const drawH = 100 * unit;
                    const r = 12 * unit;
                    canvas.width = drawW;
                    canvas.height = drawH;

                    // 3. 绘制底板
                    app.utils.drawRoundedRect(ctx, 0, 0, drawW, drawH, r, app.colors.green);
                    
                    // 4. 红色头部 (y: 0-20)
                    const hH = 20 * unit; 
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(r, 0); ctx.lineTo(drawW - r, 0);
                    ctx.arcTo(drawW, 0, drawW, r, r);
                    ctx.lineTo(drawW, hH); ctx.lineTo(0, hH);
                    ctx.lineTo(0, r); ctx.arcTo(0, 0, r, 0, r);
                    ctx.fillStyle = app.colors.red; ctx.fill();
                    ctx.restore();

                    // 5. 白色衬边 (紧贴边缘)
                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    const off = 0.75 * unit;
                    app.utils.strokeRoundedRect(ctx, off, off, drawW - 1.5 * unit, drawH - 1.5 * unit, r - off);
                    ctx.restore();

                    // 6. 头部汉字 (垂直中心10)
                    const headSize = 10 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (drawW / 2) + (i - 1.5) * 22 * unit;
                        app.utils.text(ctx, char, charX, 10 * unit, headSize, "#FFFFFF", "RoadGen-A", "normal");
                    });

                    // 7. 编号区：两侧对齐
                    const idFullText = mainVal + subVal;
                    const idFS = 72 * unit;
                    const idBoxW = drawW * idBoxW_ratio;
                    app.utils.drawJustifiedText(ctx, idFullText, drawW / 2, 60 * unit, idFS, idBoxW, "#FFFFFF", "RoadGen-B", "normal");
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
                    const nameTxt = params.hwyName; 
                    let mainVal = params.hwyId; 
                    const subVal = params.subLabel;

                    if (subVal !== "") {
                        const match = mainVal.match(/^(G)(\d)$/);
                        if (match) mainVal = match[1] + "0" + match[2];
                    }

                    const isLong = (subVal !== "") || nameTxt.length > 4;
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

                    const headY = 13 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1.5) * 24 * unit;
                        app.utils.text(ctx, char, charX, headY, 10 * unit, "#FFFFFF", "RoadGen-A", "normal");
                    });

                    const idFullText = mainVal + subVal;
                    const idFS = 55 * unit; const idBoxW = baseW - 30 * unit;
                    app.utils.drawJustifiedText(ctx, idFullText, baseW / 2, 53.5 * unit, idFS, idBoxW, "#FFFFFF", "RoadGen-B", "normal");

                    const nameChars = nameTxt.split("");
                    const nameSpacing = isLong ? (baseW - 40 * unit) / (nameChars.length - 1) : 22 * unit;
                    nameChars.forEach((char, i) => {
                        const charX = (baseW / 2) + (i - (nameChars.length - 1) / 2) * nameSpacing;
                        app.utils.text(ctx, char, charX, 93.5 * unit, 22 * unit, "#FFFFFF", "RoadGen-A", "normal");
                    });
                }
            }
        }
    },
    // 二级：省级高速
    provincial: {
        name: "省级高速",
        items: {
            id_only: {
                name: "编号标识",
                fields: [
                    { id: 'prov', label: '省份简称', type: 'text', default: '苏' },
                    { id: 'hwyId', label: '高速编号 (如 S1, S49)', type: 'text', default: 'S1' },
                    { id: 'subLabel', label: '线路角标', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    const unit = app.baseSize / 100;
                    let mainVal = params.hwyId || 'S1';
                    const subVal = params.subLabel || '';

                    if (subVal !== "") {
                        const match = mainVal.match(/^(S)(\d)$/);
                        if (match) mainVal = match[1] + "0" + match[2];
                    }

                    // 省级高速同步三级自适应宽度逻辑
                    let baseW = 100;
                    let idBoxW_ratio = 0.56; 

                    if (subVal !== "") {
                        baseW = 160;
                        idBoxW_ratio = 0.92;
                    } else if (mainVal.length === 3) {
                        baseW = 125;
                        idBoxW_ratio = 0.85;
                    }

                    const drawW = baseW * unit;
                    const drawH = 100 * unit; const r = 12 * unit;
                    canvas.width = drawW; canvas.height = drawH;

                    app.utils.drawRoundedRect(ctx, 0, 0, drawW, drawH, r, app.colors.green);
                    const hH = 20 * unit; 
                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, 0); ctx.lineTo(drawW - r, 0); ctx.arcTo(drawW, 0, drawW, r, r);
                    ctx.lineTo(drawW, hH); ctx.lineTo(0, hH); ctx.lineTo(0, r); ctx.arcTo(0, 0, r, 0, r);
                    ctx.fillStyle = app.colors.yellow; ctx.fill(); ctx.restore();

                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    const off = 0.75 * unit;
                    app.utils.strokeRoundedRect(ctx, off, off, drawW - 1.5 * unit, drawH - 1.5 * unit, r - off);
                    ctx.restore();

                    const provChar = params.prov || '苏';
                    [provChar, "高", "速"].forEach((char, i) => {
                        const charX = (drawW / 2) + (i - 1) * 24 * unit;
                        app.utils.text(ctx, char, charX, 10 * unit, 10 * unit, app.colors.black, "RoadGen-A", "normal");
                    });

                    const idFullText = mainVal + subVal;
                    const idFS = 70 * unit; 
                    const idBoxW = drawW * idBoxW_ratio;
                    app.utils.drawJustifiedText(ctx, idFullText, drawW / 2, 60 * unit, idFS, idBoxW, "#FFFFFF", "RoadGen-B", "normal");
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
                    const nameTxt = params.hwyName; 
                    let mainVal = params.hwyId; 
                    const subVal = params.subLabel;

                    if (subVal !== "") {
                        const match = mainVal.match(/^(S)(\d)$/);
                        if (match) mainVal = match[1] + "0" + match[2];
                    }

                    const isLong = (subVal !== "") || nameTxt.length > 4;
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

                    const provChar = params.prov || '苏';
                    [provChar, "高", "速"].forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1) * 24 * unit;
                        app.utils.text(ctx, char, charX, 13 * unit, 10 * unit, app.colors.black, "RoadGen-A", "normal");
                    });

                    const idFullText = mainVal + subVal;
                    const idFS = 55 * unit; const idBoxW = baseW - 30 * unit;
                    app.utils.drawJustifiedText(ctx, idFullText, baseW / 2, 53.5 * unit, idFS, idBoxW, "#FFFFFF", "RoadGen-B", "normal");

                    const nameChars = nameTxt.split("");
                    const nameSpacing = isLong ? (baseW - 40 * unit) / (nameChars.length - 1) : 22 * unit;
                    nameChars.forEach((char, i) => {
                        const charX = (baseW / 2) + (i - (nameChars.length - 1) / 2) * nameSpacing;
                        app.utils.text(ctx, char, charX, 93.5 * unit, 22 * unit, "#FFFFFF", "RoadGen-A", "normal");
                    });
                }
            }
        }
    }
};