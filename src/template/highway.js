/**
 * 模版：高速公路标志库
 * 优化：移除所有 bold 声明
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

                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    const off = 0.75 * unit;
                    app.utils.strokeRoundedRect(ctx, off, off, baseW - 1.5 * unit, baseH - 1.5 * unit, r - off);
                    ctx.restore();

                    const headY = 10 * unit; const headSize = 10 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1.5) * 22 * unit;
                        app.utils.text(ctx, char, charX, headY, headSize, "#FFFFFF", "RoadGen-A");
                    });

                    let mainFS = 70 * unit; let subFS = mainFS * 0.6; let interGap = 2 * unit;
                    ctx.font = `${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let totalW = mainW; let subW = 0;
                    if (subVal) {
                        ctx.font = `${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                        totalW += interGap + subW;
                    }

                    const maxW = baseW * 0.88;
                    if (totalW > maxW) {
                        const scale = maxW / totalW;
                        mainFS *= scale; subFS *= scale; totalW = maxW;
                    }

                    const startX = (baseW - totalW) / 2;
                    const mainY = 60 * unit + mainFS * 0.05;
                    app.utils.text(ctx, mainVal, startX + (mainW * (totalW/totalW)) / 2, mainY, mainFS, "#FFFFFF", "RoadGen-B");
                    if (subVal) {
                        const subX = startX + (mainW * (totalW/(mainW + subW))) + interGap + subW/2;
                        app.utils.text(ctx, subVal, subX, mainY + (mainFS - subFS) * 0.40, subFS, "#FFFFFF", "RoadGen-B");
                    }
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

                    const headY = 13 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1.5) * 22 * unit;
                        app.utils.text(ctx, char, charX, headY, 10 * unit, "#FFFFFF", "RoadGen-A");
                    });

                    const idY = 53.5 * unit;
                    let mainFS = 55 * unit; let subFS = mainFS * 0.6;
                    ctx.font = `${mainFS}px "RoadGen-B"`;
                    const mWidth = ctx.measureText(mainVal).width;
                    let totalIdW = mWidth + (subVal ? subFS * 1.5 : 0);
                    const maxIdW = baseW - 30 * unit;
                    if(totalIdW > maxIdW) {
                        const s = maxIdW / totalIdW; mainFS *= s; subFS *= s; totalIdW = maxIdW;
                    }

                    const idStartX = (baseW - totalIdW) / 2;
                    app.utils.text(ctx, mainVal, idStartX + mWidth/2, idY + mainFS*0.05, mainFS, "#FFFFFF", "RoadGen-B");
                    if(subVal) {
                        const subX = idStartX + mWidth + (2 * unit) + (ctx.measureText(subVal).width)/2;
                        app.utils.text(ctx, subVal, subX, idY + (mainFS-subFS)*0.4 + mainFS*0.05, subFS, "#FFFFFF", "RoadGen-B");
                    }

                    const nameY = 93.5 * unit; const nameFS = 22 * unit; const nameChars = nameTxt.split("");
                    let nameSpacing = 26 * unit;
                    if(isLong) {
                        const availableW = baseW - 30 * unit;
                        nameSpacing = availableW / (nameChars.length - 1);
                    }
                    nameChars.forEach((char, i) => {
                        const charX = (baseW / 2) + (i - (nameChars.length - 1) / 2) * nameSpacing;
                        app.utils.text(ctx, char, charX, nameY, nameFS, "#FFFFFF", "RoadGen-A");
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

                    const headY = 10 * unit;
                    [params.prov||'苏', "高", "速"].forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1) * 25 * unit;
                        app.utils.text(ctx, char, charX, headY, 10 * unit, app.colors.black, "RoadGen-A");
                    });

                    let mainFS = 70 * unit; let subFS = mainFS * 0.6;
                    ctx.font = `${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let totalW = mainW + (subVal ? subFS * 1.5 : 0);
                    const maxW = baseW * 0.88;
                    if(totalW > maxW) {
                        const s = maxW / totalW; mainFS *= s; subFS *= s; totalW = maxW;
                    }

                    const startX = (baseW - totalW) / 2;
                    app.utils.text(ctx, mainVal, startX + mainW/2, 60*unit + mainFS*0.05, mainFS, "#FFFFFF", "RoadGen-B");
                    if(subVal) {
                        app.utils.text(ctx, subVal, startX + mainW + 2*unit + (ctx.measureText(subVal).width)/2, 60*unit + (mainFS-subFS)*0.4 + mainFS*0.05, subFS, "#FFFFFF", "RoadGen-B");
                    }
                }
            }
        }
    }
};