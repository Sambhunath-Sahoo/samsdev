import type { LessonEntry } from "@/types/roadmap";
import { TERRAFORM_BASICS } from "./terraform-basics";
import { TERRAFORM_STATE_AND_MODULES } from "./terraform-state-and-modules";
import { TERRAFORM_ENVIRONMENTS_AND_CI } from "./terraform-environments-and-ci";
import { GITOPS_WORKFLOW } from "./gitops-workflow";
import { ANSIBLE_INVENTORY_PLAYBOOKS_ROLES } from "./ansible-inventory-playbooks-roles";
import { TERRAFORM_VS_ANSIBLE } from "./terraform-vs-ansible";
import { CLOUDFORMATION_AND_PULUMI_VS_TERRAFORM } from "./cloudformation-and-pulumi-vs-terraform";
import { PRACTICE_TERRAFORM_EC2_VPC_ANSIBLE } from "./practice-terraform-ec2-vpc-ansible";

export const ENTRIES: readonly LessonEntry[] = [
  TERRAFORM_BASICS,
  TERRAFORM_STATE_AND_MODULES,
  TERRAFORM_ENVIRONMENTS_AND_CI,
  GITOPS_WORKFLOW,
  ANSIBLE_INVENTORY_PLAYBOOKS_ROLES,
  TERRAFORM_VS_ANSIBLE,
  CLOUDFORMATION_AND_PULUMI_VS_TERRAFORM,
  PRACTICE_TERRAFORM_EC2_VPC_ANSIBLE,
];
