import Svg, { Path } from "react-native-svg";

const paths = {
  app: "M4 4h16v16H4zM8 12l3 3 5-6",
  menu: "M4 6h16M4 12h12M4 18h16",
  back: "m12 5-7 7 7 7M5 12h14",
};

export function PreviewIcon({ name, color, size = 20 }: {
  name: keyof typeof paths;
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d={paths[name]} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
