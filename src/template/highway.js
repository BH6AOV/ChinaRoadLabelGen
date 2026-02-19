/**
 * 模版：高速公路标志库
 * 修复：移除外部绿框（全屏覆盖），极限放大编号尺寸
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
                    const r = 10 * unit; // 适当减小圆角以获得更硬朗的工业感
                    
                    canvas.width = D;
                    canvas.height = D;

                    // 1. 绘制绿底板 (完全覆盖 100x100)
                    app.utils.drawRoundedRect(ctx, 0, 0, D, D, r, app.colors.green);
                    
                    // 2. 绘制红色头部 (y: 0-20, 紧贴顶部)
                    const hH = 20 * unit; 
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(r, 0);
                    ctx.lineTo(D - r, 0);
                    ctx.arcTo(D, 0, D, r, r);
                    ctx.lineTo(D, hH);
                    ctx.lineTo(0, hH);
                    ctx.lineTo(0, r);
                    ctx.arcTo(0, 0, r, 0, r);
                    ctx.fillStyle = app.colors.red;
                    ctx.fill();
                    ctx.restore();

                    // 3. 绘制白色衬边 (紧贴边缘，不留外部绿框)
                    ctx.save();
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.lineWidth = 1.5 * unit;
                    const offset = 0.75 * unit; // 线宽一半的偏移
                    app.utils.strokeRoundedRect(ctx, offset, offset, D - 1.5 * unit, D - 1.5 * unit, r - offset);
                    ctx.restore();

                    // 4. 头部汉字 "国家高速" (垂直居中于 10)
                    const charSize = 10 * unit;
                    const charY = 10 * unit; 
                    const headerChars = "国家高速".split("");
                    headerChars.forEach((char, i) => {
                        const charX = (20 + i * 20) * unit;
                        app.utils.text(ctx, char, charX, charY, charSize, "#FFFFFF", "RoadGen-A");
                    });

                    // 5. 编号区 - 参照 G36 极限放大
                    const mainVal = params.hwyId || 'G36';
                    const subVal = params.subLabel || '';
                    
                    const boxW = 92 * unit; // 宽度极限利用
                    const boxYCenter = 60 * unit; 
                    
                    let mainFS = 72 * unit; // 进一步放大字号至 72
                    let subFS = mainFS * 0.6;

                    ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let totalW = mainW;
                    let subW = 0;
                    if (subVal) {
                        ctx.font = `bold ${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                        totalW += 1 * unit + subW;
                    }

                    // 自动缩放
                    let scale = totalW > boxW ? boxW / totalW : 1.0;
                    mainFS *= scale; subFS *= scale; totalW *= scale;

                    const startX = (D - totalW) / 2;
                    const mainY = boxYCenter + mainFS * 0.05;
                    app.utils.text(ctx, mainVal, startX + (mainW * scale) / 2, mainY, mainFS, "#FFFFFF", "RoadGen-B");

                    if (subVal) {
                        const subX = startX + (mainW * scale) + (1 * unit * scale) + (subW * scale) / 2;
                        const baselineOffset = (mainFS - subFS) * 0.45; 
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
    // 二级：省级高速 (同步应用无边框和放大逻辑)
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
                    const D = 100 * unit; 
                    const r = 10 * unit;
                    canvas.width = D; canvas.height = D;

                    app.utils.drawRoundedRect(ctx, 0, 0, D, D, r, app.colors.green);
                    const hH = 20 * unit;
                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, 0); ctx.lineTo(D - r, 0);
                    ctx.arcTo(D, 0, D, r, r); ctx.lineTo(D, hH); ctx.lineTo(0, hH); ctx.lineTo(0, r); ctx.arcTo(0, 0, r, 0, r);
                    ctx.fillStyle = app.colors.yellow; ctx.fill(); ctx.restore();

                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    const offset = 0.75 * unit;
                    app.utils.strokeRoundedRect(ctx, offset, offset, D - 1.5 * unit, D - 1.5 * unit, r - offset);
                    ctx.restore();

                    const charY = 10 * unit; const charSize = 10 * unit;
                    [params.prov || '苏', "高", "速"].forEach((char, i) => {
                        app.utils.text(ctx, char, 50 * unit + (i - 1) * 25 * unit, charY, charSize, app.colors.black, "RoadGen-A");
                    });

                    const mainVal = params.hwyId || 'S1';
                    const subVal = params.subLabel || '';
                    const boxW = 92 * unit; const boxYCenter = 60 * unit;

                    let mainFS = 72 * unit; let subFS = mainFS * 0.6;
                    ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let totalW = mainW; let subW = 0;
                    if(subVal) {
                        ctx.font = `bold ${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                        totalW += 1 * unit + subW;
                    }

                    let scale = totalW > boxW ? boxW / totalW : 1.0;
                    mainFS *= scale; subFS *= scale; totalW *= scale;

                    const startX = (D - totalW) / 2;
                    const mainY = boxYCenter + mainFS * 0.05;
                    app.utils.text(ctx, mainVal, startX + (mainW * scale) / 2, mainY, mainFS, "#FFFFFF", "RoadGen-B");

                    if(subVal) {
                        const subX = startX + (mainW * scale) + (1 * unit * scale) + (subW * scale) / 2;
                        app.utils.text(ctx, subVal, subX, mainY + (mainFS - subFS) * 0.45, subFS, "#FFFFFF", "RoadGen-B");
                    }
                }
            }
        }
    }
};