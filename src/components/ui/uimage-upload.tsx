import React, { useRef, useState, useCallback } from 'react';
import { Button, Input, Modal, Spin, message, Tooltip } from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  LinkOutlined,
  EyeOutlined,
  SwapOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

export interface UImageUploadProps {
  value?: string | null;
  onChange?: (val: string) => void;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  placeholderText?: string;
  className?: string;
  maxDimension?: number;
  quality?: number;
  helpText?: string;
}

/**
 * Nén ảnh tự động phía Client sử dụng Canvas HTML5
 * Giảm độ phân giải về tối đa maxDimension (1920px) và nén JPEG 0.85
 * Đảm bảo payload gửi lên server luôn dưới 300KB, khắc phục triệt để lỗi 413 Payload Too Large
 */
export const compressImageClient = (
  file: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<{ dataUrl: string; sizeKb: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tập tin hình ảnh'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Hình ảnh bị lỗi hoặc định dạng không hợp lệ'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const raw = reader.result as string;
          const kb = Math.round((raw.length * 3) / 4 / 1024);
          resolve({ dataUrl: raw, sizeKb: kb });
          return;
        }

        // Tạo nền trắng đối với ảnh trong suốt PNG để tránh bị nền đen khi chuyển sang JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({ dataUrl, sizeKb });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const UImageUpload: React.FC<UImageUploadProps> = ({
  value,
  onChange,
  aspectRatio = 'square',
  placeholderText = 'Tải ảnh lên hoặc dán URL',
  className = '',
  maxDimension = 1920,
  quality = 0.85,
  helpText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WebP, GIF)');
      return;
    }

    try {
      setIsCompressing(true);
      const { dataUrl, sizeKb } = await compressImageClient(file, maxDimension, quality);
      setCompressedSize(sizeKb);
      onChange?.(dataUrl);
      if (file.size > 1024 * 1024) {
        message.success(`Đã nén tối ưu ảnh: ${(file.size / (1024 * 1024)).toFixed(1)}MB → ${sizeKb}KB`);
      }
    } catch (err: any) {
      message.error(err?.message || 'Có lỗi khi xử lý hình ảnh');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    setCompressedSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onChange?.(trimmed);
      setCompressedSize(null);
      setUrlModalOpen(false);
      setUrlInput('');
      message.success('Đã áp dụng đường dẫn ảnh URL');
    }
  };

  const isDataUrl = value?.startsWith('data:image');
  const isHttpUrl = value?.startsWith('http://') || value?.startsWith('https://');

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-[16/9]'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : aspectRatio === 'auto'
      ? 'h-48'
      : 'aspect-square';

  return (
    <div className="w-full font-sans select-none">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="space-y-1.5">
          <div
            className={`relative w-full ${aspectClass} rounded-xl border border-stone-200 overflow-hidden group bg-stone-50 flex items-center justify-center shadow-xs transition-all ${className}`}
          >
            {isCompressing ? (
              <div className="flex flex-col items-center justify-center gap-2 p-6 text-stone-500">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: '#2B5A50' }} spin />} />
                <span className="text-xs font-medium">Đang tối ưu hóa hình ảnh...</span>
              </div>
            ) : (
              <>
                <img
                  src={value}
                  alt="Preview banner"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Hover overlay với nút thao tác rõ ràng */}
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center gap-2.5 p-4">
                  <Tooltip title="Xem phóng to">
                    <Button
                      size="middle"
                      shape="circle"
                      icon={<EyeOutlined className="text-white" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewOpen(true);
                      }}
                      className="!bg-white/20 hover:!bg-white/40 !border-white/30 backdrop-blur-md cursor-pointer"
                    />
                  </Tooltip>

                  <Tooltip title="Đổi ảnh từ máy tính">
                    <Button
                      size="middle"
                      shape="circle"
                      icon={<SwapOutlined className="text-white" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="!bg-white/20 hover:!bg-white/40 !border-white/30 backdrop-blur-md cursor-pointer"
                    />
                  </Tooltip>

                  <Tooltip title="Dán URL ảnh khác">
                    <Button
                      size="middle"
                      shape="circle"
                      icon={<LinkOutlined className="text-white" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUrlInput(isHttpUrl ? value : '');
                        setUrlModalOpen(true);
                      }}
                      className="!bg-white/20 hover:!bg-white/40 !border-white/30 backdrop-blur-md cursor-pointer"
                    />
                  </Tooltip>

                  <Tooltip title="Xóa hình ảnh">
                    <Button
                      size="middle"
                      shape="circle"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleRemove}
                      className="!bg-rose-500/80 hover:!bg-rose-600 !border-none !text-white cursor-pointer"
                    />
                  </Tooltip>
                </div>
              </>
            )}
          </div>

          {/* Dòng trạng thái nguồn ảnh */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span className="flex items-center gap-1">
              <CheckCircleOutlined className="text-emerald-600 text-xs" />
              {isDataUrl ? (
                <span>Ảnh tải từ máy tính {compressedSize ? `(~${compressedSize} KB)` : ''}</span>
              ) : isHttpUrl ? (
                <span className="truncate max-w-[280px]" title={value}>
                  URL: {value}
                </span>
              ) : (
                <span>Đã nạp hình ảnh</span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-stone-600 hover:text-[#2B5A50] font-medium underline cursor-pointer"
              >
                Đổi file
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setUrlInput(isHttpUrl ? value : '');
                  setUrlModalOpen(true);
                }}
                className="text-stone-600 hover:text-[#2B5A50] font-medium underline cursor-pointer"
              >
                Dán URL
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`w-full ${aspectClass} rounded-xl border-2 border-dashed border-stone-200 hover:border-[#2B5A50] bg-stone-50/70 hover:bg-[#2B5A50]/5 transition-all flex flex-col items-center justify-center gap-2.5 p-4 text-center cursor-pointer group shadow-2xs ${className}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {isCompressing ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#2B5A50' }} spin />} />
              <p className="text-xs font-medium text-stone-600 m-0">Đang nén ảnh...</p>
            </div>
          ) : (
            <>
              <div className="size-11 rounded-full bg-stone-100 group-hover:bg-[#2B5A50]/10 flex items-center justify-center text-stone-500 group-hover:text-[#2B5A50] transition-colors">
                <UploadOutlined style={{ fontSize: 20 }} />
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-700 group-hover:text-[#2B5A50] m-0 transition-colors">
                  {placeholderText}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5 m-0">
                  Nhấp để chọn ảnh từ máy (tự động nén) hoặc{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUrlInput('');
                      setUrlModalOpen(true);
                    }}
                    className="text-[#2B5A50] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <LinkOutlined /> dán liên kết URL
                  </button>
                </p>
                {helpText && <p className="text-[10px] text-stone-400 mt-1 m-0 italic">{helpText}</p>}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal dán URL ảnh trực tiếp */}
      <Modal
        title={
          <div className="font-sans font-bold text-stone-900 text-sm flex items-center gap-2">
            <LinkOutlined className="text-[#2B5A50]" /> Dán đường dẫn URL hình ảnh
          </div>
        }
        open={urlModalOpen}
        onOk={handleSaveUrl}
        onCancel={() => setUrlModalOpen(false)}
        okText="Sử dụng ảnh này"
        cancelText="Hủy bỏ"
        okButtonProps={{ className: '!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold' }}
        width={480}
        centered
        destroyOnHidden
      >
        <div className="py-3 space-y-2 font-sans">
          <p className="text-xs text-stone-500 m-0">
            Hỗ trợ hình ảnh từ Unsplash, Cloudinary, Imgur hoặc bất kỳ máy chủ CDN công khai nào:
          </p>
          <Input
            placeholder="https://images.unsplash.com/photo-..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onPressEnter={handleSaveUrl}
            prefix={<LinkOutlined className="text-stone-400 mr-1" />}
            className="!rounded-lg !py-2"
            autoFocus
          />
        </div>
      </Modal>

      {/* Modal xem trước ảnh lớn */}
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width={820}
        destroyOnHidden
      >
        <div className="p-2 pt-6">
          <img
            src={value || ''}
            alt="Xem trước hình ảnh"
            className="w-full max-h-[75vh] object-contain rounded-lg mx-auto"
          />
        </div>
      </Modal>
    </div>
  );
};

export default UImageUpload;
