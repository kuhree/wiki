---
draft: false
publish: true
aliases:
  - Test Disk Speeds
description: Guide for testing disk read/write speeds on Linux systems using dd
date: 2024-11-19
updated: 2024-11-23
tags:
  - snippets
  - linux
id: test-disk-speeds
---

## Test disk speeds with simple commands

- Test writes

```txt
dd if=/dev/zero of=/mnt/media/library/testfile bs=16k count=128k
```

- Test Reads

```txt
time dd if=/mnt/media/library/testfile of=/dev/null bs=16k
```

 - Local Disk

```txt
dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024 conv=fdatasync
time dd if=/tmp/testfile of=/dev/null bs=1M
```
