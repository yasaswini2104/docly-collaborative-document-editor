import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function Toolbar({ editor, disabled }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  
  const toggleHeading = (level: 1 | 2 | 3) => 
    editor.chain().focus().toggleHeading({ level }).run();
  
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  const ToolbarButton = ({ 
    isActive, 
    onClick, 
    disabled: buttonDisabled, 
    children 
  }: { 
    isActive?: boolean; 
    onClick: () => void; 
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || buttonDisabled}
      className={`rounded-md p-2 transition-colors ${
        isActive
          ? 'bg-primary-500/10 text-primary-500'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-surface-border bg-surface/50 p-2 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-1 pr-2 border-r border-surface-border">
        <ToolbarButton 
          onClick={undo} 
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={redo} 
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-surface-border">
        <ToolbarButton 
          onClick={() => toggleHeading(1)} 
          isActive={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => toggleHeading(2)} 
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => toggleHeading(3)} 
          isActive={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-surface-border">
        <ToolbarButton onClick={toggleBold} isActive={editor.isActive('bold')}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={toggleItalic} isActive={editor.isActive('italic')}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={toggleStrike} isActive={editor.isActive('strike')}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={toggleCode} isActive={editor.isActive('code')}>
          <Code className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 pl-2">
        <ToolbarButton onClick={toggleBulletList} isActive={editor.isActive('bulletList')}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={toggleOrderedList} isActive={editor.isActive('orderedList')}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={toggleBlockquote} isActive={editor.isActive('blockquote')}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}
