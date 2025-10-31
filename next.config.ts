import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  serverExternalPackages: [
    '@elastic/elasticsearch',
    'apache-arrow',
    'flatbuffers',
    'mssql',
  ],
};

export default nextConfig;
