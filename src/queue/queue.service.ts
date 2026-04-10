import { EnvService } from '@/env/env.service';
import { BullBoardInstance, InjectBullBoard } from '@bull-board/nestjs';
import { Injectable, Logger } from "@nestjs/common";
import { Job, JobType, Queue, Worker } from "bullmq";
import { jobMessageDto } from "./dto/job-message.dto";
//import { BaseAdapter } from "@bull-board/api/dist/src/queueAdapters/base";
import { PrismaService } from "@/prisma/prisma.service";
import { RedisService } from "@/redis/redis.service";
import { BaseAdapter } from "@bull-board/api/baseAdapter";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Prisma } from "@prisma/client";
import { campaign_type_enum, jobs_status_enum } from "./enums/recurrence.enum";
//import { WhatsAppService } from "src/whatsapp/whatsapp.service";




export const queuePool: Set<Queue> = new Set<Queue>();
export const queues: { name: string, queue: Queue, worker: Worker }[] = [];

@Injectable()
export class QueueService {
    protected readonly logger = new Logger(QueueService.name);

    constructor(
        @InjectBullBoard() private readonly boardInstance: BullBoardInstance,
        private readonly prismaService: PrismaService,
        private readonly configService: EnvService,
        private readonly redisService: RedisService,
        //private readonly whatsappService: WhatsAppService,
    ) {

        //Cria Fila da recorrência diária para gerar o Jobs da s recorrência
        this.createQueue({
            id: "1",
            id_channel: "Create jobs",
            id_recurrence: "1",
            str_recurrence: "Create jobs",
            id_message: "0",
            id_contact: "0",
            int_sequence: 1,
            int_block: 1,
            str_message: "",
            str_start_date: "0",
            str_end_date: "0",
            str_start_time: "0",
            str_end_time: "0",
            str_cron: "0 20 20 * * *",
            int_delay: 0,
            dtm_created: "2001-01-01 20:00:00",
            dtm_updated: "2001-01-01 20:00:00",
            id_user: "1",
            enum_status: jobs_status_enum.WAITING_TO_START,
            enum_type: campaign_type_enum.PROGRAMMED
        });
        //Limpa filas
    }

    async createQueue(dto: jobMessageDto): Promise<string | undefined> {
        //console.log('inicio');
        let queueAux: Queue | undefined;
        let workerAux: Worker | undefined;
        let jobData = dto;
        let int_delay_schedule = 0;
        let str_queue = "";
        const newDate = new Date();

        queuePool.clear();

        //Verifica se o JOB é um disparo ou recorrência
        if (dto.enum_type == campaign_type_enum.PUNCTUAL) {
            str_queue = dto.id_recurrence + ' - ' + dto.str_recurrence + ' (Disparo)';
        }
        else {
            str_queue = dto.id_recurrence + ' - ' + dto.str_recurrence + ' (Recorrência)';
        }

        if (queues.length > 0) {
            if (queues.find(x => x.name == str_queue) != undefined) {
                queueAux = queues.find(x => x.name == str_queue)?.queue;
                workerAux = queues.find(x => x.name == str_queue)?.worker;
            }
        }

        if (queueAux == undefined) {

            //Criar fila
            queueAux = new Queue(str_queue, { connection: { host: this.configService.get('REDIS_HOST'), port: Number(this.configService.get('REDIS_PORT')) } });

            //Limpa fila
            queueAux.drain(true);
            //queueAux.remove()
            let repeatableJobs = await queueAux?.getRepeatableJobs()
            repeatableJobs.forEach(async job => {
                await queueAux?.removeRepeatableByKey(job.key);
            });

            //Cria processor quem executa os jobs
            workerAux = new Worker(str_queue,
                async (job: Job) => {


                    //Envia para o whatsApp                    
                    //this.whatsappService.sendMessage(data.id + '@s.whatsapp.net', data.message + ' channel id ' + data.channelId);

                    //Verificar se já passou do horário limite
                    if (dto.str_end_date != "0" && dto.str_end_date != "" && dto.str_end_time != "0" && dto.str_end_time != "") {
                        if ((new Date()).toISOString() > (new Date(dto.str_end_date + ' ' + dto.str_end_time)).toISOString()) {
                            //Pausa processo ew reagenda para o dia seguinte.
                            workerAux?.pause(true);
                            await this.PauseJobs(str_queue);
                        }
                    }
                },
                { connection: { host: this.configService.get('REDIS_HOST'), port: Number(this.configService.get('REDIS_PORT')) } }

            );

            //Evento quando ativa a JOB
            workerAux.on('active', (job: Job, returnValue: any) => {
                const { id, name, queueName, finishedOn, returnvalue } = job;
                const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
                this.logger.log(
                    `Job id: ${id}, name: ${name} active in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
                );

                const data: jobMessageDto = job.data;
                //Verificar se é o JOB de geração das recorrências
                if (data.str_recurrence == "Create jobs") {
                    console.log('Create JOBS from daily recurrence.');
                    const create_result = this.CreateJobsToProcess();
                    console.log(create_result);
                    console.log('Fim Create JOBS from daily recurrence.');
                }
            });

            workerAux.on('completed', (job: Job, returnValue: any) => {
                const { id, name, queueName, finishedOn, returnvalue } = job;
                const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';

                let str_json: string = "";

                this.logger.log(
                    `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
                );
                const newDate = new Date();

                //Atualiza data e hora de finalização
                jobData.str_end_time = newDate.getHours().toString() + ":" + newDate.getMinutes().toString() + ":" + newDate.getSeconds().toString() + ":" + newDate.getMilliseconds().toString();
                jobData.str_end_date = newDate.getDay().toString() + "/" + newDate.getMonth().toString() + "/" + newDate.getFullYear().toString();
                job.updateData(jobData);
                job.updateProgress(100);

                //Atualiza status do JOB no banco de dados                
                console.log('Atualiza status do JOB no banco de dados');
                if (jobData.str_recurrence != "Create jobs") {
                    this.AtualizaStatusJob(jobData);
                }
            });

            workerAux.on('failed', (job, error: Error) => {
                console.log('Falhou ', job?.id)
                //console.error('worker fail', job, error, new Date());
            });

            queues.push({ name: str_queue, queue: queueAux, worker: workerAux })
        }

        queuePool.add(queueAux);

        const Aux_queues = [...queuePool].reduce((acc: BaseAdapter[], val) => {
            acc.push(new BullMQAdapter(val))
            return acc
        }, []);

        this.boardInstance.addQueue(Aux_queues[queuePool.size - 1]);

        //Aplica delay quando for agendamento
        if (dto.str_end_date != "0" && dto.str_end_date != "" && dto.str_end_time != "0" && dto.str_end_time != "") {
            if ((new Date(dto.str_start_date + ' ' + dto.str_start_time)).toISOString() > (new Date()).toISOString()) {
                int_delay_schedule = Number(new Date(dto.str_start_date + ' ' + dto.str_start_time)) - Date.now();
            }
        }
        else {
            int_delay_schedule = 0;
        }

        let jobNew: Job;
        if (dto.str_cron.length > 0 && dto.str_cron != null) {
            jobNew = await queueAux.add(dto.id,
                dto,
                {
                    jobId: dto.id,
                    delay: dto.int_delay + int_delay_schedule,
                    repeat: { pattern: dto.str_cron }
                });
        }
        else {
            jobNew = await queueAux.add(dto.id,
                dto,
                {
                    jobId: dto.id,
                    delay: dto.int_delay + int_delay_schedule,
                });

        }

        /*console.log('carrega queues');
        const arr_queue = await this.redisService.getAllQueues();
        console.log(arr_queue);*/

        return jobNew.id || '';
    }

    async delayedJob(str_queue: string, str_jobId: string, int_delay: number): Promise<any> {
        var msg: string = "";
        if (queues.length > 0) {
            if (int_delay = 0) {
                int_delay = 40000;
            }
            if (queues.find(x => x.name == str_queue) != undefined) {
                const queueAux = queues.find(x => x.name == str_queue)?.queue;
                const workerAux = queues.find(x => x.name == str_queue)?.worker;
                //let job:Job | undefined;
                const job = queueAux?.getJob(str_jobId);
                (await job)?.changeDelay(int_delay);
                msg = `Paused for ${int_delay / 1000} seconds.`;
            }
            else {
                msg = `Queue ${str_queue} not exists.`;
            }
        }
        else {
            msg = `Job ${str_jobId} not exists.`;
        }

        return msg;

    }

    async getJobsToProcess(): Promise<any> {

        let int_cont = 0;
        const jobs_data = this.prismaService.$queryRaw<jobMessageDto[]>(Prisma.sql(["select * from f_sel_tbl_jobs('0',null,null,null,null,'WAITING_TO_START',null)"]));

        //const jobs: jobMessageDto[] = JSON.parse((await jobs_data).toString());

        if (jobs_data != null) {
            (await jobs_data).forEach(element => {
                int_cont = 1;
                console.log(element);
                this.createQueue(element);
            });
        }
        if (int_cont == 0) {
            console.log('Não encontrou recurrencias para serem disparadas.')
        }
        return jobs_data;
    }

    async CreateJobsToProcess(): Promise<any> {

        const result = this.prismaService.$queryRaw(Prisma.sql(["select * from f_create_job_recurrence('',null,null)"]));
        console.log(result);
        console.log('Success jobs created.');
        console.log('Select jobs created.');
        this.getJobsToProcess();
        return result;
    }

    async getSelectTable(table: string, filters?: string[]): Promise<any> {
        //Variável que irá montar os filtros
        let str_filters: string = '';

        //Query que ira efetuar a consulta no banco
        let str_query: string = 'select * from f_sel_tbl_';

        //Identificar os filtros informado 
        filters?.forEach(element => {
            str_filters += "'" + element + "',";
        });

        //Junta query e filtros
        str_query += table + '(' + str_filters.substring(0, str_filters.length - 1) + ')'

        //Transforma string em query e execurta no banco de dados
        const result = await this.prismaService.$queryRaw(Prisma.sql([str_query]));
        return result;

    }

    async maintenanceTable(table: string, dados: any[]): Promise<any> {
        //Envia JSON contendo os registros e a tabela para serem processados no banco de dados
        ///--Não esquecer
        //const result = await this.prismaService.maintenanceTable(JSON.stringify(dados), table);
        //return result;
        return '';
    }

    //Pausa os jobs de uma queue
    private async PauseJobs(queueName: string) {
        let int_delay_schedule = 0;

        const queueJob = queues.find(x => x.name == queueName)?.queue;
        const workerJob = queues.find(x => x.name == queueName)?.worker;
        const jobs = queueJob?.getJobs(["paused"]);
        let dataAtu = new Date();
        dataAtu.setDate(dataAtu.getDate() + 1);

        if (jobs != null && (await jobs).length > 0) {
            (await jobs).forEach(element => {
                int_delay_schedule = Number(new Date(this.formatDate(dataAtu) + ' ' + element.data.str_start_time)) - Date.now();
                element.changeDelay(int_delay_schedule);
            });

            //Reiniciar processor
            workerJob?.resume();
        }
    }

    private formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    private AtualizaStatusJob(job: jobMessageDto) {
        let str_json = '';
        let str_jsonEnd = '[' +
            '{' +
            '"str_operation": "U",';

        job.enum_status = jobs_status_enum.FINISHED;
        str_json = JSON.stringify(job);
        str_jsonEnd += str_json.replace('{', '').replace('}', '}]')
        ///--Não esquecer
        //this.prismaService.maintenanceTable("jobs", str_jsonEnd);
        //this.logger.log(`JSON str_jsonEnd: ${str_jsonEnd}`);

    }

    //Limpa Jobs de uma queue
    private async cleanQueue(queueName: string, jobtype?: JobType[], jobdate?: Date) {
        const queueJob = queues.find(x => x.name == queueName)?.queue;
        const workerJob = queues.find(x => x.name == queueName)?.worker;
        const jobs = queueJob?.getJobs(jobtype)

        if (jobs != null && (await jobs).length > 0) {
            (await jobs).forEach(element => {
                if (jobdate != undefined) {
                    //Caso tenha informado a data valida se o jobs esta com data de término menor que data informada como parametro
                    if (new Date(element.data.str_end_date).toISOString() < jobdate.toISOString()) {
                        queueJob?.remove(element.data.id);
                    }
                }
                else {
                    //Senão informou data remove todo os Jobs encontrados
                    queueJob?.remove(element.data.id);
                }
            });
        }
    }
}


