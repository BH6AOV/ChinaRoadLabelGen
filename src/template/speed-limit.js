/**
 * 模版：限速类标识绘制逻辑 (禁 39, 禁 40, 示 14)
 * 依据 GB 5768.2-2022 标准制作图例 E.39, E.41, E.63
 */
window.SpeedLimitTemplates = {
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
            return `<circle cx="${cx}" cy="${cy}" r="${total/2}" fill="white" /><circle cx="${cx}" cy="${cy}" r="${D/2}" fill="${app.colors.red}" /><circle cx="${cx}" cy="${cy}" r="${D/2-a}" fill="white" /><text x="${cx}" y="${cy+D*0.025}" font-family="RoadGen-A" font-size="${h}" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${params.speed}</text>`;
        }
    },
    release: {
        name: "解除限速标识 (禁 40)",
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
            return `<circle cx="${cx}" cy="${cy}" r="${total/2}" fill="white" /><circle cx="${cx}" cy="${cy}" r="${D/2-a/2}" fill="none" stroke="black" stroke-width="${a}" /><text x="${cx}" y="${cy+D*0.025}" font-family="RoadGen-A" font-size="${h}" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${params.speed}</text>`;
        }
    },
    minimum: {
        name: "最低限速标识 (示 14)",
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

            app.utils.text(ctx, speedText, cx, cy - D * 0.06, finalH, app.colors.white, "RoadGen-A");
        },
        toSVG: (params, app) => {
            const D = app.baseSize; const h = D * (700 / 1200);
            const total = D + (D * (2/120)); const cx = total/2; const cy = total/2;
            return `<circle cx="${cx}" cy="${cy}" r="${total/2}" fill="white" /><circle cx="${cx}" cy="${cy}" r="${D/2}" fill="${app.colors.blue}" /><text x="${cx}" y="${cy-D*0.06}" font-family="RoadGen-A" font-size="${h}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${params.speed}</text>`;
        }
    }
};