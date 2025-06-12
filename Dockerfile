# 1. Use official Node image
FROM node:22-slim AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy only package files first (for caching dependencies)
COPY package.json package-lock.json* ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your app code
COPY . .

# 6. Build the Next.js app
RUN npm run build

# 7. Serve the app using a lightweight container
FROM node:22-slim AS runner

WORKDIR /app

# Only copy the production build
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
# COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Only install runtime deps
COPY package-lock.json ./
RUN npm ci --omit=dev

# Expose the port Next.js will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]