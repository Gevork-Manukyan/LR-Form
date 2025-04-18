export type Status = 'Pending' | 'Settled' | 'LWDA'
export type TimeFrame = '12 months' | '12-36 months' | 'over 36 months'
export type DefinitionMatch = 'Matches definition' | 'Does NOT match definition'
export type ClassType = 'Class' | 'PAGA'
export type LDWDate = string

export interface FormData {
  status: Status
  caseNumber: string
  timeFrame: TimeFrame
  date: string
  lawFirm: string[]
  definitionMatch: DefinitionMatch
  description: string
  hasMultipleDefendants: boolean
  defendantNames: string[]
  paDate: string
  faDate: string
  noPADate: boolean
  noFADate: boolean
  classType: ClassType
  periodEndDate: string
  ldwDate: string
  isLDWAfterPeriodEnd: boolean
  liabilityCalc: string
  hasDescription: boolean
  scheduledMPA: boolean
  scheduledMFA: boolean
  noPeriodEndDate: boolean
  definitionMismatchReason: string
  pncJobTitle: string
  notFiledDate: string
  attorney: string[]
  customPA: boolean
  customFA: boolean
  customPAText: string
  customFAText: string
  noPNC: boolean
  limitedClaims: boolean
  noLawFirm: boolean
} 