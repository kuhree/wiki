---
draft: 
publish: true
aliases: []
date: 2024-11-24
updated: 2025-02-09
tags:
  - tools/flyio
up: 
jump: 
down: 
---

## Launch an app

```bash
fly launch
```

## Deploy an app

```bash
fly deploy

fly deploy --local-only # to only build on the local machine
```

## Secrets

> Secrets are stored in an encrypted vault. When you set a secret through flyctl, it sends the secret value through our API, which writes to the vault for your specific Fly App. The API servers can only encrypt; they cannot decrypt secret values. Secret values are never logged.
>
> When we launch a Machine for your app, we issue a temporary auth token to the host it runs on. The Fly.io agent on the host uses this token to decrypt your app secrets and inject them into your Machine as environment variables at boot time. When you destroy your Machines, the host environment no longer has access to your app secrets.
> -- [Secrets and Fly Apps · Fly Docs](https://fly.io/docs/apps/secrets/)

### Set a secret

```bash
fly secrets set DATABASE_URL=...
```

### List a secret

```bash
fly secrets list
```

### Remove secrets

```txt
fly secrets unset MY_SECRET DATABASE_URL
```

## CI

> - Run `fly launch --no-deploy` from within the project source directory to create a new app and a `fly.toml` configuration file.
> - Type `y` to when prompted to tweak settings and enter a name for the app. Adjust other settings, such as region, as needed. Then click **Confirm Settings**.
> - Still in the project source directory, get a Fly API deploy token by running `fly tokens create deploy -x 999999h`. Copy the output, including the `FlyV1` and space at the beginning.
> - Go to your newly-created repository on GitHub and select **Settings**.
> - Under **Secrets and variables**, select **Actions**, and then create a new repository secret called `FLY_API_TOKEN` with the value of the token from step 5.
> - Back in your project source directory, create `.github/workflows/fly.yml` with these contents:
-- [Continuous Deployment with Fly.io and GitHub Actions · Fly Docs](https://fly.io/docs/launch/continuous-deployment-with-github-actions/)
