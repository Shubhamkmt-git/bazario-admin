import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Enter detailed description...',
  height = 280,
  disabled = false,
  className = ''
}) {
  return (
    <div className={`rich-text-editor-wrapper rounded-2xl overflow-hidden border border-slate-200 focus-within:border-[#064C23] focus-within:ring-4 focus-within:ring-[#064C23]/10 transition-all ${className}`}>
      <Editor
        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
        value={value}
        disabled={disabled}
        onEditorChange={(content) => {
          if (onChange) {
            onChange(content)
          }
        }}
        init={{
          height: height,
          menubar: false,
          statusbar: true,
          branding: false,
          promotion: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'wordcount'
          ],
          toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | table link | removeformat | code fullscreen',
          placeholder: placeholder,
          content_style: `
            body {
              font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              font-size: 14px;
              line-height: 1.6;
              color: #1e293b;
              padding: 12px;
            }
            p { margin: 0 0 8px 0; }
            h1, h2, h3, h4 { color: #0f172a; font-weight: 700; }
          `,
          skin: 'oxide',
          content_css: 'default',
          toolbar_mode: 'sliding'
        }}
      />
    </div>
  )
}
