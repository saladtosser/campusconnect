FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy project
COPY . .

# Build for production
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Run server
CMD ["serve", "-s", "build", "-l", "3000"] 