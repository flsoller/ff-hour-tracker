import { Template } from "aws-cdk-lib/assertions";

function findByKeyName(source: object, target: string, regex: RegExp): string {
  const [resource] = Object.keys(source).filter((key) =>
    key.includes(target.replace(regex, "").toLowerCase())
  );

  if (!resource) {
    throw new Error(`Resource not found: ${target}`);
  }
  return resource;
}

export function cdkResourceFinder(
  resourcesObject: Template,
  desiredResourceName: string
): string {
  const templateResources = resourcesObject.toJSON().Resources;
  const resource = findByKeyName(templateResources, desiredResourceName, /-/g);
  return templateResources[resource];
}

export function cdkResourceFinderWithTypeFilter(
  resourcesObject: Template,
  resourceType: string,
  desiredResourceName: string
) {
  const templateResources = resourcesObject.findResources(resourceType);
  const resource = findByKeyName(templateResources, desiredResourceName, /-/g);
  return templateResources[resource];
}
