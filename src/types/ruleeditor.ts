// Rule editor types (match backend + spec)

export type BlockType =
  | 'trigger'
  | 'roll'
  | 'condition'
  | 'action'
  | 'modifier'
  | 'option'

export type RefType = 'skill' | 'item' | 'entity' | 'stat'

export interface TextSegment {
  type: 'text'
  value: string
}

export interface DropdownSegment {
  type: 'dropdown'
  id: string
  value: string
  options: string[]
}

export interface InputSegment {
  type: 'input'
  id: string
  value: string
  placeholder: string
}

export interface ReferenceSegment {
  type: 'reference'
  id: string
  refType: RefType
  refId: string | null
}

export type Segment =
  | TextSegment
  | DropdownSegment
  | InputSegment
  | ReferenceSegment

export interface RuleBlock {
  id: string
  type: BlockType
  segments: Segment[]
  order: number
}

export interface Rule {
  id: string
  name: string
  description: string
  icon: string
  blocks: RuleBlock[]
  isActive: boolean
  order: number
}

export interface BlockDefinition {
  id?: string
  type: BlockType
  label: string
  color: string
  icon: string
  templateSegments: Segment[]
}

export interface RuleSystem {
  id: string
  userId: string
  name: string
  description: string
  rules: Rule[]
  blockDefinitions: BlockDefinition[]
  createdAt: string
  updatedAt: string
}

// DTOs for API
export interface CreateSystemBody {
  name?: string
  description?: string
}

export interface CreateRuleBody {
  name?: string
  description?: string
  icon?: string
  order?: number
}

export interface UpdateRuleBody {
  name?: string
  description?: string
  icon?: string
  isActive?: boolean
  order?: number
}

export interface ReorderBody {
  orderedIds: string[]
}

export interface UpdateBlockBody {
  segments?: Segment[]
  order?: number
}
