FROM node:17-alpine

WORKDIR /app

ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG KEYCLOAK_REALM
ARG MAPBOX_TOKEN
ARG MAPBOX_STYLE_URL
ARG GUI_SERVER_URL
ARG AUTH_SERVER_URL
ARG API_SERVER_URL
ARG API_WS_URL

ENV NEXTAUTH_SECRET ${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL ${NEXTAUTH_URL}
ENV KEYCLOAK_CLIENT_ID ${KEYCLOAK_CLIENT_ID}
ENV KEYCLOAK_CLIENT_SECRET ${KEYCLOAK_CLIENT_SECRET}
ENV KEYCLOAK_REALM ${KEYCLOAK_REALM}
ENV MAPBOX_TOKEN ${MAPBOX_TOKEN}
ENV MAPBOX_STYLE_URL ${MAPBOX_STYLE_URL}
ENV GUI_SERVER_URL ${GUI_SERVER_URL}
ENV AUTH_SERVER_URL ${AUTH_SERVER_URL}
ENV API_SERVER_URL ${API_SERVER_URL}
ENV API_WS_URL ${API_WS_URL}

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]