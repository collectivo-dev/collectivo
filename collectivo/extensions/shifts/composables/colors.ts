import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";

export function getStatusColor(status: ItemStatus) {
  switch (status) {
    case ItemStatus.ARCHIVED:
      return "gray";
    case ItemStatus.DRAFT:
      return "orange";
    case ItemStatus.PUBLISHED:
      return "primary";
  }
}
