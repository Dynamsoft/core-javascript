import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface BinaryImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
