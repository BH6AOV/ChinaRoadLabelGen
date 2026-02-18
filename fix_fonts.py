from fontTools.ttLib import TTFont
import os

def rebuild_font(font_path):
    print(f"正在深度修复: {font_path}")
    try:
        font = TTFont(font_path)
        
        # 1. 修复 vhea 版本号 (解决 Unsupported table version 0x10001)
        if 'vhea' in font:
            font['vhea'].tableVersion = 0x00010000
            print("  [✓] vhea 表版本已修正为 1.0")
        
        # 2. 修复 post 表 (解决 Bad string 报错)
        if 'post' in font:
            # 强制将 post 表格式设为 3.0 (该格式不包含字符名称字符串，最兼容 Web)
            font['post'].formatType = 3.0
            print("  [✓] post 表格式已修正为 3.0 (丢弃非标准字符串)")
            
        # 3. 移除可能导致解析失败的其他非必要表 (可选)
        for tag in ['VDMX', 'LTSH', 'hdmx']:
            if tag in font:
                del font[tag]
                print(f"  [✓] 已移除冗余表: {tag}")

        # 保存修复后的文件
        font.save(font_path)
        print("  [Success] 修复完成并已覆盖原文件！")
            
    except Exception as e:
        print(f"  [Error] 处理失败: {e}")

# 执行修复
target_fonts = ['./src/fonts/Atype.ttf', './src/fonts/Btype.ttf', './src/fonts/Ctype.ttf']
for path in target_fonts:
    if os.path.exists(path):
        rebuild_font(path)
    else:
        print(f"找不到文件: {path}")