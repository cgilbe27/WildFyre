FROM node:10.4 AS builder

WORKDIR /src
ADD . /src

RUN npm install \
  && node_modules/.bin/ng build --prod


FROM nginx:1.15-alpine

ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/dist /usr/share/nginx/html
