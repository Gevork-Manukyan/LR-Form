export type Status = 'Pending' | 'Settled'
export type TimeFrame = '12 months' | '12-36 months' | '36 months'
export type DefinitionMatch = 'Matches definition' | 'Does NOT match definition'

export interface FormData {
  status: Status
  caseNumber: string
  timeFrame: TimeFrame
  date: string
  lawFirm: string
  definitionMatch: DefinitionMatch
  description: string
  hasMultipleDefendants: boolean
  defendantNames: string[]
} 