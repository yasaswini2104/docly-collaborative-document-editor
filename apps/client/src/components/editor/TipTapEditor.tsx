import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './Toolbar';

interface TipTapEditorProps {
  initialContent: any;
  onSave: (content: any) => void;
  disabled?: boolean;
}

export function TipTapEditor({ initialContent, onSave, disabled }: TipTapEditorProps) {
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: initialContent,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for debounced auto-save
      saveTimeoutRef.current = setTimeout(() => {
        onSave(json);
      }, 1500); // 1.5 second debounce
    },
  });

  // Update editable state when disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col rounded-xl border border-surface-border bg-surface-elevated shadow-sm overflow-hidden">
      <Toolbar editor={editor} disabled={disabled} />
      <div className="bg-surface-elevated flex-1 cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
