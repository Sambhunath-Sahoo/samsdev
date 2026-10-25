import type { LessonEntry } from "@/types/roadmap";
import { CI_CD_CONCEPTS } from "./ci-cd-concepts";
import { GITHUB_ACTIONS_BASICS } from "./github-actions-basics";
import { IMAGE_TAGGING_AND_RELEASES } from "./image-tagging-and-releases";
import { DEPLOYMENT_STRATEGIES } from "./deployment-strategies";
import { PIPELINE_STAGES } from "./pipeline-stages";
import { SECRETS_IN_PIPELINES } from "./secrets-in-pipelines";
import { RUNNERS_SELF_HOSTED_VS_MANAGED } from "./runners-self-hosted-vs-managed";
import { ARTIFACTS_AND_CACHING } from "./artifacts-and-caching";
import { ENVIRONMENT_PROMOTION } from "./environment-promotion";
import { PIPELINE_AS_CODE } from "./pipeline-as-code";
import { OTHER_CI_TOOLS } from "./other-ci-tools";

export const ENTRIES: readonly LessonEntry[] = [
  CI_CD_CONCEPTS,
  GITHUB_ACTIONS_BASICS,
  IMAGE_TAGGING_AND_RELEASES,
  DEPLOYMENT_STRATEGIES,
  PIPELINE_STAGES,
  SECRETS_IN_PIPELINES,
  RUNNERS_SELF_HOSTED_VS_MANAGED,
  ARTIFACTS_AND_CACHING,
  ENVIRONMENT_PROMOTION,
  PIPELINE_AS_CODE,
  OTHER_CI_TOOLS,
];
