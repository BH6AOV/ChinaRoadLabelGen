/**
 * 模版：高速公路标志库
 * 更新：同步默认初始值 (国家高速: G36, 省级高速: 苏 S1)
 */
window.HighwayTemplates = {
    // 二级：国家高速
    national: {
        name: "国家高速",
        items: {
            id_only: {
                name: "编号标识",
                fields: [
                    { id: 'hwyId', label: '高速编号 (如 G36)', type: 'text', default: 'G36' },
                    { id: 'subLabel', label: '线路角标 (如 01)', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    const unit = app.baseSize / 100;
                    const D = 100 * unit; 
                    const r = 12 * unit; 
                    canvas.width = D; canvas.height = D;

                    app.utils.drawRoundedRect(ctx, 0, 0, D, D, r, app.colors.green);
                    const hY = 3 * unit; const hH = 20 * unit; const bW = 3 * unit; 
                    
                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, hY); ctx.lineTo(D - r, hY);
                    ctx.arcTo(D - bW, hY, D - bW, hY + r, r - bW);
                    ctx.lineTo(D - bW, hY + hH); ctx.lineTo(bW, hY + hH);
                    ctx.lineTo(bW, hY + r); ctx.arcTo(bW, hY, r, hY, r - bW);
                    ctx.fillStyle = app.colors.red; ctx.fill(); ctx.restore();

                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    app.utils.strokeRoundedRect(ctx, 3 * unit, 3 * unit, 94 * unit, 94 * unit, r - 3 * unit);
                    ctx.restore();

                    const charSize = 10 * unit; const charY = 13 * unit; 
                    "国家高速".split("").forEach((char, i) => {
                        app.utils.text(ctx, char, (20 + i * 20) * unit, charY, charSize, "#FFFFFF", "RoadGen-A");
                    });

                    const mainVal = params.hwyId || 'G36';
                    const subVal = params.subLabel || '';
                    const boxW = 67 * unit; const boxYCenter = 59.5 * unit; const interGap = 1.5 * unit;
                    
                    let mainFS = 48 * unit; let subFS = mainFS * 0.62;
                    ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let totalW = mainW; let subW = 0;
                    if (subVal) {
                        ctx.font = `bold ${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                        totalW += interGap + subW;
                    }

                    let scale = totalW > boxW ? boxW / totalW : 1.0;
                    mainFS *= scale; subFS *= scale; totalW *= scale;

                    const startX = (D - totalW) / 2;
                    const mainY = boxYCenter + mainFS * 0.05;
                    app.utils.text(ctx, mainVal, startX + (mainW * scale) / 2, mainY, mainFS, "#FFFFFF", "RoadGen-B");

                    if (subVal) {
                        const subX = startX + (mainW * scale) + (interGap * scale) + (subW * scale) / 2;
                        const baselineOffset = (mainFS - subFS) * 0.4; 
                        app.utils.text(ctx, subVal, subX, mainY + baselineOffset, subFS, "#FFFFFF", "RoadGen-B");
                    }
                }
            },
            name_id: {
                name: "名称编号标识",
                fields: [
                    { id: 'hwyName', label: '高速名称', type: 'text', default: '京港澳高速' },
                    { id: 'hwyId', label: '高速编号', type: 'text', default: 'G4' }
                ],
                draw: (ctx, canvas, params, app) => { /* 待开发 */ }
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
                    { id: 'hwyId', label: '高速编号', type: 'text', default: 'S1' },
                    { id: 'subLabel', label: '线路角标 (选填)', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    const unit = app.baseSize / 100;
                    const baseH = 100 * unit; const baseW = 125 * unit; const r = 12 * unit;
                    canvas.width = baseW; canvas.height = baseH;

                    app.utils.drawRoundedRect(ctx, 0, 0, baseW, baseH, r, app.colors.green);
                    const hY = 3 * unit; const hH = 20 * unit; const bW = 3 * unit;

                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, hY); ctx.lineTo(baseW - r, hY);
                    ctx.arcTo(baseW - bW, hY, baseW - bW, hY + r, r - bW);
                    ctx.lineTo(baseW - bW, hY + hH); ctx.lineTo(bW, hY + hH);
                    ctx.lineTo(bW, hY + r); ctx.arcTo(bW, hY, r, hY, r - bW);
                    ctx.fillStyle = app.colors.yellow; ctx.fill(); ctx.restore();

                    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    app.utils.strokeRoundedRect(ctx, 3 * unit, 3 * unit, baseW - 6 * unit, baseH - 6 * unit, r - 3 * unit);

                    const provChar = params.prov || '苏';
                    const charY = 13 * unit; const charSize = 10 * unit;
                    [provChar, "高", "速"].forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1) * 22 * unit;
                        app.utils.text(ctx, char, charX, charY, charSize, app.colors.black, "RoadGen-A");
                    });

                    const mainVal = params.hwyId || 'S1';
                    const subVal = params.subLabel || '';
                    const boxW = 107 * unit; const boxYCenter = 59.5 * unit;

                    let mainFS = 48 * unit; let subFS = mainFS * 0.62;
                    ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let totalW = mainW; let subW = 0;
                    if(subVal) {
                        ctx.font = `bold ${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                        totalW += 2 * unit + subW;
                    }

                    let scale = totalW > boxW ? boxW / totalW : 1.0;
                    mainFS *= scale; subFS *= scale; totalW *= scale;

                    const startX = (baseW - totalW) / 2;
                    const mainY = boxYCenter + mainFS * 0.05;
                    app.utils.text(ctx, mainVal, startX + (mainW * scale) / 2, mainY, mainFS, "#FFFFFF", "RoadGen-B");

                    if(subVal) {
                        const subX = startX + (mainW * scale) + (2 * unit * scale) + (subW * scale) / 2;
                        app.utils.text(ctx, subVal, subX, mainY + (mainFS - subFS) * 0.4, subFS, "#FFFFFF", "RoadGen-B");
                    }
                }
            }
        }
    }
};