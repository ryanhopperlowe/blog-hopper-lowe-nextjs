import type { NextConfig } from "next";

const getConfig = (): NextConfig => {
  const isDev = process.env.NODE_ENV === "development";

  const devConfigTurbo: NextConfig = {
    turbopack: {
      rules: {
        "*.md": {
          loaders: ["raw-loader"],
          as: "*.ts",
        },
      },
    },
  };

  const prodConfigWebpack: NextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(md)$/i,
        loader: "raw-loader",
      });

      return config;
    },
  };

  return isDev ? { ...devConfigTurbo } : { ...prodConfigWebpack };
};

export default getConfig();
