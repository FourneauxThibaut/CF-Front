import { api } from '@/lib/api'
import type {
  RuleSystem,
  Rule,
  RuleBlock,
  BlockDefinition,
  CreateSystemBody,
  CreateRuleBody,
  UpdateRuleBody,
  ReorderBody,
  UpdateBlockBody,
} from '@/types/ruleeditor'

const base = '/api'

export const ruleeditorApi = {
  // Rule systems
  listSystems: () => api.get<RuleSystem[]>(`${base}/rule-systems`),
  getSystem: (systemId: string) => api.get<RuleSystem>(`${base}/rule-systems/${systemId}`),
  createSystem: (body: CreateSystemBody) => api.post<RuleSystem>(`${base}/rule-systems`, body),
  updateSystem: (systemId: string, body: CreateSystemBody) =>
    api.put<RuleSystem>(`${base}/rule-systems/${systemId}`, body),
  deleteSystem: (systemId: string) => api.delete(`${base}/rule-systems/${systemId}`),

  // Rules
  createRule: (systemId: string, body: CreateRuleBody) =>
    api.post<Rule>(`${base}/rule-systems/${systemId}/rules`, body),
  updateRule: (systemId: string, ruleId: string, body: UpdateRuleBody) =>
    api.put<Rule>(`${base}/rule-systems/${systemId}/rules/${ruleId}`, body),
  deleteRule: (systemId: string, ruleId: string) =>
    api.delete(`${base}/rule-systems/${systemId}/rules/${ruleId}`),
  reorderRules: (systemId: string, body: ReorderBody) =>
    api.put(`${base}/rule-systems/${systemId}/rules/reorder`, body),

  // Blocks
  addBlock: (systemId: string, ruleId: string, block: Partial<RuleBlock>) =>
    api.post<RuleBlock>(`${base}/rule-systems/${systemId}/rules/${ruleId}/blocks`, block),
  updateBlock: (systemId: string, ruleId: string, blockId: string, body: UpdateBlockBody) =>
    api.put<RuleBlock>(
      `${base}/rule-systems/${systemId}/rules/${ruleId}/blocks/${blockId}`,
      body
    ),
  deleteBlock: (systemId: string, ruleId: string, blockId: string) =>
    api.delete(`${base}/rule-systems/${systemId}/rules/${ruleId}/blocks/${blockId}`),
  reorderBlocks: (systemId: string, ruleId: string, body: ReorderBody) =>
    api.put(`${base}/rule-systems/${systemId}/rules/${ruleId}/blocks/reorder`, body),

  // Block definitions
  getBlockDefinitions: (systemId: string) =>
    api.get<BlockDefinition[]>(`${base}/rule-systems/${systemId}/block-definitions`),
  createBlockDefinition: (systemId: string, def: BlockDefinition) =>
    api.post<BlockDefinition>(`${base}/rule-systems/${systemId}/block-definitions`, def),
  updateBlockDefinition: (systemId: string, defId: string, def: BlockDefinition) =>
    api.put<BlockDefinition>(
      `${base}/rule-systems/${systemId}/block-definitions/${defId}`,
      def
    ),
  deleteBlockDefinition: (systemId: string, defId: string) =>
    api.delete(`${base}/rule-systems/${systemId}/block-definitions/${defId}`),
}
