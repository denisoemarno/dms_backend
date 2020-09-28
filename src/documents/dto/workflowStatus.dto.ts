import { ApiProperty } from '@nestjs/swagger';
import { WorkflowStatus } from '../../shared/entity/workflowStatus.entity';

export class WorkflowStatusDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly status: string;

    @ApiProperty()
    readonly type: string;

    @ApiProperty()
    readonly role: string;

    constructor(data: WorkflowStatus) {
        this.id = data.id;
        this.status = data.status;
        this.type = data.type;
        this.role = data.role;
    }
}
