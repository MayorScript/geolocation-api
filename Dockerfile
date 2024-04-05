FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/app

# Install Yarn at the system level.
RUN yarn --version || npm install -g yarn


# Copy application dependency manifests to the container image.
COPY package.json yarn.lock ./

# Install production dependencies.
RUN yarn install --frozen-lockfile

# Copy local code to the container image.
COPY . .

# Build the application
RUN yarn build

# # Run the web service on container startup.
CMD [ "node", "dist/index.js" ]
