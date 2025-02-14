# Mixify API

This backend is a NestJS application designed to provide APIs for your project. It is open source and open to contributions. You will need to deploy the app by yourself, as we do not provide hosting.

The frontend is available here: https://github.com/Latte-Corporation/Mixify

## How to Deploy It

### The Easy Way

You will need:

- git
- nodejs
- pnpm

```sh
git clone git@github.com:Latte-Corporation/Mixify-api.git
cd mixify-api
pnpm install
pnpm start
```

### The Cloud Way

A Helm chart is available in the `helm` folder. You can deploy it with:

```sh
helm install mixify-api ./helm
```

### With Docker

You can also build a Docker image with:

```sh
docker build -t mixify-api .
docker run -p 3333:3333 mybackend
```

## How to Contribute

You can contribute by submitting a pull request. We will review it and merge it if it fits the project. You can also open an issue if you have a feature request or a bug to report.

Contact: contact@lattecorp.dev
