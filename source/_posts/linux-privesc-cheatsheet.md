---
title: Linux Privilege Escalation Cheatsheet
date: 2026-08-08 06:10:00
categories: Cheatsheets
tags:
  - linux
  - privesc
---

Quick reference commands — replace/expand with your own notes.

```bash
# SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Sudo rights
sudo -l

# Cron jobs
cat /etc/crontab

# Kernel version
uname -a
```
