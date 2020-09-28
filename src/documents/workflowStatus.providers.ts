import { WorkflowStatus } from '../shared/entity/workflowStatus.entity';

export const workFlowStatusProviders = [
    { provide: 'WorkFlowStatusRepository', useValue: WorkflowStatus },
];
