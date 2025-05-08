declare module "react-native-config" {
  export interface NativeConfig {
    ENV: "dev" | "prod";
    API_URL: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
