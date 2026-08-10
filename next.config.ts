import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/**
 * このMacのプライベートIPアドレスを列挙する。
 *
 * Next.jsの開発サーバーは、安全のため localhost 以外からの
 * `/_next/*`（JavaScript本体）へのアクセスを既定でブロックする。
 * そのままだと、同じWi-Fi上のiPhone等から開いてもJavaScriptが読み込まれず、
 * サーバー描画されない画面が真っ白のままになる。
 *
 * IPアドレスはネットワークを変えると変わるため、値を固定で書かず、
 * 起動時に自動で取得する。
 */
function getLocalNetworkHosts(): string[] {
  const hosts: string[] = [];

  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses ?? []) {
      // IPv4 かつ、ループバックでないものだけを許可する
      if (address.family === "IPv4" && !address.internal) {
        hosts.push(address.address);
      }
    }
  }

  return hosts;
}

const nextConfig: NextConfig = {
  /**
   * 開発時のみ有効。本番ビルドには影響しない。
   * 実機確認のために、同一LAN内からの開発リソース取得を許可する。
   */
  allowedDevOrigins: getLocalNetworkHosts(),
};

export default nextConfig;
