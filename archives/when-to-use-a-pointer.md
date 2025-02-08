---
draft: 
publish: true
aliases:
  - when-to-use-a-pointer
date: 2024-11-22
updated: 2024-11-23
tags:
  - snippets
  - language/go
media_link: https://www.youtube.com/watch?v=3WsEDZRif6U
id: 1730609299-when-to-use-a-pointer
---

1. Updating State
2. Optimize memory for large object that are getting called A LOT

## Passing by Reference vs Value

   Objects passed by value in a function are COPIED for the lifetime of the function. Any changes made inside the function do not apply to the object that was passed in.

```go
struct Apple {
	Bites int
}

func biteApple(a Apple) {
	a.Bites += 1
}

demo := Apple{Bites: 0}
biteApple(demo)

fmt.Println(demo.bites)
```

What's printed?

```txt
0
```

This tripped me up for a minute. Remember…

> Objects passed by value in a function are COPIED for the lifetime of the function. Any changes made inside the function do not apply to the object that was passed in.

So what's the fix? "use a pointer" to pass the value by _reference_ instead of by _value_.

```go
func biteApple(a *Apple) { // Notice the `*`?
	a.Bites += 1
}

/// ----

struct Apple {
	Bites int
}

func biteApple(a Apple) {
	a.Bites += 1
}

demo := Apple{Bites: 0}
biteApple(demo)

fmt.Println(demo.bites)
```

What's printed?

```txt
1
```
