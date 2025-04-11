import { FormData } from '../../../types/form';
import { Checkbox } from '../../ui/checkbox';
import { TagInput } from '../../ui/tag-input';

interface CommonFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function CommonFields({ formData, setFormData }: CommonFieldsProps) {
  // Only show for Pending and Settled
  if (formData.status !== 'Pending' && formData.status !== 'Settled') return null;

  return (
    <>
      {/* Description Text Area */}
      {(formData.status === 'Pending' ||
        (formData.status === 'Settled' && formData.hasDescription)) && (
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      )}

      {/* Multiple Defendants Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasMultipleDefendants"
          checked={formData.hasMultipleDefendants}
          onCheckedChange={checked =>
            setFormData({ ...formData, hasMultipleDefendants: checked as boolean })
          }
        />
        <label
          htmlFor="hasMultipleDefendants"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          More than searched defendant?
        </label>
      </div>

      {/* Defendant Names List */}
      {formData.hasMultipleDefendants && (
        <div className="space-y-2">
          <label
            htmlFor="defendantNames"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Defendant Names
          </label>
          <TagInput
            tags={formData.defendantNames}
            onChange={tags => setFormData({ ...formData, defendantNames: tags })}
            placeholder="Type defendant name and press enter..."
          />
        </div>
      )}
    </>
  );
}
