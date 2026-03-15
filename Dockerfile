# Use Node.js 22 which supports TypeScript type stripping natively
FROM node:22-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the Vite frontend
RUN npm run build

# Expose the port (Cloud Run uses PORT env var, default to 8080 or 3000)
EXPOSE 3000

# Start the server
# Note: server.ts uses process.env.PORT || 3000
CMD ["node", "--experimental-strip-types", "server.ts"]
