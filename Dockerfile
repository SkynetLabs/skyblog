FROM node
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./

CMD ["npm", "start"]

# FROM node as build-step
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH

# COPY package*.json ./
# RUN npm install --silent
# RUN npm install react-scripts@3.4.1 -g --silent


# COPY . ./

# RUN npm run build

# FROM nginx
# COPY --from=build-step /app/build /usr/share/nginx/html
# EXPOSE 80