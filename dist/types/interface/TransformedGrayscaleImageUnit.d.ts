import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface TransformedGrayscaleImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
