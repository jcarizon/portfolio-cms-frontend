'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { AboutParagraph } from '@/shared/types';

interface AboutFormProps {
  paragraphs: AboutParagraph[];
  isSaving: boolean;
  onSubmit: (paragraphs: AboutParagraph[]) => Promise<void>;
  onPreviewChange: (paragraphs: AboutParagraph[]) => void;
}

export function AboutForm({
  paragraphs: initialParagraphs,
  isSaving,
  onSubmit,
  onPreviewChange,
}: AboutFormProps) {
  const [paragraphs, setParagraphs] = useState<AboutParagraph[]>(initialParagraphs);
  const [isDirty, setIsDirty] = useState(false);

  // Update preview when paragraphs change
  useEffect(() => {
    onPreviewChange(paragraphs);
  }, [paragraphs, onPreviewChange]);

  // Generate unique ID for new paragraphs
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Add new paragraph
  const handleAddParagraph = () => {
    const newParagraph: AboutParagraph = {
      id: generateId(),
      text: '',
      order: paragraphs.length,
    };
    setParagraphs([...paragraphs, newParagraph]);
    setIsDirty(true);
  };

  // Update paragraph text
  const handleUpdateParagraph = (id: string, text: string) => {
    setParagraphs(
      paragraphs.map((p) => (p.id === id ? { ...p, text } : p))
    );
    setIsDirty(true);
  };

  // Delete paragraph
  const handleDeleteParagraph = (id: string) => {
    if (paragraphs.length <= 1) {
      return; // Keep at least one paragraph
    }
    const filtered = paragraphs.filter((p) => p.id !== id);
    // Reorder remaining paragraphs
    const reordered = filtered.map((p, index) => ({ ...p, order: index }));
    setParagraphs(reordered);
    setIsDirty(true);
  };

  // Move paragraph up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newParagraphs = [...paragraphs];
    [newParagraphs[index - 1], newParagraphs[index]] = [
      newParagraphs[index],
      newParagraphs[index - 1],
    ];
    // Update order values
    const reordered = newParagraphs.map((p, i) => ({ ...p, order: i }));
    setParagraphs(reordered);
    setIsDirty(true);
  };

  // Move paragraph down
  const handleMoveDown = (index: number) => {
    if (index === paragraphs.length - 1) return;
    const newParagraphs = [...paragraphs];
    [newParagraphs[index], newParagraphs[index + 1]] = [
      newParagraphs[index + 1],
      newParagraphs[index],
    ];
    // Update order values
    const reordered = newParagraphs.map((p, i) => ({ ...p, order: i }));
    setParagraphs(reordered);
    setIsDirty(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate - all paragraphs must have text
    const hasEmpty = paragraphs.some((p) => !p.text.trim());
    if (hasEmpty) {
      return;
    }

    await onSubmit(paragraphs);
    setIsDirty(false);
  };

  // Sort paragraphs by order for display
  const sortedParagraphs = [...paragraphs].sort((a, b) => a.order - b.order);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Paragraphs Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">
            About Paragraphs
          </h3>
          <button
            type="button"
            onClick={handleAddParagraph}
            className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200 gap-2 text-sm py-2"
          >
            <Plus className="w-4 h-4" />
            Add Paragraph
          </button>
        </div>

        <p className="text-sm text-neutral-500 mb-4">
          Write about yourself. Use multiple paragraphs to organize your content.
          Drag to reorder.
        </p>

        {/* Paragraphs List */}
        <div className="space-y-4">
          {sortedParagraphs.map((paragraph, index) => (
            <div
              key={paragraph.id}
              className="group relative bg-neutral-50 rounded-lg p-4 border border-neutral-200"
            >
              {/* Paragraph Header */}
              <div className="flex items-center gap-2 mb-3">
                {/* Drag Handle */}
                <div className="text-neutral-400 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Paragraph Number */}
                <span className="text-sm font-medium text-neutral-500">
                  Paragraph {index + 1}
                </span>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Move Buttons */}
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className={cn(
                    'p-1 rounded hover:bg-neutral-200 transition-colors',
                    index === 0 && 'opacity-30 cursor-not-allowed'
                  )}
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === paragraphs.length - 1}
                  className={cn(
                    'p-1 rounded hover:bg-neutral-200 transition-colors',
                    index === paragraphs.length - 1 && 'opacity-30 cursor-not-allowed'
                  )}
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteParagraph(paragraph.id)}
                  disabled={paragraphs.length <= 1}
                  className={cn(
                    'p-1 rounded text-red-500 hover:bg-red-50 transition-colors',
                    paragraphs.length <= 1 && 'opacity-30 cursor-not-allowed'
                  )}
                  title={
                    paragraphs.length <= 1
                      ? 'Cannot delete the last paragraph'
                      : 'Delete paragraph'
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                value={paragraph.text}
                onChange={(e) => handleUpdateParagraph(paragraph.id, e.target.value)}
                placeholder="Write something about yourself..."
                rows={4}
                className={cn(
                  'w-full px-4 py-3 rounded-lg border-2 border-neutral-200',
                  'focus:border-primary-500 focus:ring-0 focus:outline-none',
                  'resize-none transition-colors',
                  !paragraph.text.trim() && 'border-amber-300 bg-amber-50'
                )}
              />
              {!paragraph.text.trim() && (
                <p className="mt-1 text-xs text-amber-600">
                  This paragraph is empty and will show a warning
                </p>
              )}

              {/* Character Count */}
              <div className="mt-2 text-xs text-neutral-400 text-right">
                {paragraph.text.length} / 2000 characters
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paragraphs.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            <p>No paragraphs yet.</p>
            <button
              type="button"
              onClick={handleAddParagraph}
              className="mt-2 text-primary-600 hover:underline"
            >
              Add your first paragraph
            </button>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep paragraphs concise and focused on one topic each</li>
          <li>• Start with your current role and years of experience</li>
          <li>• Mention key technologies and skills</li>
          <li>• Add what makes you unique or your career highlights</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-neutral-500">
          {isDirty ? '• You have unsaved changes' : '✓ All changes saved'}
        </p>
        <button
          type="submit"
          disabled={isSaving || !isDirty || paragraphs.some((p) => !p.text.trim())}
          className={cn(
            'btn btn-primary gap-2',
            (isSaving || !isDirty) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}