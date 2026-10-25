import type { LessonEntry } from "@/types/roadmap";
import { SQL_FUNDAMENTALS_AND_INDEXING } from "./sql-fundamentals-and-indexing";
import { NOSQL_FAMILIES } from "./nosql-families";
import { CHOOSING_A_DATABASE } from "./choosing-a-database";
import { B_TREE_VS_LSM_TREE } from "./b-tree-vs-lsm-tree";
import { DENORMALIZATION_AND_VERTICAL_PARTITIONING } from "./denormalization-and-vertical-partitioning";
import { BLOOM_FILTERS } from "./bloom-filters";
import { CHANGE_DATA_CAPTURE } from "./change-data-capture";
import { SEARCH_AND_VECTOR_STORES } from "./search-and-vector-stores";
import { OBJECT_STORAGE } from "./object-storage";
import { OLTP_VS_OLAP } from "./oltp-vs-olap";
import { CONNECTION_POOLING } from "./connection-pooling";
import { N_PLUS_ONE_QUERIES } from "./n-plus-one-queries";
import { DATABASE_INDEXES } from "./database-indexes";
import { QUERY_OPTIMIZATION } from "./query-optimization";
import { EXPLAIN_ANALYZE } from "./explain-analyze";
import { DATABASE_CONSTRAINTS } from "./database-constraints";
import { DATABASE_MIGRATIONS } from "./database-migrations";

export const ENTRIES: readonly LessonEntry[] = [
  SQL_FUNDAMENTALS_AND_INDEXING,
  NOSQL_FAMILIES,
  CHOOSING_A_DATABASE,
  B_TREE_VS_LSM_TREE,
  DENORMALIZATION_AND_VERTICAL_PARTITIONING,
  BLOOM_FILTERS,
  CHANGE_DATA_CAPTURE,
  SEARCH_AND_VECTOR_STORES,
  OBJECT_STORAGE,
  OLTP_VS_OLAP,
  CONNECTION_POOLING,
  N_PLUS_ONE_QUERIES,
  DATABASE_INDEXES,
  QUERY_OPTIMIZATION,
  EXPLAIN_ANALYZE,
  DATABASE_CONSTRAINTS,
  DATABASE_MIGRATIONS,
];
