# Seminar M3L20: Node.js в Docker (16.08.24)

[Docker and Node.js Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

```
docker pull <image> - скачать образ
docker push <image> - отправить образ в docker hub
docker run <image> - запустить образ
docker run -it <image> - запустить образ в интерактивном режиме (чтобы можно было отправлять в него команды)
docker run -p 3001:3001 <image> - запустить образ, опубликовав его на 3001 порту
docker system prune -f - очистить БД докера (-fa чтобы вычистить все, что не запущено)
docker ps - посмотреть запущенные контейнеры
docker image ls - посмотреть все образы
docker inspect <image> - изучить образ (размер и тд)
```

Стоит разделять **build** на stages:

```docker
FROM node:alpine
WORKDIR /usr/src/app

# Не очевидно, что копируем + подтянется кэш
# COPY ./ ./

# package.json + package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# билд проекта
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# чистим dev зависимости
RUN npm prune

# BEST PRACTICE не запускать через npm run из-за того, что пораждается лишний процесс npm
CMD ["node", "./build/index.js"]
```

В билд можно пробросить ARGS

## MULTI STAGE

Используется для оптимизации сборки образов. Каждый слой занимает дополнительное место на диске.

Подход многоэтапных сборок дает возможность включить в конечный образ только результат собранной проги на основе предыдущих слоев.

- Сначала выполняем сборку
- В результирующий образ передаем собранную программу и инструкцию ее выполнения

```docker
FROM node:alpine as build-stage
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# чистим dev зависимости
RUN npm prune

FROM node:alpine as run-stage
WORKDIR /usr/src/app

RUN chown node:node ./
COPY --chown=node:node --from=build-stage /usr/src/app .

USER node

CMD ["node", "./build/index.js"]
```
