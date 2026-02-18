/**
 * 模版：限速类标识绘制逻辑 (禁 39, 禁 40, 示 14)
 * 依据 GB 5768.2-2022 标准制作图例 E.39, E.41, E.63
 */
window.SpeedLimitTemplates = {
    // 限速标志 (禁 39)
    limit: {
        name: "限速标志 (禁 39)",
        fields: [{ id: 'speed', label: '速度值 (km/h)', type: 'text', default: '60' }],
        draw: (ctx, canvas, params, app) => {
            const D = app.baseSize;
            const a = D * 0.1;
            const c = D * (1 / 120);
            const h = D * (700 / 1200);
            const total = D + 2 * c;

            canvas.width = total; canvas.height = total;
            const cx = total / 2; const cy = total / 2;

            app.utils.circle(ctx, cx, cy, total / 2, app.colors.white);
            app.utils.circle(ctx, cx, cy, D / 2, app.colors.red);
            app.utils.circle(ctx, cx, cy, D / 2 - a, app.colors.white);

            const speedText = params.speed || '60';
            const maxW = (D - 2 * a) * 0.85;
            let finalH = h;
            ctx.font = `bold ${h}px "RoadGen-A"`;
            const metrics = ctx.measureText(speedText);
            if (metrics.width > maxW) finalH = h * (maxW / metrics.width);

            app.utils.text(ctx, speedText, cx, cy + D * 0.025, finalH, app.colors.black, "RoadGen-A");
        },
        toSVG: (params, app) => {
            const D = app.baseSize; const a = D * 0.1; const h = D * (700 / 1200);
            const total = D + (D * (2/120)); const cx = total/2; const cy = total/2;
            const speedText = params.speed || '60';
            let finalH = speedText.length >= 3 ? h * 0.75 : h;
            return `
                <circle cx="${cx}" cy="${cy}" r="${total/2}" fill="white" />
                <circle cx="${cx}" cy="${cy}" r="${D/2}" fill="${app.colors.red}" />
                <circle cx="${cx}" cy="${cy}" r="${D/2 - a}" fill="white" />
                <text x="${cx}" y="${cy + D*0.025}" font-family="RoadGen-A" font-size="${finalH}" font-weight="bold" fill="black" text-anchor="middle" dominant-baseline="middle">${speedText}</text>
            `;
        }
    },
    // 解除限速标志 (禁 40)
    release: {
        name: "解除限速 (禁 40)",
        fields: [{ id: 'speed', label: '速度值 (km/h)', type: 'text', default: '60' }],
        draw: (ctx, canvas, params, app) => {
            const D = app.baseSize;
            const a = D * 0.1;
            const c = D * (1 / 120);
            const h = D * (700 / 1200);
            const total = D + 2 * c;

            canvas.width = total; canvas.height = total;
            const cx = total / 2; const cy = total / 2;

            app.utils.circle(ctx, cx, cy, total / 2, app.colors.white);
            app.utils.circleOutline(ctx, cx, cy, D/2 - a/2, a, app.colors.black);
            
            const speedText = params.speed || '60';
            const maxW = (D - 2 * a) * 0.85;
            let finalH = h;
            ctx.font = `bold ${h}px "RoadGen-A"`;
            const metrics = ctx.measureText(speedText);
            if (metrics.width > maxW) finalH = h * (maxW / metrics.width);

            app.utils.text(ctx, speedText, cx, cy + D * 0.025, finalH, app.colors.black, "RoadGen-A");
            app.utils.drawStrikes(ctx, cx, cy, D/2);
        },
        toSVG: (params, app) => {
            const D = app.baseSize; const a = D * 0.1; const h = D * (700 / 1200);
            const total = D + (D * (2/120)); const cx = total/2; const cy = total/2;
            const speedText = params.speed || '60';
            const strikeW = D * 0.015;
            let lines = "";
            for(let i = -2; i <= 2; i++) {
                const offset = i * (D * 0.05);
                lines += `<line x1="${cx - D}" y1="${cy + D + offset}" x2="${cx + D}" y2="${cy - D + offset}" stroke="black" stroke-width="${strikeW}" />`;
            }
            return `
                <circle cx="${cx}" cy="${cy}" r="${total/2}" fill="white" />
                <circle cx="${cx}" cy="${cy}" r="${D/2 - a/2}" fill="none" stroke="black" stroke-width="${a}" />
                <g clip-path="url(#signClip)">
                    <defs><clipPath id="signClip"><circle cx="${cx}" cy="${cy}" r="${D/2}" /></clipPath></defs>
                    ${lines}
                </g>
                <text x="${cx}" y="${cy + D*0.025}" font-family="RoadGen-A" font-size="${speedText.length>=3?h*0.75:h}" font-weight="bold" fill="black" text-anchor="middle" dominant-baseline="middle">${speedText}</text>
            `;
        }
    },
    // 最低限速标志 (示 14)
    minimum: {
        name: "最低限速 (示 14)",
        fields: [{ id: 'speed', label: '速度值 (km/h)', type: 'text', default: '60' }],
        draw: (ctx, canvas, params, app) => {
            const D = app.baseSize;
            const c = D * (1 / 120);
            const h = D * (700 / 1200);
            const total = D + 2 * c;

            canvas.width = total; canvas.height = total;
            const cx = total / 2; const cy = total / 2;

            app.utils.circle(ctx, cx, cy, total / 2, app.colors.white);
            app.utils.circle(ctx, cx, cy, D / 2, app.colors.blue);

            // 修正：提升白色截面高度。使用 1/6 pi (30度) 到 5/6 pi (150度)
            // 此时弦的高度正好在半径的中点位置 (sin(30)=0.5)
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, D / 2, (1/6) * Math.PI, (5/6) * Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = app.colors.white;
            ctx.fill();
            ctx.restore();

            const speedText = params.speed || '60';
            const maxW = D * 0.8;
            let finalH = h;
            ctx.font = `bold ${h}px "RoadGen-A"`;
            const metrics = ctx.measureText(speedText);
            if (metrics.width > maxW) finalH = h * (maxW / metrics.width);

            // 视觉修正：由于截面抬高，文字中心需同步上移以保持在蓝色区域视觉中心
            app.utils.text(ctx, speedText, cx, cy - D * 0.06, finalH, app.colors.white, "RoadGen-A");
        },
        toSVG: (params, app) => {
            const D = app.baseSize; const h = D * (700 / 1200);
            const total = D + (D * (2/120)); const cx = total/2; const cy = total/2;
            const speedText = params.speed || '60';
            // 计算 30 度角的弦坐标
            const startX = cx + D/2 * Math.cos((1/6)*Math.PI);
            const startY = cy + D/2 * Math.sin((1/6)*Math.PI);
            const endX = cx + D/2 * Math.cos((5/6)*Math.PI);
            const endY = cy + D/2 * Math.sin((5/6)*Math.PI);
            
            return `
                <circle cx="${cx}" cy="${cy}" r="${total/2}" fill="white" />
                <circle cx="${cx}" cy="${cy}" r="${D/2}" fill="${app.colors.blue}" />
                <path d="M ${startX} ${startY} A ${D/2} ${D/2} 0 0 1 ${endX} ${endY} Z" fill="white" />
                <text x="${cx}" y="${cy - D*0.06}" font-family="RoadGen-A" font-size="${speedText.length>=3?h*0.75:h}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${speedText}</text>
            `;
        }
    }
};