FROM node:12.6 as build-deps
WORKDIR /usr/src/weather
COPY ./ ./
RUN npm install && npm run build

FROM nginx:1.16.0-alpine
COPY --from=build-deps /usr/src/weather/build /usr/share/nginx/html
# TODO: Add proxy to API
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]