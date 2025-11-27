{
  description = "Development environment for Zodiac project with Fly.io and PostgreSQL";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable"; # or specify a stable version
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system: let
    pkgs = nixpkgs.legacyPackages.${system};
  in
    {
      devShell = pkgs.mkShell {
        packages = [
          pkgs.flyctl
          pkgs.postgresql
          pkgs.nodejs
          (pkgs.writers.writeDashBin "zodiac-proxy" ''
            ${pkgs.flyctl}/bin/flyctl proxy 5432:5432 -a zodiac-db
          '')
          (pkgs.writers.writeDashBin "zodiac-psql" ''
            ${pkgs.postgresql}/bin/psql "host=localhost port=5432 dbname=zodiac user=zodiac password=$(pass work/zodiac/postgresql)" "$@"
          '')
        ];
      };
    }
  );
}
