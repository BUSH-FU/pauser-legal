# Pauser · Online Legal

Pauser iOS app 的用户协议、隐私政策与技术支持页面,部署到 `chongshanai.com/pauser/`
(由 宠膳 AI 的 nginx 站点 `chongshanai.com` 子路径托管)。

四个 HTML 页面均为**中英双语**,通过 `assets/i18n.js` 按浏览器 `navigator.language`
自动选择默认语言,顶部 `EN` / `中文` 按钮可手动切换,选择会记到 `localStorage`。
海外用户默认看到英文,国内用户默认看到中文。

## 文件

- `index.html` — 入口页(两个卡片,中英双语)
- `marketing.html` — 营销主页 / Landing page(对应 App Store Connect 的"营销 URL")
- `terms.html` — 用户协议 / Terms of Service
- `privacy.html` — 隐私政策 / Privacy Policy
- `support.html` — 技术支持 / Support(FAQ + 联系邮箱)
- `assets/pauser-icon.png` — Pauser app icon (1024×1024)
- `assets/favicon-32.png` — 浏览器 tab 图标
- `assets/apple-touch-icon.png` — 添加到主屏幕图标
- `assets/style.css` — 文档样式
- `assets/i18n.js` — 双语切换脚本(自包含,不依赖改 style.css)
- `assets/screens/*.jpg` — 营销页用的 6 张 App Store 上架图(resize 到 1200px 宽)

## 部署

手动 rsync 到 `miaoxiaodi` 服务器(ubuntu@82.157.76.177)的
`/opt/chongshanai/static/web/pauser/`,nginx 会自动从该路径
serve 出 `chongshanai.com/pauser/*`。

```sh
rsync -avz --delete \
  "/Users/bush/Desktop/Live in Life/创业实践/Pauser/pauser-online-legal/" \
  ubuntu@82.157.76.177:/opt/chongshanai/static/web/pauser/
```

部署到 ra:
```
✅ https://chongshanai.com/pauser/             (index, 双语)
✅ https://chongshanai.com/pauser/marketing.html (双语, 6 张 app 截图)
✅ https://chongshanai.com/pauser/terms.html   (双语)
✅ https://chongshanai.com/pauser/privacy.html (双语)
✅ https://chongshanai.com/pauser/support.html (双语)
```

## App Store Connect 4 个 URL 字段填法

| ASC 字段 | URL | 备注 |
|---|---|---|
| 隐私政策 URL(必填) | `https://chongshanai.com/pauser/privacy.html` | Privacy Policy 专页 |
| 技术支持 URL(必填) | `https://chongshanai.com/pauser/support.html` | FAQ + 联系邮箱 |
| 营销 URL(可选) | `https://chongshanai.com/pauser/marketing.html` | Pauser 主页:hook + 6 张 app 截图 + Pro 价格 |
| EULA | Apple Standard EULA | 不维护自己的 EULA |

## 与 iOS app 的对应

- `PauserPaywallView.termsFooter` 的 Link 指向 `terms.html` + `privacy.html`
- tab3 `legalSection`(Settings → 法律)也指向 `terms.html` / `privacy.html`
- 改完后 Pauser iOS app 不再依赖任何 GitHub Pages

## 旧位置

之前短暂在 `https://bush-fu.github.io/pauser-legal/` 也部署过。实线是
GitHub Pages 公开仓,可作为 fallback,但 iOS app 已切换到 chongshanai.com。

## 双语切换行为(看代码)

每个 HTML 在 head 里 `<script src="assets/i18n.js" defer></script>`,正文
每个段落 / 标题都被 `<span data-lang-show="zh">…</span>` + `<span
data-lang-show="en">…</span>` 包裹。脚本根据 `localStorage` →
`navigator.language` → 默认 `zh` 的优先级决定初始语言,通过
`<html data-lang="zh|en">` 上的 CSS 规则隐藏非活动语言。`<title>`
和 `<meta name="description">` 加 `data-zh` / `data-en` 属性后,
脚本会在切换时同步更新这两个标签的内容。

样式由 i18n.js 注入到 `<head>` 的 inline `<style>` 里,**不需要改
style.css**,Toggle 按钮直接拿到 `.lang-toggle` 类即可用。