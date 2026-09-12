---
title: "Linux 简单操作"
date: 2018-04-14T16:21:28+08:00
slug: "learn-linux1"
aliases: ["/2018/04/14/linux-简单操作/"]
categories: ["xcracker"]
tags: ["centos", "linux", "learn"]
summary: "第一天的 CentOS Linux 课程笔记。"
draft: false
---
# linux简单操作

## 修改ip地址

    vi /etc/sysconfig/network-script/ifcfg-ens33
    BOOTPROTO="none"    #修改网卡为静态获取ip地址模式
    IPADDR0=172.25.1.101    #网卡ip地址
    #NETMASK0=255.255.255.0     #子网掩码
    PREFIX0=24      #与上面二选一
    GATEWAY0=172.25.1.2     #网关
    DNS1=114.114.114.114       #首选DNS
    DNS2=119.29.29.29

## 修改主机名

    hostnamectl set-hostname [主机名]

## 安装软件

    yum -y install [软件1 | 软件2 ……]


Column A | Column B | Column C
---------|----------|---------
 A1 | B1 | C1
 A2 | B2 | C2
 A3 | B3 | C3

 ![avatar](https://wx3.sinaimg.cn/crop.144.178.984.554/90eb2137ly1fqc1n709iyj20xc0m80ve.jpg)
