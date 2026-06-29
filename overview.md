# 开发服务启动脚本

本项目提供三种启动脚本，均位于 `E:\Projects\Games\mario` 目录下。

## 脚本清单

### 1. start-dev.bat（推荐 Windows 用户双击使用）

- 启动方式：双击文件或在 CMD 中运行 `start-dev.bat`
- 编码处理：文件保存为 UTF-8，开头执行 `chcp 65001` 将 CMD 代码页切换到 UTF-8，避免中文乱码
- 作用：进入项目目录并执行 `npm run dev`

### 2. start-dev.ps1（PowerShell 用户使用）

- 启动方式：在 PowerShell 中执行 ` .\start-dev.ps1`
- 编码处理：文件保存为 UTF-8，脚本内设置 `[Console]::OutputEncoding` 和 `$OutputEncoding` 为 UTF-8，确保中文正常显示
- 作用：进入项目目录并执行 `npm run dev`

### 3. start-dev.sh（Git Bash / WSL 用户使用）

- 启动方式：在 Git Bash 中执行 `./start-dev.sh`
- 编码处理：文件保存为 UTF-8，Git Bash 默认使用 UTF-8，中文正常显示
- 作用：进入项目目录并执行 `npm run dev`

## 编码问题说明

Windows 下 CMD 默认使用 GBK（代码页 936），直接运行 UTF-8 编码的批处理文件会出现中文乱码。`start-dev.bat` 通过 `chcp 65001` 在运行时切换到 UTF-8 代码页，从而正确显示中文提示。

PowerShell 5.1 默认编码为 GBK，脚本中显式设置输出编码为 UTF-8，避免乱码。

## 手动启动

如果不想使用脚本，也可以在项目根目录执行：

```bash
cd "E:\Projects\Games\mario"
npm run dev
```
