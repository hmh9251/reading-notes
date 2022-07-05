# npm 仓库安装
```
docker pull verdaccio/verdaccio:5

docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio

```
## 设置配置文件，启动verdaccio服务
在宿主机路径创建：/verdaccio目录
```
// /verdaccio/conf/config.yaml

storage: ../storage
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    max_users: 20

# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: https://registry.npm.taobao.org

packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $all
    proxy: npmjs

  '*':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    access: $all

    # allow all known users to publish packages
    # (anyone can register by default, remember?)
    publish: $all

    # if package is not aailable locally, proxy requests to 'npmjs' registry
    proxy: npmjs

# log settings
logs:
  - {type: stdout, format: pretty, level: http}
  #- {type: file, path: sinopia.log, level: info}

listen:
  - 0.0.0.0:4873
```

创建htpasswd文件
```
cd /verdaccio/conf
touch htpasswd
```

创建storage和plugins目录
```
cd /verdaccio
mkdir storage
mkdir plugins
```

用docker启动项目
```
// 挂在映射磁盘
ocker run --name verdaccio -d -v /Users/maccintoshhd/verdaccio/conf:/verdaccio/conf  -v /Users/maccintoshhd/verdaccio/storage:/verdaccio/storage -v /Users/maccintoshhd/verdaccio/plugins:/verdaccio/plugins -p 4873:4873 verdaccio/verdaccio:5
```
可以通过 http://localhost:4873/

## npm发布
在对应需要发布的插件目录下

```
// 先初始化项目
npm init
// 注册服务
npm adduser --registry http://localhost:4873
// 如果已经注册过，这里直接登录则
npm login --registry http://localhost:4873
// 之后就可以直接发布项目
npm publish --registry http://localhost:4873
// 可以统一设置
npm config set registry http://localhost:4873 
```
每次publish之前，都需要修改package.json里面的版本号