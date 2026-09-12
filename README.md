# 逍遥域

这是木子逍遥的个人博客，使用 [Hugo](https://gohugo.io/) 构建，采用 [Blowfish](https://github.com/nunocoracao/blowfish) 主题，并通过 Git submodule 引入官方主题。

## 本地运行

需要 Hugo Extended（主题当前建议使用 0.162–0.165）和 Go：

```bash
git submodule update --init --recursive
hugo server -D
```

打开 <http://localhost:1313/> 预览。

## 发布

推送到 `master` 后，`.github/workflows/hugo.yml` 会自动构建并发布到 GitHub Pages。自定义域名保存在 `CNAME` 中。

文章放在 `content/posts/`，草稿放在 `content/drafts/`；发布草稿时使用 `hugo -D`。

微博动态放在 `content/weibo/`，每个 Markdown 文件就是一条动态。可以用下面的命令创建新动态：

```bash
hugo new weibo/今天的想法.md
```

## 主题与定制

- 主题配置：`config/_default/params.toml`
- 导航配置：`config/_default/menus.zh-cn.toml`
- 自定义样式：`assets/css/custom.css`
- 主题版本：`themes/blowfish` submodule（跟踪 Blowfish `main` 分支）
