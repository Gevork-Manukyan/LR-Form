import { X } from 'lucide-react'
import { useState, KeyboardEvent, useRef } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ tags, onChange, placeholder = 'Type and press enter...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      onChange([...tags, inputValue.trim()])
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault()
      onChange(tags.slice(0, -1))
    }
  }

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index))
  }

  return (
    <div 
      className="flex flex-wrap gap-1.5 p-1.5 min-h-[40px] w-full rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-md text-sm"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[100px] bg-transparent outline-none py-1"
      />
    </div>
  )
} 