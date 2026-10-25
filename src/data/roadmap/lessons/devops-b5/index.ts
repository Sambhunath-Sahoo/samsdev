import type { LessonEntry } from "@/types/roadmap";
import { NETWORKING_VPC_SUBNETS_GATEWAYS } from "./networking-vpc-subnets-gateways";
import { DATA_RDS } from "./data-rds";
import { LOAD_BALANCING_AND_AUTOSCALING } from "./load-balancing-and-autoscaling";
import { DNS_WITH_ROUTE_53 } from "./dns-with-route-53";
import { CONTAINERS_ON_AWS_ECR_ECS_EKS } from "./containers-on-aws-ecr-ecs-eks";
import { LAMBDA_AND_SERVERLESS_COMPUTE } from "./lambda-and-serverless-compute";
import { S3_AND_BUCKET_SECURITY } from "./s3-and-bucket-security";
import { BLOCK_AND_FILE_STORAGE_EBS_EFS } from "./block-and-file-storage-ebs-efs";
import { DATABASES_DYNAMODB_AND_ELASTICACHE } from "./databases-dynamodb-and-elasticache";
import { SECRETS_MANAGER_AND_PARAMETER_STORE } from "./secrets-manager-and-parameter-store";
import { MONITORING_CLOUDWATCH_AND_CLOUDTRAIL } from "./monitoring-cloudwatch-and-cloudtrail";
import { PRACTICE_ECS_FARGATE_RDS_ALB_ALARMS } from "./practice-ecs-fargate-rds-alb-alarms";

export const ENTRIES: readonly LessonEntry[] = [
  NETWORKING_VPC_SUBNETS_GATEWAYS,
  DATA_RDS,
  LOAD_BALANCING_AND_AUTOSCALING,
  DNS_WITH_ROUTE_53,
  CONTAINERS_ON_AWS_ECR_ECS_EKS,
  LAMBDA_AND_SERVERLESS_COMPUTE,
  S3_AND_BUCKET_SECURITY,
  BLOCK_AND_FILE_STORAGE_EBS_EFS,
  DATABASES_DYNAMODB_AND_ELASTICACHE,
  SECRETS_MANAGER_AND_PARAMETER_STORE,
  MONITORING_CLOUDWATCH_AND_CLOUDTRAIL,
  PRACTICE_ECS_FARGATE_RDS_ALB_ALARMS,
];
