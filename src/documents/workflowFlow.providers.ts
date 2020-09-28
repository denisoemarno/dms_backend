import { WorkflowFlow } from '../shared/entity/workflowFlow.entity';

export const workFlowFlowProviders = [
    { provide: 'WorkFlowFlowRepository', useValue: WorkflowFlow },
];
