FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Copy package-lock.json if it exists
COPY package-lock.json* ./

# Install dependencies
RUN npm install

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]
