import React, { useRef, useState } from 'react';
import { Button, Input, Modal, message } from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  LinkOutlined,
  EyeOutlined,
} from '@ant-design/icons';

interface UImageUploadProps {
  value?: string | null;
  onChange?: (val: string) => void;
  aspectRatio?: 'square' | 'video' | 'banner';
  placeholderText?: string;
}

export const UImageUpload: React.FC<UImageUploadProps> = ({
  value,
  onChange,
  aspectRatio = 'square',
  placeholderText = 'Tải ảnh lên hoặc dán URL',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.warning('Dung lượng ảnh vượt quá 5MB, hệ thống sẽ tự nén');
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange?.(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveUrl = () => {
    if (urlInput.trim()) {
      onChange?.(urlInput.trim());
      setUrlModalOpen(false);
      setUrlInput('');
    }
  };

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : 'aspect-square';

  return (
    <div className="w-full font-sans">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div
          className={`relative w-full ${aspectClass} rounded-xl border border-gray-200 overflow-hidden group bg-gray-50 flex items-center justify-center`}
        >
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined style={{ color: '#fff' }} />}
              onClick={(e) => {
                e.stopPropagation();
                setPreviewOpen(true);
              }}
              className="!bg-black/40 hover:!bg-black/60"
            />
            <Button
              size="small"
              type="text"
              icon={<UploadOutlined style={{ color: '#fff' }} />}
              onClick={() => fileInputRef.current?.click()}
              className="!bg-black/40 hover:!bg-black/60"
              title="Đổi ảnh khác"
            />
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
              onClick={handleRemove}
              className="!bg-black/40 hover:!bg-black/60"
              title="Xóa ảnh"
            />
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full ${aspectClass} rounded-xl border-2 border-dashed border-gray-200 hover:border-sky-500 bg-gray-50/50 hover:bg-sky-50/20 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer p-4 text-center`}
        >
          <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <UploadOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 m-0">
              {placeholderText}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 m-0">
              Nhấp để chọn ảnh từ máy hoặc{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUrlModalOpen(true);
                }}
                className="text-sky-600 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                <LinkOutlined /> dán URL
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Modal dán URL */}
      <Modal
        title="Dán đường dẫn ảnh (URL)"
        open={urlModalOpen}
        onOk={handleSaveUrl}
        onCancel={() => setUrlModalOpen(false)}
        okText="Sử dụng ảnh"
        cancelText="Hủy"
        width={460}
        centered
      >
        <div className="py-3">
          <Input
            placeholder="https://images.unsplash.com/photo-..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onPressEnter={handleSaveUrl}
            prefix={<LinkOutlined className="text-gray-400 mr-1" />}
          />
        </div>
      </Modal>

      {/* Modal xem trước ảnh lớn */}
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width={700}
      >
        <img src={value || ''} alt="Large preview" className="w-full rounded-lg" />
      </Modal>
    </div>
  );
};

export default UImageUpload;
