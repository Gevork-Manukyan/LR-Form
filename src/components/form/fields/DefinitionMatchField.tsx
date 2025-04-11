import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { DefinitionMatch } from '../../../types/form'

interface DefinitionMatchFieldProps {
  value: DefinitionMatch
  onChange: (value: DefinitionMatch) => void
  getLabelClassName: (field: string) => string
}

export function DefinitionMatchField({
  value,
  onChange,
  getLabelClassName,
}: DefinitionMatchFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="definitionMatch" className={getLabelClassName('definitionMatch')}>
        Definition Match <span className="text-red-500">*</span>
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={!value ? 'border-red-500' : ''}
        >
          <SelectValue placeholder="Select definition match" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Matches definition">Matches</SelectItem>
          <SelectItem value="Does NOT match definition">Does not match</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 