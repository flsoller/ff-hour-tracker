#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HourTrackerApi } from "../lib/api";
import { HourTrackerImageRepositories } from "../lib/ecr";

const app = new cdk.App();
new HourTrackerImageRepositories(app, "HourTrackerImageRepositories");
new HourTrackerApi(app, "HourTrackerApi");

app.synth();
