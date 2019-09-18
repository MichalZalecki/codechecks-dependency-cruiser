import * as path from "path";
import * as os from "os";
import { execSync } from "child_process";
import { codechecks, CodeChecksReport } from "@codechecks/client";
import { cruise } from "dependency-cruiser";
import { pluralize } from "./utils";

interface DependencyCruiserOptions {
  paths: string[];
  graph?: boolean;
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
  } else if (canRequire(path.resolve(".dependency-cruiser.json"))) {
    return require(path.resolve(".dependency-cruiser.json"));
  }
  throw new Error("dependency-cruiser config not found");
}

function createGraph(options: DependencyCruiserOptions): string {
  const result = cruise(options.paths, {
    exclude: options.exclude,
    outputType: "dot"
  });

  const { output } = result;

  const graphPath = path.join(os.tmpdir(), "dependencygraph.png");

  const r = execSync(`echo ${JSON.stringify(output)} | dot -T png > ${graphPath}`);
  console.log(r.toString());

  return graphPath;
}

async function dependencyCruiser(options: DependencyCruiserOptions): Promise<void> {
  const ruleSet = readRuleSet(options.config);

  const result = cruise(options.paths, {
    exclude: options.exclude,
    validate: true,
    ruleSet,
  });

  let graphPath: string | undefined;

  if (options.graph) {
    graphPath = createGraph(options);
  }

  const { output } = result;

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
  ${graphPath ? `
Graph generated: ${graphPath}` : ""}
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
