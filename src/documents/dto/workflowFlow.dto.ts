import { ApiProperty } from '@nestjs/swagger';
import { WorkflowFlow } from '../../shared/entity/workflowFlow.entity';

export class WorkflowFlowDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly workflowStatus: string;

    @ApiProperty()
    readonly parameter: string;

    @ApiProperty()
    readonly nextWorkFlowStatus: string;

    constructor(data: WorkflowFlow) {
        this.id = data.id;
        this.workflowStatus = data.workflowStatus;
        this.parameter = data.parameter;
        this.nextWorkFlowStatus = data.nextWorkflowStatus;
    }
}
