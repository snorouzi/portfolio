FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite embeds these public values into the client bundle at build time.
ARG VITE_APP_NAME
ARG VITE_APP_URL
ENV VITE_APP_NAME=${VITE_APP_NAME} \
    VITE_APP_URL=${VITE_APP_URL}

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
