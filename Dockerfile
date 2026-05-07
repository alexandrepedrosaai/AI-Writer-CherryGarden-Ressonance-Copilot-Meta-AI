# Stage 1: Build Rust Core
FROM rust:1.94-slim-bookworm AS rust-builder
WORKDIR /app/rust-core
COPY rust-core/ .
RUN cargo build --release

# Stage 2: Build Node.js Frontend and Backend
FROM node:26-bookworm-slim AS node-builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build frontend and backend
RUN pnpm run build

# Stage 3: Final Image
FROM node:26-bookworm-slim
WORKDIR /app

# Install pnpm for production if needed
RUN npm install -g pnpm@10.4.1

# Copy built assets from node-builder
COPY --from=node-builder /app/dist ./dist
COPY --from=node-builder /app/package.json ./package.json
COPY --from=node-builder /app/node_modules ./node_modules

# Copy built rust binary from rust-builder
COPY --from=rust-builder /app/rust-core/target/release/ai_writer_cherrygarden_ressonance_v2 ./rust-core-bin

# Set Environment Variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
