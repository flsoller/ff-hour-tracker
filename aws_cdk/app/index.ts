#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HourTrackerApi } from '../lib';

const app = new cdk.App();
const stackStage = app.node.tryGetContext('stage_name');
new HourTrackerApi(app, `HourTrackerApi-${stackStage}`);

app.synth();
