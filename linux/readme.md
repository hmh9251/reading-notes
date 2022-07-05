# ubuntu 虚拟机multipass
```
brew install multipass
```
multipass命令：
```
//预设启动
multipass launch
//设置参数
multipass launch -c 4 -m 512M -d 2G -n My_First_Instance
```
其中
- -c 代表 cpu 數量
- -m 代表記憶體
- 可以用 K, M, G 等單位表示
- 最小值：128M，預設 1G
- -d 代表磁碟空間。
- 可以用 K, M, G 等單位表示
- 最小值：512M，預設 5G
- -n 代表自訂名稱

```
// 列出虚拟机
multipass list
// 查看状态
multipass info test
// 进入shell环境
multipass shell test
// 终止
multipass stop XXX
// 删除
multipass delete XXX
```