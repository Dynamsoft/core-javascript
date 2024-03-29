import { EnumPDFReadingMode, EnumRasterDataSource } from "../enum";
export interface PDFReadingParameter {
    mode: EnumPDFReadingMode;
    dpi: number;
    rasterDataSource: EnumRasterDataSource;
}
