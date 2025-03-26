import { NativeModule, requireNativeModule } from "expo";

declare class GuavapayReactNativeModule extends NativeModule {
  info(): string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<GuavapayReactNativeModule>(
  "GuavapayReactNative",
);
