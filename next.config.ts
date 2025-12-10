import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [
    '@elastic/elasticsearch',
    'apache-arrow',
    'flatbuffers',
    'mssql',
  ],
};

export default nextConfig;
