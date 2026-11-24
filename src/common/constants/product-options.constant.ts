export interface ProductOptionItem {
  value: string;
  label: string;
}

export interface PresetVariantItem {
  name: string;
  size: string;
}

export const DEFAULT_MATERIAL_OPTIONS: ProductOptionItem[] = [
  { value: 'Đệm bọt biển cao cấp, Vải công nghệ', label: 'Đệm bọt biển cao cấp, Vải công nghệ' },
  { value: 'Gỗ sồi tự nhiên nhập khẩu', label: 'Gỗ sồi tự nhiên nhập khẩu' },
  { value: 'Gỗ óc chó Bắc Mỹ cao cấp', label: 'Gỗ óc chó Bắc Mỹ cao cấp' },
  { value: 'Gỗ công nghiệp MDF chống ẩm', label: 'Gỗ công nghiệp MDF chống ẩm' },
  { value: 'Da Microfiber chống trầy xước', label: 'Da Microfiber chống trầy xước' },
  { value: 'Da bò tự nhiên Ý nguyên tấm', label: 'Da bò tự nhiên Ý nguyên tấm' },
  { value: 'Khung thép carbon sơn tĩnh điện', label: 'Khung thép carbon sơn tĩnh điện' },
  { value: 'Mặt đá Ceramic chống trầy', label: 'Mặt đá Ceramic chống trầy' },
  { value: 'Mây tre đan tự nhiên cao cấp', label: 'Mây tre đan tự nhiên cao cấp' },
];

export const DEFAULT_ORIGIN_OPTIONS: ProductOptionItem[] = [
  { value: 'Việt Nam (LuxDecor Factory)', label: 'Việt Nam (LuxDecor Factory)' },
  { value: 'Nhập khẩu Ý (Italy)', label: 'Nhập khẩu Ý (Italy)' },
  { value: 'Nhập khẩu Đức (Germany)', label: 'Nhập khẩu Đức (Germany)' },
  { value: 'Nhập khẩu Hàn Quốc', label: 'Nhập khẩu Hàn Quốc' },
  { value: 'Nhập khẩu Nhật Bản', label: 'Nhập khẩu Nhật Bản' },
  { value: 'Nhập khẩu Malaysia', label: 'Nhập khẩu Malaysia' },
  { value: 'Nhập khẩu cao cấp', label: 'Nhập khẩu cao cấp' },
];

export const DEFAULT_COLOR_OPTIONS: ProductOptionItem[] = [
  { value: 'Trắng kem', label: 'Trắng kem' },
  { value: 'Be sữa', label: 'Be sữa' },
  { value: 'Ghi sáng', label: 'Ghi sáng' },
  { value: 'Xám đậm', label: 'Xám đậm' },
  { value: 'Nâu da bò', label: 'Nâu da bò' },
  { value: 'Cam đất', label: 'Cam đất' },
  { value: 'Xanh rêu', label: 'Xanh rêu' },
  { value: 'Xanh navy', label: 'Xanh navy' },
  { value: 'Đen tuyền', label: 'Đen tuyền' },
  { value: 'Gỗ sồi tự nhiên', label: 'Gỗ sồi tự nhiên' },
  { value: 'Gỗ óc chó', label: 'Gỗ óc chó' },
];

export const PRESET_SIZE_VARIANTS: PresetVariantItem[] = [
  { name: '1m2 x 2m', size: '120 x 200 cm' },
  { name: '1m4 x 2m', size: '140 x 200 cm' },
  { name: '1m6 x 2m', size: '160 x 200 cm' },
  { name: '1m8 x 2m', size: '180 x 200 cm' },
  { name: '2m x 2m2', size: '200 x 220 cm' },
  { name: 'Văng đơn 1.5m', size: '150 x 85 x 90 cm' },
  { name: 'Văng đôi 2.1m', size: '210 x 85 x 90 cm' },
  { name: 'Bộ góc L 2.8m', size: '280 x 170 x 90 cm' },
];
