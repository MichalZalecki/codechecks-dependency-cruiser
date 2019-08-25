import { IForbiddenRuleType } from "dependency-cruiser";

export const noOrphans: IForbiddenRuleType = {
  name: "no-orphans",
  severity: "error",
  from: { orphan: true },
  to: {},
};
