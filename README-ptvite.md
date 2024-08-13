# PhiTogether

[服务状态 / Status Page](https://status.phitogether.fun)

将多人游戏与Phigros玩法结合起来！一个基于Phigros玩法的非盈利性开源社区游戏。集成PhiZone。

## 👍 支持我们的持续运行

[Team PhiTogether 的爱发电](https://afdian.net/a/PhiTogether)

## 🚀 部署自己的 PhiTogether 实例

**仅使用 Linux 进行基础部署示范。**

1. 下载此存储库到生产环境

   ```bash
   git clone https://github.com/Team-PhiTogether/PhiTogether && cd PhiTogether
   ```

1. 安装环境、编译后端

   - 参考：[在你的操作系统上安装 Go 环境](https://golang.google.cn/doc/install)

   安装完成后执行

   ```bash
   go build main.go
   ```

1. 新建文件 `config.json` 进行以下配置 (配置完后需删除注释)

   ```jsonc
   {
       // type: "master", "slave"
       // 主机或从节点模式
       "type":"master",
       // max: interger
       // 节点最大房间数量
       "max":100,
       // addr: url(string)
       // 可以直接访问到该节点的https网址
       "addr":"localhost",
       // port: interger
       // 服务器端口号
       "port":"8081",
       // priority: interger
       // 服务器优先级
       "priority":999998,
       // key: string
       // 服务器 key，要和主机的 key 一致
       "key":"abcdefg1234567"
   }
   ```

1. 运行

   ```bash
   ./main
   ```

## 📃 许可证 LICENSE

源代码(不包括多媒体资源)在[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)许可下分发。

<details>
<summary>简要概述AGPL-3.0协议内容</summary>

- GNU Affero 通用公共许可证 v3.0

   这种最强大的 Copyleft 许可的许可取决于提供许可作品和修改的完整源代码，其中包括在同一许可下使用许可作品的大型作品。 必须保留版权和许可声明。 贡献者明确授予专利权。 当修改版本用于通过网络提供服务时，必须提供修改版本的完整源代码。

   您获得的权限:

  - 商业用途
  - 修改
  - 分发
  - 专利使用
  - 私人使用

   您将被此许可证限制:

  - 责任
  - 保障

   再创作所需的条件:

  - 包含许可和版权声明
  - 标明修改的内容
  - 同样保持开源
  - 作为网络服务使用视为分发
  - 使用相同的许可证(AGPL-3.0)

</details>

对于多媒体资源，我们保留著作权。

> 对于`多媒体资源`的定义
>
> 包括但不限于拓展名包含 `ogg`、`mp3`、`aac`、`wav`、`jp(e)g`、`png`、`svg`、`sketch`、`zip`、`au3`、`aup3-shm`、`aup3-wal`、`flp` 字段的文件。
>
> 包括但不限于文件头标识包含 `ogg`、`mp3`、`aac`、`wav`、`jp(e)g`、`png`、`svg`、`sketch`、`zip`、`au3`、`aup3-shm`、`aup3-wal`、`flp` 文件头标识特征的文件。

## ⭐ 致谢

- 基于 [lchzh3473/sim-phi](https://github.com/lchzh3473/sim-phi) 。
- 所有[以爱发电等各种形式支持我们](https://afdian.net/a/PhiTogether?tab=sponsor)的玩家。
- 以及屏幕前的你！
