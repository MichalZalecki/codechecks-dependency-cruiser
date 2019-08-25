import { codechecks, CodeChecksReport } from "@codechecks/client";
import { cruise, IForbiddenRuleType } from "dependency-cruiser";
import { noOrphans } from "./rules";
import { pluralize } from "./utils";

type RuleName = "no-orphans";

interface DependencyCruiserOptions {
  paths: string[];
  rules: RuleName[];
}

interface Violation {
  from: string;
  to: string;
  rule: {
    severity: "error";
    name: RuleName;
  };
}

const rules: { [key in RuleName]: IForbiddenRuleType } = {
  "no-orphans": noOrphans,
};

async function dependencyCruiser(options: DependencyCruiserOptions): Promise<void> {
  const forbidden = options.rules.map(ruleName => rules[ruleName]);

  const { output } = cruise(options.paths, {
    exclude: "(node_modules)",
    validate: true,
    ruleSet: {
      forbidden,
    },
  });

  const shortDescription = `Result: ${pluralize(output.summary.error, ["errors", "error", "errors"])}`;

  const longDescription = `
| Path | Violation | Severity |
| :--: | :-------: | :------: |
${output.summary.violations
  .map((v: Violation) => `| ${v.from} | ${v.rule.name} | ${v.rule.severity} |`)
  .join("\n")}
  `;

  const report: CodeChecksReport = {
    name: "Dependency Cruiser",
    shortDescription,
    longDescription,
    status: output.summary.error > 0 ? "failure" : "success",
  };

  codechecks.report(report);
}

export default dependencyCruiser;
