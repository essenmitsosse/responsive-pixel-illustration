import { useParams } from "react-router-dom";
import RenderPixel from "./RenderPixel";

export default (props: { idImage?: string }) => {
  const params = useParams();
  return (
    <RenderPixel idImage={params.idImage ?? props.idImage ?? "teiresias"} />
  );
};
