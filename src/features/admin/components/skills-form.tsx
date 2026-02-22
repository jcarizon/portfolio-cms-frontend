'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Pencil,
  Check,
  X,
  Loader2,
  FolderPlus,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { SkillCategory, Skill } from '@/shared/types';

interface SkillsFormProps {
  categories: SkillCategory[];
  isSaving: boolean;
  onCreateCategory: (name: string) => Promise<SkillCategory>;
  onUpdateCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onCreateSkill: (categoryId: string, name: string) => Promise<Skill>;
  onUpdateSkill: (id: string, name: string) => Promise<void>;
  onDeleteSkill: (id: string) => Promise<void>;
  onReorderCategories: (categoryIds: string[]) => Promise<void>;
  onReorderSkills: (categoryId: string, skillIds: string[]) => Promise<void>;
}

export function SkillsForm({
  categories,
  isSaving,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onCreateSkill,
  onUpdateSkill,
  onDeleteSkill,
  onReorderCategories,
  onReorderSkills,
}: SkillsFormProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillName, setEditingSkillName] = useState('');

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  // ============================================
  // CATEGORY HANDLERS
  // ============================================

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await onCreateCategory(newCategoryName.trim());
      setNewCategoryName('');
    } catch {}
  };

  const handleStartEditCategory = (category: SkillCategory) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleSaveEditCategory = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) return;
    try {
      await onUpdateCategory(editingCategoryId, editingCategoryName.trim());
      setEditingCategoryId(null);
      setEditingCategoryName('');
    } catch {}
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category and all its skills?')) return;
    await onDeleteCategory(id);
  };

  const handleMoveCategoryUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedCategories];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    onReorderCategories(newOrder.map((c) => c.id));
  };

  const handleMoveCategoryDown = (index: number) => {
    if (index === sortedCategories.length - 1) return;
    const newOrder = [...sortedCategories];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    onReorderCategories(newOrder.map((c) => c.id));
  };

  // ============================================
  // SKILL HANDLERS
  // ============================================

  const handleAddSkill = async (categoryId: string) => {
    const skillName = newSkillInputs[categoryId]?.trim();
    if (!skillName) return;
    try {
      await onCreateSkill(categoryId, skillName);
      setNewSkillInputs((prev) => ({ ...prev, [categoryId]: '' }));
    } catch {}
  };

  const handleStartEditSkill = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setEditingSkillName(skill.name);
  };

  const handleSaveEditSkill = async () => {
    if (!editingSkillId || !editingSkillName.trim()) return;
    try {
      await onUpdateSkill(editingSkillId, editingSkillName.trim());
      setEditingSkillId(null);
      setEditingSkillName('');
    } catch {}
  };

  const handleCancelEditSkill = () => {
    setEditingSkillId(null);
    setEditingSkillName('');
  };

  const handleDeleteSkill = async (id: string) => {
    await onDeleteSkill(id);
  };

  const handleMoveSkillUp = (category: SkillCategory, skillIndex: number) => {
    if (skillIndex === 0) return;
    const sortedSkills = [...category.skills].sort((a, b) => a.order - b.order);
    const newOrder = [...sortedSkills];
    [newOrder[skillIndex - 1], newOrder[skillIndex]] = [
      newOrder[skillIndex],
      newOrder[skillIndex - 1],
    ];
    onReorderSkills(category.id, newOrder.map((s) => s.id));
  };

  const handleMoveSkillDown = (category: SkillCategory, skillIndex: number) => {
    const sortedSkills = [...category.skills].sort((a, b) => a.order - b.order);
    if (skillIndex === sortedSkills.length - 1) return;
    const newOrder = [...sortedSkills];
    [newOrder[skillIndex], newOrder[skillIndex + 1]] = [
      newOrder[skillIndex + 1],
      newOrder[skillIndex],
    ];
    onReorderSkills(category.id, newOrder.map((s) => s.id));
  };

  return (
    <div className="space-y-6">
      {/* Add Category Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Add New Category
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g., Frontend, Backend, DevOps..."
            className="form-input flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim() || isSaving}
            className={cn(
              'btn btn-primary gap-2',
              (!newCategoryName.trim() || isSaving) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FolderPlus className="w-4 h-4" />
            )}
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {sortedCategories.map((category, categoryIndex) => {
          const sortedSkills = [...category.skills].sort((a, b) => a.order - b.order);
          const isEditingCategory = editingCategoryId === category.id;

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 p-4 bg-neutral-50 border-b border-neutral-200">
                {/* Drag Handle */}
                <div className="text-neutral-400 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Category Name */}
                {isEditingCategory ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="form-input flex-1 py-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEditCategory();
                        if (e.key === 'Escape') handleCancelEditCategory();
                      }}
                    />
                    <button
                      onClick={handleSaveEditCategory}
                      className="p-1.5 rounded bg-green-100 text-green-600 hover:bg-green-200"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEditCategory}
                      className="p-1.5 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="flex-1 font-semibold text-neutral-800">
                      {category.name}
                      <span className="ml-2 text-sm font-normal text-neutral-500">
                        ({category.skills.length} skills)
                      </span>
                    </h4>

                    {/* Category Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveCategoryUp(categoryIndex)}
                        disabled={categoryIndex === 0}
                        className={cn(
                          'p-1.5 rounded hover:bg-neutral-200 transition-colors',
                          categoryIndex === 0 && 'opacity-30 cursor-not-allowed'
                        )}
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveCategoryDown(categoryIndex)}
                        disabled={categoryIndex === sortedCategories.length - 1}
                        className={cn(
                          'p-1.5 rounded hover:bg-neutral-200 transition-colors',
                          categoryIndex === sortedCategories.length - 1 &&
                            'opacity-30 cursor-not-allowed'
                        )}
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStartEditCategory(category)}
                        className="p-1.5 rounded hover:bg-neutral-200 transition-colors"
                        title="Edit category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Skills List */}
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {sortedSkills.map((skill, skillIndex) => {
                    const isEditingSkill = editingSkillId === skill.id;

                    return (
                      <div
                        key={skill.id}
                        className={cn(
                          'group flex items-center gap-1 px-3 py-1.5 rounded-lg',
                          'bg-neutral-100 border border-neutral-200',
                          isEditingSkill && 'ring-2 ring-primary-500'
                        )}
                      >
                        {isEditingSkill ? (
                          <>
                            <input
                              type="text"
                              value={editingSkillName}
                              onChange={(e) => setEditingSkillName(e.target.value)}
                              className="w-24 px-1 py-0.5 text-sm border border-neutral-300 rounded"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEditSkill();
                                if (e.key === 'Escape') handleCancelEditSkill();
                              }}
                            />
                            <button
                              onClick={handleSaveEditSkill}
                              className="p-0.5 text-green-600 hover:text-green-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleCancelEditSkill}
                              className="p-0.5 text-neutral-500 hover:text-neutral-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-neutral-700">{skill.name}</span>
                            <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                              <button
                                onClick={() => handleMoveSkillUp(category, skillIndex)}
                                disabled={skillIndex === 0}
                                className={cn(
                                  'p-0.5 text-neutral-400 hover:text-neutral-600',
                                  skillIndex === 0 && 'opacity-30 cursor-not-allowed'
                                )}
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveSkillDown(category, skillIndex)}
                                disabled={skillIndex === sortedSkills.length - 1}
                                className={cn(
                                  'p-0.5 text-neutral-400 hover:text-neutral-600',
                                  skillIndex === sortedSkills.length - 1 &&
                                    'opacity-30 cursor-not-allowed'
                                )}
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleStartEditSkill(skill)}
                                className="p-0.5 text-neutral-400 hover:text-neutral-600"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="p-0.5 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {sortedSkills.length === 0 && (
                    <span className="text-sm text-neutral-400 italic">
                      No skills yet. Add one below.
                    </span>
                  )}
                </div>

                {/* Add Skill Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInputs[category.id] || ''}
                    onChange={(e) =>
                      setNewSkillInputs((prev) => ({
                        ...prev,
                        [category.id]: e.target.value,
                      }))
                    }
                    placeholder="Add a skill..."
                    className="form-input flex-1 py-2 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(category.id)}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(category.id)}
                    disabled={!newSkillInputs[category.id]?.trim() || isSaving}
                    className={cn(
                      'btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200 gap-1 text-sm py-2',
                      (!newSkillInputs[category.id]?.trim() || isSaving) &&
                        'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {sortedCategories.length === 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-600 mb-2">No skill categories yet</p>
            <p className="text-sm text-neutral-400">
              Add your first category above to get started
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Group related skills into categories (Frontend, Backend, Tools)</li>
          <li>• Use industry-standard names for better recognition</li>
          <li>• Reorder to highlight your strongest skills first</li>
          <li>• Keep each category focused with 5-10 skills</li>
        </ul>
      </div>
    </div>
  );
}