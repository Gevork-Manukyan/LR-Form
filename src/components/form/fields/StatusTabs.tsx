import { LawsuitFormData } from '../../../types/form';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';

interface StatusTabsProps {
  formData: LawsuitFormData;
  setFormData: (data: LawsuitFormData) => void;
}

export function StatusTabs({ formData, setFormData }: StatusTabsProps) {
  return (
    <Tabs
      value={formData.status || 'Pending'}
      onValueChange={(value: string) => {
        if (value === 'Pending' || value === 'Settled' || value === 'LWDA') {
          setFormData({
            ...formData,
            status: value,
          });
        }
      }}
      className="w-full"
    >
      <TabsList className="w-full h-8">
        <TabsTrigger value="Settled" className="flex-1 text-sm">
          Settled
        </TabsTrigger>
        <TabsTrigger value="Pending" className="flex-1 text-sm">
          Pending
        </TabsTrigger>
        <TabsTrigger value="LWDA" className="flex-1 text-sm">
          LWDA
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
