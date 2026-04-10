import { IsDateString, IsEnum, IsNumber, IsString } from "class-validator";
import { campaign_type_enum, jobs_status_enum } from "../enums/recurrence.enum";

export class jobMessageDto {
  @IsString()
  id: string;

  @IsString()
  id_channel: string;

  @IsString()
  id_recurrence: string;  // Id da recorrência ou do disparo

  @IsString()
  str_recurrence: string; //Nome da recorrência ou disparo

  @IsString()
  id_message: string;

  @IsString()
  id_contact: string;

  @IsNumber()
  int_sequence: number;

  @IsNumber()
  int_block: number;

  @IsString()
  str_message: string;

  @IsString()
  str_start_date: string;

  @IsString()
  str_end_date: string;

  @IsString()
  str_start_time: string;

  @IsString()
  str_end_time: string;

  @IsString()
  str_cron: string;

  @IsNumber()
  int_delay: number;

  @IsDateString()
  dtm_created: string;

  @IsDateString()
  dtm_updated: string;

  @IsString()
  id_user: string;

  @IsEnum(jobs_status_enum)
  enum_status: jobs_status_enum;

  @IsEnum(campaign_type_enum)
  enum_type: campaign_type_enum;
}

