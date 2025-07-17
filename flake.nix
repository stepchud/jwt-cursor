{
  description = "A JWT decoder for React Native with TypeScript";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        # Only support Apple Silicon for speed
        supportedSystems = [ "aarch64-darwin" "x86_64-darwin" ];

        # Use pre-built Node.js binary
        nodejs = pkgs.nodejs_24;

        # Minimal development shell
        devShell = pkgs.mkShell {
                packages = with pkgs; [
        nodejs # or nodejs_18, nodejs_21, etc.
        nodePackages.typescript
        nodePackages.typescript-language-server
        corepack
      ];
          shellHook = ''
            echo "🚀 JWT Cursor - Minimal Dev Environment"
            echo "Node.js: $(node --version)"
            echo "npm: $(npm --version)"
            echo ""
            echo "Run: npm install && npm run build"
          '';
        };
      in
      if builtins.elem system supportedSystems then {
        devShells.default = devShell;
      } else {
        devShells.default = pkgs.mkShell {
          buildInputs = [];
          shellHook = ''
            echo "❌ Unsupported system: ${system}"
            echo "This flake only supports Apple Silicon (aarch64-darwin)"
            exit 1
          '';
        };
      }
    );
} 