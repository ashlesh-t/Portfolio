"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ tags, setTags, placeholder = "Add tag and press Enter" }: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
