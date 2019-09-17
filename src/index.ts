import * as path from "path";
import { codechecks, CodeChecksReport } from "@codechecks/client";
import { cruise, IForbiddenRuleType } from "dependency-cruiser";
import { pluralize } from "./utils";

interface DependencyCruiserOptions {
  paths: string[];
  exclude?: string;
  config?: string;
}

interface Violation {
  from: string;
  to: string;
  rule: {
    severity: "error";
    name: string;
  };
}

function canRequire(filePath: string): boolean {
  try {
    require(filePath);
    return true;
  } catch {
    return false;
  }
}

function readRuleSet(configFilePath?: string): { [key: string]: any } {
  if (configFilePath) {
    return require(path.resolve(configFilePath));
  } else if (canRequire(path.resolve(".dependency-cruiser.js"))) {
    return require(path.resolve(".dependency-cruiser.js"));
  } else if (canRequire(path.resolve(".dependency-cruiser.js"))) {
    return require(path.resolve(".dependency-cruiser.js"));
  }
  throw new Error("dependency-cruiser config not found");
}

async function dependencyCruiser(options: DependencyCruiserOptions): Promise<void> {
  const ruleSet = readRuleSet(options.config);

  const { output } = cruise(options.paths, {
    exclude: options.exclude,
    validate: true,
    ruleSet,
  });

  const errorsText = pluralize(output.summary.error, ["error", "errors"]);
  const warnsText = pluralize(output.summary.warn, ["warn", "warns"]);
  const infosText = pluralize(output.summary.info, ["info", "infos"]);
  const shortDescription = `Result: ${errorsText}, ${warnsText}, ${infosText}`;

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
