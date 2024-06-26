import { EnumCornerType } from "../enum";
import { LineSegment } from "./LineSegment";
import { Point } from "./Point";
export interface Corner {
    type: EnumCornerType;
    intersection: Point;
    line1: LineSegment;
    line2: LineSegment;
}
