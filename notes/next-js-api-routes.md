---
draft: false
publish: true
aliases:
  - Using Next.js API routes
description: Next.JS comes with a useful feature out of the box, api routes. Files created in the `pages/api/` folder are treated as an endpoint rather than a page. Instead of exporting a React component to display your UI, you can export a function returning, say, a JSON response.
date: 2020-12-03
updated: 2025-02-09
tags:
  - tools/nextjs
  - snippets
  - post
  - language/javascript
up: 
jump: 
down: 
banner-alt: Map of computers
banner: https://images.pexels.com/photos/4578665/pexels-photo-4578665.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260
---

## Table of contents

## Usage

> Next has mostly moved on to the [App Router](https://nextjs.org/docs/app). Please check out [the docs](https://nextjs.org/docs/app) for the most up-to-date way to fetch data.
> When I build an App Router site, I'll update the docs.
>
> If you're still using the [Pages router](https://nextjs.org/docs/pages), most of this still applies. Checkout the docs:
> https://nextjs.org/docs/pages/building-your-application/routing/api-routes

Next.JS comes with a useful feature out of the box, api routes. Files created in the `pages/api/` folder are treated as an endpoint rather than a page. Instead of exporting a React component to display your UI, you can export a function returning, say, a JSON response.

For example, if you wanted to return a post from your CMS, you could write the following in file `pages/api/post.js` :

```js
/**
 * NextJS API function
 * https://nextjs.org/docs/api-routes/introduction)
 */
export default (request, response) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ title: 'My Post' }))
}
```

If we wanted to handle multiple methods in a single route, we could check the method property from the request object.

```js
export default (req, res) => {
  switch (req.method) {
    case 'GET':
      // process GET requests
      break

    case 'POST':
      // process POST requests
      break

    default:
      res.status(405).end() //Method Not Allowed

      // process every other method
      break
  }
}
```

API Routes also support Next.JS [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes) and can be used used to pass a query to our routes.

For example, if we wanted to fetch our posts based on their `uid`, we could write the following in the file `pages/api/post/uid].js`

```js
export default async (req, res) => {
  // use the uid from the reauest's query to fetch our post from our CMS
  const post = await fetchPostFromCMS(req.query.uid)

  res.statusCode = 200
  res.end(JSON.stringify(post))
}
```

## Bonus

One great use for API functions is creating a sitemap for your Next.JS project. The function below is the very same code for our old website.

```tsx
import { NextApiRequest, NextApiResponse } from 'next'
import { SitemapStream, streamToPromise } from 'sitemap'
import posts from '../posts/post-index'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const smStream = new SitemapStream({
      hostname: `https://${req.headers.host}`
    })

    // Create URL row for each static page
    staticPages.forEach((page) => {
      smStream.write({
        changefreq: 'monthly',
        priority: 0.5,
        ...page
      })
    })

    // Create URL row for each post
    Object.entries(posts).forEach(([name, metadata]) => {
      smStream.write({
        title: name,
        url: `/posts/${metadata.slug}`,
        changefreq: 'weekly',
        priority: 0.9
      })
    })

    // End sitemap stream
    smStream.end()

    // XML sitemap string
    const sitemapOutput = (await streamToPromise(smStream)).toString()

    // Change headers
    res.writeHead(200, {
      'Content-Type': 'application/xml'
    })

    res.end(sitemapOutput)
  } catch (e) {
    res.send(JSON.stringify(e))
  }
}
```
