import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface TextRemovedBinaryImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
