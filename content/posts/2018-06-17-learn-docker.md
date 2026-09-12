---
title: "Docker 学习笔记"
date: 2018-06-17T15:33:52+08:00
slug: "learn-docker"
aliases: ["/2018/06/17/docker-学习笔记/"]
categories: ["docker"]
tags: ["docker"]
summary: "从 CentOS 7 开始学习 Docker 的实践笔记。"
draft: false
---
# docker 基础学习

    docker由docker server和dockerclient组成
    dockre有三大组件：
        镜像（image）
        容器（container）   #容器和操作系统是相互隔离的，容器彼此之间也是相互隔离的
        仓库（repository）

## 1 在centos 7 上安装docker（学习环境为centos 7，暂时不讨论其他方法安装docker）

### 1.1 Docker 要求 CentOS 系统的内核版本高于 3.10 ，查看本页面的前提条件来验证你的

CentOS 版本是否支持 Docker 。
通过 uname -r 命令查看你当前的内核版本

    # uname -r

### 1.2 使用 root 权限登录 Centos。确保 yum 包更新到最新。

    # yum update

### 1.3 卸载旧版本

    # yum remove docker  docker-common docker-selinux docker-engine

### 1.4 安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的

    # yum install -y yum-utils device-mapper-persistent-data lvm2

### 1.5 设置yum源

    # yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

### 1.6 可以查看所有仓库中所有docker版本，并选择特定版本安装

    # yum list docker-ce --showduplicates | sort -r

###  1.7 安装docker

    # yum install docker-ce  #由于repo中默认只开启stable仓库，故这里安装的是最新稳定版
    # yum install <FQPN>  # 例如：sudo yum install docker-ce-17.12.0.ce

### 1.8 启动并加入开机启动

    # systemctl start docker
    # systemctl enable docker

### 1.9 验证docker版本

    # docker version

## 2 使用镜像

镜像是docker的三大组件之一,docker运行之前需要本地存在对应的镜像，如果镜像不存在本地，docker会从镜像仓库下载（默认是从docker hub公众注册服务器中的仓库）。

### 2.1 从 Docker Registry 获取镜像的命令是  docker pull  。其命令格式为：

    # docker pull [选项] [Docker Registry地址]<仓库名>:<标签>
    # docker pull ubuntu:14.04 #这时候会从docker hub中下载此镜像到本地

## 运行容器

    # docker run -it --rm ubuntu:14.04 bash

run指的是运行一个容器
-i 指的是交互式操作
-t 指的是 终端
--rm指的是容器退出后随之将其删除
容器运行的基础是ubuntu:14.04系统，运行后进入`bash`执行一些命令查看结果
