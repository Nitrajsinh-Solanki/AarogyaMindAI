"use client";

import { SUBJECT_TAGS } from "@/lib/types";

interface SubjectTagsProps {
  selected: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function SubjectTags({ selected, onTagsChange }: SubjectTagsProps) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onTagsChange(selected.filter((t) => t !== tag));
    } else {
      onTagsChange([...selected, tag]);
    }
  }

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          Struggling with? (optional)
        </h3>
        {selected.length > 0 && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}
          >
            {selected.length} selected
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {SUBJECT_TAGS.map((tag) => {
          const isActive = selected.includes(tag);
          return (
            <button
              key={tag}
              id={`tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => toggle(tag)}
              className="tag-pill"
              style={
                isActive
                  ? {
                      background: "var(--brand-green)",
                      color: "#fff",
                      borderColor: "var(--brand-green)",
                    }
                  : {}
              }
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
