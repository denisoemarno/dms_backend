import { User } from './../users/user.entity';
import { Tags } from './../tags/tags.entity';
import { DocumentTag } from '../shared/entity/documentTag.entity';
import { DocumentType } from './../document_type/documenttype.entity';

import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateDocumentsDto } from './dto/create-documents.dto';
import { Documents } from './document.entity';
import { DocumentsDto, DocumentsPaginateDto } from './dto/documents.dto';
import { UpdateDocumentsDto } from './dto/update-documents.dto';
import { UpdateApprovalDocumentsDto } from './dto/update-approval-documents.dto';
import { UpdateApprovalS4DocumentsDto } from './dto/update-approvals4-documents.dto';
import { Activity } from '../activity/activity.entity';
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
import { Op } from 'sequelize';
import { Logger } from '@nestjs/common';
import { ActivityDto } from 'src/activity/dto/activity.dto';
import { WorkflowStatus } from 'src/shared/entity/workflowStatus.entity';
import { WorkflowFlow } from 'src/shared/entity/workflowFlow.entity';
import { WorkflowFlowDto } from './dto/workflowFlow.dto';
import { Files as FilesEntity } from '../shared/entity/files.entity';
import { WorkflowStatusDto } from './dto/workflowStatus.dto';

@Injectable()
export class DocumentsService {
    constructor(
        @Inject('DocumentsRepository')
        private readonly documentsRepository: typeof Documents,
        @Inject('DocumentsRepository')
        private readonly as: typeof Documents,
        @Inject('WorkFlowStatusRepository')
        private readonly workFlowStatusRepository: typeof WorkflowStatus,

        @Inject('WorkFlowFlowRepository')
        private readonly workFlowFlowRepository: typeof WorkflowFlow, // @Inject('SEQUELIZE') // private readonly sequelizeInstance: typeof Sequelize,
    ) {}

    async findGetAll(
        keyword?: string,
        offset = 0,
        limit = 10,
    ): Promise<DocumentsPaginateDto> {
        //const category = await this.documentsRepository.findAll<Documents>({
        // include: [User, Tags],
        // include: [
        //     //User,
        //     {
        //         model: Tags,
        //         as: 'tags',
        //         required: false,
        //         // Pass in the Product attributes that you want to retrieve
        //         attributes: ['name'],
        //         // through: {
        //         //   // This block of code allows you to retrieve the properties of the join table
        //         //   model: DocumentTag,
        //         //   as: 'productOrders',
        //         //   attributes: ['qty'],
        //         // }
        //     },
        // ],
        //where: { id: 1 },
        //});

        // console.log(category);
        // return category.map(tags => {
        //     return new DocumentsDto(tags);
        // });

        let offsetNumber = 0 + (offset - 1) * limit;
        if (keyword) {
            const data = await this.documentsRepository.findAndCountAll({
                include: [
                    { model: User, as: 'user' },
                    { model: User, as: 'userVerified' },
                    Tags,
                    DocumentType,
                ],
                where: {
                    name: {
                        [Op.like]: '%' + keyword + '%',
                    },
                },
                offset: offsetNumber,
                limit: limit,
            });
            // return tag.map(tags => {
            return new DocumentsPaginateDto(data.count, data.rows);
            // });
        } else {
            const data = await this.documentsRepository.findAndCountAll({
                include: [
                    // { model: User, as: 'user' },
                    // { model: User, as: 'userVerified' },
                    Tags,
                    DocumentType,
                ],
                offset: offsetNumber,
                limit: limit,
            });
            Logger.log(data);
            // return data.map(datas => {
            // console.log(datas.tags);
            return new DocumentsPaginateDto(data.count, data.rows);
            // });
        }
    }

    async findOne(id: number) {
        const rest = await this.documentsRepository.findByPk<Documents>(id, {
            include: [
                // { model: User, as: 'user' },
                // { model: User, as: 'userVerified' },
                Tags,
            ],
        });
        if (!rest) {
            throw new HttpException('No document found', HttpStatus.NOT_FOUND);
        }
        return new DocumentsDto(rest);
    }

    private async getNewStatus(id: number, status: string, parameter: string) {
        return await WorkflowFlow.findOne({
            where: {
                workflow_id: id,
                workflow_status: status,
                parameter: parameter,
            },
        });
    }

    private async createMain(
        userId: string,
        firstName: string,
        status: string,
        createDocumentsDto: CreateDocumentsDto,
    ) {
        const rest = new Documents();
        rest.name = createDocumentsDto.name;
        rest.title = createDocumentsDto.title;
        rest.description = createDocumentsDto.description;
        rest.type = createDocumentsDto.type;
        rest.status = status;
        rest.createdBy = userId;
        rest.created_name = firstName;

        return rest.save();

        // return await this.sequelizeInstance.transaction().then(function(t) {
        //     return rest
        //         .save({ transaction: t })
        //         .then(function() {
        //             t.commit();
        //         })
        //         .catch(function(err) {
        //             t.rollback();
        //         });
        // });
    }

    async create(
        userId: string,
        firstName: string,
        createDocumentsDto: CreateDocumentsDto,
    ) {
        try {
            const getStatus = await this.getNewStatus(
                createDocumentsDto.type,
                'created',
                createDocumentsDto.parameter,
            );
            let status = getStatus ? getStatus.nextWorkflowStatus : 'Created';
            // Logger.log(status, 'status_doc');
            const data = await this.createMain(
                userId,
                firstName,
                status,
                createDocumentsDto,
            );

            // Logger.log(data, 'data');

            if (data) {
                const rest = new Activity();
                rest.userId = userId;
                rest.created_name = firstName;
                rest.activity = 'Create new document';
                rest.before_status = 'Created';
                rest.after_status = status;
                rest.documentId = data.id;
                rest.save();
            }

            return data;
            // if (createDocumentsDto.tags.length > 0) {
            //     for (let i = 0; i < createDocumentsDto.tags.length; i++) {
            //         const rest = new DocumentTag();
            //         rest.documentId = data.id;
            //         rest.tagId = createDocumentsDto.tags[i].tagId;
            //         rest.save();
            //     }
            //     return data;
            // } else {
            //     return data;
            // }
        } catch (error) {
            throw new HttpException('ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // const tim = await User.create({ username: "tim" }).save();
    // await SharedNote.create({
    //   senderId: joe.id,
    //   targetId: tim.id,
    //   noteId: note.id
    // }).save();

    private async getUserApproval(id: number, userId: string) {
        const rest = await this.documentsRepository.findByPk<Documents>(id);
        if (!rest) {
            throw new HttpException('No document found', HttpStatus.NOT_FOUND);
        } else {
            let param = '';
            if (rest.status === 'approvalHOB') {
                param = 'approval';
            } else if (rest.status === 'approvalDirector') {
                param = 'director';
            } else if (
                rest.status === 'approvalCustodian' ||
                rest.status == 'publishCustodian'
            ) {
                param = 'castadian';
            } else if (rest.status === 'writeDocument') {
                param = 'documentWriter';
            } else if (
                rest.status === 'reviewOwner' ||
                rest.status === 'approvalOwner'
            ) {
                param = 'documentOwner';
            } else if (
                rest.status === 'documentReviewer' ||
                rest.status === 'approvalReviewer'
            ) {
                param = 'documentReviewer';
            }

            const rest2 = await User.findByPk(userId);
            if (!rest2) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            if (rest2.role != param) {
                throw new HttpException(
                    'You are unauthorized to manage this document',
                    HttpStatus.UNAUTHORIZED,
                );
            }
        }

        return rest;
    }

    private async getUserPost(id: number, userId: string) {
        const rest = await this.documentsRepository.findByPk<Documents>(id);
        if (!rest) {
            throw new HttpException('No document found', HttpStatus.NOT_FOUND);
        }
        if (rest.createdBy !== userId) {
            throw new HttpException(
                'You are unauthorized to manage this document',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return rest;
    }

    async updateApproval(
        id: number,
        userId: string,
        userName: string,
        updateApprovalDocumentsDto: UpdateApprovalDocumentsDto,
    ) {
        const rest = await this.getUserApproval(id, userId);
        const getStatus = await this.getNewStatus(
            rest.type,
            rest.status,
            updateApprovalDocumentsDto.parameter,
        );
        rest.status = getStatus.nextWorkflowStatus;
        rest.document_number = updateApprovalDocumentsDto.documentNumber;
        rest.category = updateApprovalDocumentsDto.category;
        rest.restriction = updateApprovalDocumentsDto.restriction;
        // rest.verifiedBy = userId;
        // rest.verified_name = userName;
        // rest.verifiedDate = new Date();
        const rest1 = rest.save();

        if (rest1) {
            const rest2 = new Activity();
            rest2.userId = userId;
            rest2.created_name = userName;
            rest2.activity =
                'Submit approval ' + updateApprovalDocumentsDto.parameter;
            rest2.comment = updateApprovalDocumentsDto.comment;
            rest2.before_status = getStatus.workflowStatus;
            rest2.after_status = getStatus.nextWorkflowStatus;
            rest2.documentId = id;
            rest2.save();
        }

        return rest1;
    }

    async updateApprovalS4(
        id: number,
        userId: string,
        userName: string,
        resFile: any,
        body: any,
    ) {
        // console.log('Dewa ======> ', resFile.length);
        const rest = await this.getUserApproval(id, userId);
        const getStatus = await this.getNewStatus(
            rest.type,
            rest.status,
            body.parameter,
        );
        rest.status = getStatus.nextWorkflowStatus;
        const rest1 = rest.save();

        var tags = body.tags.split(',');

        if (tags.length > 0) {
            for (let i = 0; i < tags.length; i++) {
                console.log(tags[i]);
                const dtag = new DocumentTag();
                dtag.documentId = rest.id;
                dtag.tagId = tags[i];
                dtag.save();
            }
        }

        if (resFile.length > 0) {
            for (let i = 0; i < resFile.length; i++) {
                // Logger.log(resFile[i], 'resFile');
                const fent = new FilesEntity();
                fent.documentId = id;
                fent.file = resFile[i].filename;
                fent.file_tipe_id = 1;
                fent.userId = userId;
                fent.save();
            }
        }

        if (rest1) {
            const rest2 = new Activity();
            rest2.userId = userId;
            rest2.created_name = userName;
            rest2.activity =
                'Submit approval ' + body.parameter;
            rest2.before_status = getStatus.workflowStatus;
            rest2.after_status = getStatus.nextWorkflowStatus;
            rest2.documentId = id;
            rest2.save();
        }

        // Logger.log(resFile);

        // if (resFile) {
        //     for (let i = 0; i < resFile.length; i++) {
        //         const element = resFile[i];
        //     }
        // }

        return rest1;
    }

    async update(
        id: number,
        userId: string,
        updateDocumentsDto: UpdateDocumentsDto,
    ) {
        const rest = await this.getUserPost(id, userId);
        rest.name = updateDocumentsDto.name || rest.name;
        rest.description = updateDocumentsDto.description || rest.description;
        rest.status = updateDocumentsDto.status || rest.status;
        // rest.verifiedBy = updateDocumentsDto.verified_by || rest.verifiedBy;
        // rest.verifiedDate = updateDocumentsDto.verified_at || rest.verifiedDate;
        rest.updatedAt = updateDocumentsDto.update_at || rest.updatedAt;
        rest.dueDate = updateDocumentsDto.due_date || rest.dueDate;
        return rest.save();
    }

    async delete(id: number, userId: string) {
        const rest = await this.getUserPost(id, userId);
        await rest.destroy();
        return rest;
    }

    async findGetOwn(
        createdBy: string,
        keyword?: string,
        offset = 0,
        limit = 10,
    ): Promise<DocumentsPaginateDto> {
        Logger.log(createdBy);
        let offsetNumber = 0 + (offset - 1) * limit;
        if (keyword) {
            const data = await this.documentsRepository.findAndCountAll({
                include: [
                    { model: User, as: 'user' },
                    { model: User, as: 'userVerified' },
                    Tags,
                ],
                where: {
                    name: {
                        [Op.like]: '%' + keyword + '%',
                    },
                    created_by: createdBy,
                },
                offset: offsetNumber,
                limit: limit,
            });

            return new DocumentsPaginateDto(data.count, data.rows);
        } else {
            const data = await this.documentsRepository.findAndCountAll({
                include: [
                    { model: User, as: 'user' },
                    { model: User, as: 'userVerified' },
                    Tags,
                ],
                where: {
                    created_by: createdBy,
                },
                offset: offsetNumber,
                limit: limit,
            });
            // Logger.log(data);
            // return data.map(datas => {
            // console.log(datas.tags);
            return new DocumentsPaginateDto(data.count, data.rows);
            // });
        }
    }

    async findGetTask(
        createdBy: string,
        role?: string,
        keyword?: string,
        offset = 0,
        limit = 10,
    ): Promise<DocumentsPaginateDto> {
        let offsetNumber = 0 + (offset - 1) * limit;

        const getWorkflowStatus = await this.workFlowStatusRepository.findAll<
            WorkflowStatus
        >({
            where: {
                role: role,
            },
        });
        console.log(getWorkflowStatus.length);
        // let getWorkflowStatus = await this.findGetRoleWorkflow(role);

        var status: string[] = []; //= ['documentOwner', 'approvalOwner'];

        if (getWorkflowStatus.length < 1) {
            throw new HttpException(
                'Workflow status not found',
                HttpStatus.NOT_FOUND,
            );
        } else {
            for (let i = 0; i < getWorkflowStatus.length; i++) {
                status.push(getWorkflowStatus[i].status);
                //status += '"' + getWorkflowStatus[i].status + '"';
            }
        }

        // Logger.log('dewa ' + status);

        if (keyword) {
            const data = await this.documentsRepository.findAndCountAll({
                include: [
                    // { model: User, as: 'user' },
                    // { model: User, as: 'userVerified' },
                    Tags,
                    DocumentType,
                    FilesEntity,
                ],
                where: {
                    name: {
                        [Op.like]: '%' + keyword + '%',
                    },
                    //created_by: createdBy,
                    status: {
                        [Op.in]: status,
                    },
                },
                offset: offsetNumber,
                limit: limit,
            });

            return new DocumentsPaginateDto(data.count, data.rows);
        } else {
            const data = await this.documentsRepository.findAndCountAll({
                include: [
                    // { model: User, as: 'user' },
                    // { model: User, as: 'userVerified' },
                    Tags,
                    DocumentType,
                    FilesEntity,
                ],
                where: {
                    //created_by: createdBy,
                    status: {
                        [Op.in]: status,
                    },
                },
                offset: offsetNumber,
                limit: limit,
            });
            Logger.log(data);
            // return data.map(datas => {
            // console.log(datas.tags);
            return new DocumentsPaginateDto(data.count, data.rows);
            // });
        }
    }

    async findGetRoleWorkflow(role: string) {
        const getWorkflowStatus = await this.workFlowStatusRepository.findAll<
            WorkflowStatus
        >({
            where: {
                role: role,
            },
        });
        return getWorkflowStatus.map(data => new WorkflowStatusDto(data));
    }

    async findGetParameterWorkflow(workflowStatus: string) {
        const posts = await this.workFlowFlowRepository.findAll<WorkflowFlow>({
            //include: [User],
            where: {
                workflow_status: workflowStatus,
            },
        });
        console.log(posts);
        return posts.map(post => new WorkflowFlowDto(post));
    }
}
