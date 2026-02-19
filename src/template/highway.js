/**
 * 模版：高速公路标志库
 * 修复：编号标识无绿框、角标格式修复、名称编号默认值及尺寸自适应
 */
window.HighwayTemplates = {
    // 二级：国家高速
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
                    const mainVal = params.hwyId;
                    const subVal = params.subLabel;
                    
                    // 尺寸自适应：有角标 -> 160宽 (长方形)，无角标 -> 100宽 (正方形)
                    const baseW = (subVal ? 160 : 100) * unit;
                    const baseH = 100 * unit;
                    const r = 12 * unit;
                    
                    canvas.width = baseW;
                    canvas.height = baseH;

                    // 1. 绿底板
                    app.utils.drawRoundedRect(ctx, 0, 0, baseW, baseH, r, app.colors.green);
                    
                    // 2. 红色头部 (y: 0-20, 紧贴顶部)
                    const hH = 20 * unit; 
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(r, 0); ctx.lineTo(baseW - r, 0);
                    ctx.arcTo(baseW, 0, baseW, r, r);
                    ctx.lineTo(baseW, hH); ctx.lineTo(0, hH); ctx.lineTo(0, r);
                    ctx.arcTo(0, 0, r, 0, r);
                    ctx.fillStyle = app.colors.red; ctx.fill();
                    ctx.restore();

                    // 3. 白色衬边 (offset=0.75 紧贴边缘)
                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    const off = 0.75 * unit;
                    app.utils.strokeRoundedRect(ctx, off, off, baseW - 1.5 * unit, baseH - 1.5 * unit, r - off);
                    ctx.restore();

                    // 4. 头部文字 "国家高速" (normal 字重)
                    const headY = 10 * unit;
                    const headSize = 10 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1.5) * 22 * unit;
                        app.utils.text(ctx, char, charX, headY, headSize, "#FFFFFF", "RoadGen-A", "normal");
                    });

                    // 5. 编号与角标排版
                    const boxYCenter = 60 * unit;
                    let mainFS = 70 * unit; 
                    // 角标比例调整：0.6倍
                    let subFS = mainFS * 0.6;
                    let interGap = 2 * unit;

                    ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let totalW = mainW;
                    let subW = 0;

                    if (subVal) {
                        ctx.font = `bold ${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                        totalW += interGap + subW;
                    }

                    // 宽度防溢出缩放
                    const maxW = baseW * 0.88;
                    if (totalW > maxW) {
                        const scale = maxW / totalW;
                        mainFS *= scale; subFS *= scale; 
                        totalW = maxW;
                        // 重新计算缩放后的宽度用于定位
                        ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                        const newMainW = ctx.measureText(mainVal).width;
                        if(subVal) {
                            ctx.font = `bold ${subFS}px "RoadGen-B"`;
                            const newSubW = ctx.measureText(subVal).width;
                            // 更新布局坐标基准
                            var scaledMainW = newMainW;
                            var scaledSubW = newSubW;
                        } else {
                            var scaledMainW = newMainW;
                        }
                    } else {
                        var scaledMainW = mainW;
                        var scaledSubW = subW;
                    }

                    const startX = (baseW - totalW) / 2;
                    // 主编号垂直居中
                    const mainY = boxYCenter + mainFS * 0.05;

                    app.utils.text(ctx, mainVal, startX + scaledMainW / 2, mainY, mainFS, "#FFFFFF", "RoadGen-B", "bold");
                    
                    if (subVal) {
                        const subX = startX + scaledMainW + (interGap * (mainFS/ (70*unit))) + scaledSubW/2;
                        // 关键修复：角标底线对齐。由于 textBaseline='middle'，需向下偏移
                        // 偏移量 = (大字高 - 小字高) / 2
                        const offset = (mainFS - subFS) * 0.40; 
                        app.utils.text(ctx, subVal, subX, mainY + offset, subFS, "#FFFFFF", "RoadGen-B", "bold");
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
                    const nameTxt = params.hwyName;
                    const mainVal = params.hwyId;
                    const subVal = params.subLabel;

                    // 尺寸自适应：有角标或长名称 -> 宽 160，否则 125
                    const isLong = (subVal && subVal.length > 0) || nameTxt.length > 4;
                    const baseW = (isLong ? 160 : 125) * unit;
                    const baseH = 120 * unit;
                    const r = 12 * unit;
                    canvas.width = baseW; canvas.height = baseH;

                    // 1. 底板 (含外绿框，边框中心在 3)
                    app.utils.drawRoundedRect(ctx, 0, 0, baseW, baseH, r, app.colors.green);
                    const bW = 3 * unit;
                    
                    // 2. 红头
                    ctx.save(); ctx.beginPath();
                    ctx.moveTo(r, bW); ctx.lineTo(baseW - r, bW);
                    ctx.arcTo(baseW - bW, bW, baseW - bW, bW + r, r - bW);
                    ctx.lineTo(baseW - bW, bW + 20 * unit); ctx.lineTo(bW, bW + 20 * unit);
                    ctx.lineTo(bW, bW + r); ctx.arcTo(bW, bW, r, bW, r - bW);
                    ctx.fillStyle = app.colors.red; ctx.fill(); ctx.restore();

                    // 3. 衬边
                    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5 * unit;
                    app.utils.strokeRoundedRect(ctx, 3 * unit, 3 * unit, baseW - 6 * unit, baseH - 6 * unit, r - 3 * unit);
                    ctx.restore();

                    // 4. 头文字 (Normal Weight)
                    const headY = 13 * unit;
                    "国家高速".split("").forEach((char, i) => {
                        const charX = (baseW / 2) + (i - 1.5) * 22 * unit;
                        app.utils.text(ctx, char, charX, headY, 10 * unit, "#FFFFFF", "RoadGen-A", "normal");
                    });

                    // 5. 编号区
                    const idY = 53.5 * unit;
                    let mainFS = 55 * unit;
                    let subFS = mainFS * 0.6;
                    
                    ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                    const mWidth = ctx.measureText(mainVal).width;
                    let totalIdW = mWidth;
                    let sWidth = 0;
                    if(subVal) {
                        ctx.font = `bold ${subFS}px "RoadGen-B"`;
                        sWidth = ctx.measureText(subVal).width;
                        totalIdW += 2 * unit + sWidth;
                    }

                    // 缩放
                    const maxIdW = baseW - 30 * unit;
                    let idScale = 1.0;
                    if(totalIdW > maxIdW) {
                        idScale = maxIdW / totalIdW;
                        mainFS *= idScale; subFS *= idScale;
                        totalIdW *= idScale;
                        // update widths
                        var scaledMW = mWidth * idScale;
                        var scaledSW = sWidth * idScale;
                    } else {
                        var scaledMW = mWidth;
                        var scaledSW = sWidth;
                    }

                    const idCenterX = baseW / 2;
                    const idStartX = idCenterX - totalIdW / 2;
                    
                    app.utils.text(ctx, mainVal, idStartX + scaledMW/2, idY + mainFS*0.05, mainFS, "#FFFFFF", "RoadGen-B", "bold");
                    
                    if(subVal) {
                        const subX = idStartX + scaledMW + (2 * unit * idScale) + scaledSW/2;
                        const subOff = (mainFS - subFS) * 0.40;
                        app.utils.text(ctx, subVal, subX, idY + subOff + mainFS*0.05, subFS, "#FFFFFF", "RoadGen-B", "bold");
                    }

                    // 6. 名称区
                    const nameY = 93.5 * unit;
                    const nameFS = 22 * unit;
                    const nameChars = nameTxt.split("");
                    
                    let nameSpacing = 26 * unit;
                    if(isLong) {
                        // 动态计算间距
                        const availableW = baseW - 30 * unit;
                        nameSpacing = availableW / (nameChars.length > 1 ? nameChars.length - 1 : 1);
                        if(nameSpacing > 30 * unit) nameSpacing = 30 * unit;
                    }

                    nameChars.forEach((char, i) => {
                        const charX = (baseW / 2) + (i - (nameChars.length - 1) / 2) * nameSpacing;
                        app.utils.text(ctx, char, charX, nameY, nameFS, "#FFFFFF", "RoadGen-A", "normal");
                    });
                }
            }
        }
    },
    // 省级高速 (逻辑复用国家高速的布局逻辑，颜色不同)
    provincial: {
        name: "省级高速",
        items: {
            id_only: {
                name: "编号标识",
                fields: [
                    { id: 'prov', label: '省份简称', type: 'text', default: '苏' },
                    { id: 'hwyId', label: '高速编号', type: 'text', default: 'S1' },
                    { id: 'subLabel', label: '线路角标', type: 'text', default: '' }
                ],
                draw: (ctx, canvas, params, app) => {
                    // 逻辑同 national.id_only，颜色改为 yellow/black
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
                        app.utils.text(ctx, char, charX, headY, 10 * unit, app.colors.black, "RoadGen-A", "normal");
                    });

                    // 编号逻辑同上
                    let mainFS = 70 * unit; let subFS = mainFS * 0.6; let interGap = 2 * unit;
                    ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                    const mainW = ctx.measureText(mainVal).width;
                    let totalW = mainW; let subW = 0;
                    if(subVal) {
                        ctx.font = `bold ${subFS}px "RoadGen-B"`;
                        subW = ctx.measureText(subVal).width;
                        totalW += interGap + subW;
                    }
                    const maxW = baseW * 0.88;
                    if(totalW > maxW) {
                        const s = maxW / totalW; mainFS *= s; subFS *= s; totalW = maxW;
                        ctx.font = `bold ${mainFS}px "RoadGen-B"`;
                        var smW = ctx.measureText(mainVal).width;
                        if(subVal) { ctx.font = `bold ${subFS}px "RoadGen-B"`; var ssW = ctx.measureText(subVal).width; }
                    } else { var smW = mainW; var ssW = subW; }

                    const startX = (baseW - totalW) / 2;
                    const mainY = 60 * unit + mainFS * 0.05;
                    app.utils.text(ctx, mainVal, startX + smW/2, mainY, mainFS, "#FFFFFF", "RoadGen-B", "bold");
                    if(subVal) {
                        app.utils.text(ctx, subVal, startX + smW + (interGap*(mainFS/(70*unit))) + ssW/2, mainY + (mainFS-subFS)*0.4, subFS, "#FFFFFF", "RoadGen-B", "bold");
                    }
                }
            }
            // 省级 name_id 逻辑省略，结构同 national.name_id
        }
    }
};