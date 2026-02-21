/**
 * 模版：高速公路标志库
 * 修复点：精简选单名称、缩小国家高速角标比例、收窄省级高速字符间距
 */
window.HighwayTemplates = {
    national: {
        name: "国家高速",
        items: {
            id_only: {
                name: "编号标识", // 修复 4: 移除编号
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

                    // 白色衬边紧贴画布边缘 (无外部留白)
                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    const off = 0.75 * unit;
                    app.utils.strokeRoundedRect(ctx, off, off, baseW - 1.5 * unit, baseH - 1.5 * unit, r - off);
                    ctx.restore();

                    const headY = 10 * unit; const headSize = 10 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1.5) * 22 * unit;
                        app.utils.text(ctx, char, charX, headY, headSize, "#FFFFFF", "RoadGen-A");
                    });

                    let mainFS = 70 * unit; 
                    // 修复 2: 脚标文字比例由 0.6 降至 0.5
                    let subFS = mainFS * 0.5; 
                    let interGap = 1.5 * unit; // 修复 3 对齐: 收窄间距

                    ctx.font = `${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let subW = 0;
                    if (subVal) {
                        ctx.font = `${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                    }
                    
                    const totalW = mainW + (subVal ? (interGap + subW) : 0);
                    const maxW = baseW * 0.88;
                    const scale = totalW > maxW ? maxW / totalW : 1.0;
                    const finalMainW = mainW * scale;
                    const finalSubW = subW * scale;

                    const startX = (baseW - totalW * scale) / 2;
                    const mainY = 60 * unit + (mainFS * scale) * 0.05;

                    app.utils.text(ctx, mainVal, startX + finalMainW / 2, mainY, mainFS * scale, "#FFFFFF", "RoadGen-B");
                    if (subVal) {
                        const subX = startX + finalMainW + interGap * scale + finalSubW / 2;
                        app.utils.text(ctx, subVal, subX, mainY + (mainFS * scale - subFS * scale) * 0.40, subFS * scale, "#FFFFFF", "RoadGen-B");
                    }
                }
            },
            name_id: {
                name: "名称编号标识", // 修复 4: 移除编号
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

                    app.utils.text(ctx, "国家高速", baseW/2, 13*unit, 10*unit, "#FFFFFF", "RoadGen-A");

                    let mainFS = 55 * unit; let subFS = mainFS * 0.5; // 修复 2: 脚标缩小
                    ctx.font = `${mainFS}px "RoadGen-B"`;
                    const mWidth = ctx.measureText(mainVal).width;
                    let sWidth = 0;
                    if(subVal) {
                        ctx.font = `${subFS}px "RoadGen-B"`;
                        sWidth = ctx.measureText(subVal).width;
                    }
                    
                    const totalIdW = mWidth + (subVal ? (2 * unit + sWidth) : 0);
                    const maxIdW = baseW - 30 * unit;
                    const idScale = totalIdW > maxIdW ? maxIdW / totalIdW : 1.0;

                    const idStartX = (baseW - totalIdW * idScale) / 2;
                    app.utils.text(ctx, mainVal, idStartX + (mWidth * idScale) / 2, 53.5 * unit + (mainFS * idScale) * 0.05, mainFS * idScale, "#FFFFFF", "RoadGen-B");
                    if(subVal) {
                        const subX = idStartX + (mWidth * idScale) + (2 * unit * idScale) + (sWidth * idScale) / 2;
                        app.utils.text(ctx, subVal, subX, 53.5 * unit + (mainFS * idScale - subFS * idScale) * 0.40, subFS * idScale, "#FFFFFF", "RoadGen-B");
                    }

                    const nameChars = nameTxt.split("");
                    // 修复 3 相关: 间距调小至 20 左右
                    let nameSpacing = isLong ? (baseW - 40 * unit) / (nameChars.length - 1) : 20 * unit;
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
                name: "编号标识", // 修复 4: 移除编号
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
                    const off = 0.75 * unit;
                    app.utils.strokeRoundedRect(ctx, off, off, baseW - 1.5 * unit, baseH - 1.5 * unit, r - off);
                    ctx.restore();

                    [params.prov||'苏', "高", "速"].forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1) * 25 * unit;
                        app.utils.text(ctx, char, charX, 10 * unit, 10 * unit, app.colors.black, "RoadGen-A");
                    });

                    let mainFS = 70 * unit; let subFS = mainFS * 0.5; // 修复 2 对齐
                    // 修复 3: 收窄间距，interGap 设为 1，且 maxW 阈值调低强制紧凑
                    let interGap = 1 * unit;
                    ctx.font = `${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let subW = 0;
                    if(subVal) {
                        ctx.font = `${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                    }
                    
                    const totalW = mainW + (subVal ? (interGap + subW) : 0);
                    // 强制收窄到 75% 宽度内，如果超出则缩放，不超正则保持紧凑
                    const maxW = baseW * 0.75; 
                    const scale = totalW > maxW ? maxW / totalW : 1.0;

                    const startX = (baseW - totalW * scale) / 2;
                    app.utils.text(ctx, mainVal, startX + (mainW * scale) / 2, 60 * unit, mainFS * scale, "#FFFFFF", "RoadGen-B");
                    if(subVal) {
                        const subX = startX + (mainW * scale) + (interGap * scale) + (subW * scale) / 2;
                        app.utils.text(ctx, subVal, subX, 60 * unit + (mainFS * scale - subFS * scale) * 0.4, subFS * scale, "#FFFFFF", "RoadGen-B");
                    }
                }
            },
            name_id: {
                name: "名称编号标识", // 修复 4: 移除编号
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

                    let mainFS = 55 * unit; let subFS = mainFS * 0.5; // 修复 2: 脚标缩小
                    ctx.font = `${mainFS}px "RoadGen-B"`;
                    const mWidth = ctx.measureText(mainVal).width;
                    let sWidth = 0;
                    if(subVal) {
                        ctx.font = `${subFS}px "RoadGen-B"`;
                        sWidth = ctx.measureText(subVal).width;
                    }
                    
                    const totalIdW = mWidth + (subVal ? (2 * unit + sWidth) : 0);
                    const maxIdW = baseW - 30 * unit;
                    const idScale = totalIdW > maxIdW ? maxIdW / totalIdW : 1.0;

                    const idStartX = (baseW - totalIdW * idScale) / 2;
                    app.utils.text(ctx, mainVal, idStartX + (mWidth * idScale) / 2, 53.5 * unit, mainFS * idScale, "#FFFFFF", "RoadGen-B");
                    if(subVal) {
                        const subX = idStartX + (mWidth * idScale) + (2 * unit * idScale) + (sWidth * idScale) / 2;
                        app.utils.text(ctx, subVal, subX, 53.5 * unit + (mainFS * idScale - subFS * idScale) * 0.40, subFS * idScale, "#FFFFFF", "RoadGen-B");
                    }

                    const nameChars = nameTxt.split("");
                    let nameSpacing = isLong ? (baseW - 40 * unit) / (nameChars.length - 1) : 20 * unit;
                    nameChars.forEach((char, i) => {
                        const charX = (baseW / 2) + (i - (nameChars.length - 1) / 2) * nameSpacing;
                        app.utils.text(ctx, char, charX, 93.5 * unit, 22 * unit, "#FFFFFF", "RoadGen-A");
                    });
                }
            }
        }
    }
};