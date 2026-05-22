{ pkgs ? import <nixpkgs> { } }:
let
  phpEnv = pkgs.php85.buildEnv {
    extensions = { enabled, all }: enabled ++ (with all; [
    curl
    gd
    intl
    mbstring
    openssl
    pdo_sqlite
    xdebug
    yaml
    ]);
    extraConfig = ''
    xdebug.mode=debug
    xdebug.start_with_request=yes
    xdebug.client_host=localhost
    xdebug.client_port=9003
    '';
  };
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    phpEnv
    phpEnv.packages.composer
    nodejs
    lessc
  ];
}