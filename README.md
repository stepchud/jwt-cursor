# JWT Cursor

A JWT decoder for React Native with TypeScript.

## Development with Nix

This project includes a Nix flake for reproducible development environments.

### Prerequisites

- [Nix](https://nixos.org/download.html) with flakes enabled
- [direnv](https://direnv.net/) (optional, for automatic environment activation)

### Quick Start

1. **Enter the development shell:**
   ```bash
   nix develop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

### Available Commands

The Nix flake provides several convenient commands:

- **Build the project:**
  ```bash
  nix run .#build
  ```

- **Run tests:**
  ```bash
  nix run .#test
  ```

- **Start development mode:**
  ```bash
  nix run .#dev
  ```

### Development Shell Features

When you enter the development shell with `nix develop`, you get:

- **Node.js 20** with npm
- **TypeScript** compiler and tools
- **Jest** for testing
- **Git** for version control
- **Development utilities** (curl, jq, etc.)

### Using direnv (Optional)

If you have direnv installed, the development environment will automatically activate when you enter the project directory:

```bash
cd jwt-cursor
# Environment automatically activates
npm install
npm run build
```

### Building the Package

To build the package using Nix:

```bash
nix build
```

This creates a `result` directory with the built package.

## Manual Development (without Nix)

If you prefer not to use Nix, you can still develop normally:

```bash
npm install
npm run build
npm test
```

## Usage

```typescript
import { JWTDecoder, jwtDecode, jwtValidate } from 'jwt-cursor';

// Using the class
const decoder = new JWTDecoder();
const result = decoder.decodeAndValidate(token);

// Using convenience functions
const payload = jwtDecode(token);
const isValid = jwtValidate(token);
const isExpired = jwtIsExpired(token);
```

## License

MIT 