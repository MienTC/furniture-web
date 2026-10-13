import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export function normalizeVideoUrl(url: string) {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

interface WysiwygEditorProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Nhập mô tả chi tiết sản phẩm hoặc bài viết...',
  minHeight = 320,
}) => {
  const quillRef = useRef<any>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          video: () => {
            const quill = quillRef.current?.getEditor?.();
            let index = 0;
            if (quill) {
              const range = quill.getSelection();
              index = range ? range.index : quill.getLength();
            }
            const url = window.prompt('Nhập link video YouTube hoặc video trực tiếp:');
            if (url) {
              const embedUrl = normalizeVideoUrl(url);
              if (quill) {
                quill.insertEmbed(index, 'video', embedUrl, 'user');
                quill.setSelection(index + 1);
              }
            }
          },
        },
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'align',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];

  return (
    <div className="wysiwyg-editor-wrapper bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
      <style>{`
        .wysiwyg-editor-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          background-color: #f8fafc;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          padding: 8px 12px;
        }
        .wysiwyg-editor-wrapper .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 14px;
        }
        .wysiwyg-editor-wrapper .ql-editor {
          min-height: ${minHeight}px;
          line-height: 1.6;
          padding: 16px;
        }
        .wysiwyg-editor-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
        .wysiwyg-editor-wrapper iframe.ql-video {
          width: 100%;
          max-width: 640px;
          aspect-ratio: 16 / 9;
          height: auto;
          border-radius: 8px;
          margin: 12px 0;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default WysiwygEditor;
