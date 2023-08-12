#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HourTrackerApi } from '../lib';

const app = new cdk.App();
new HourTrackerApi(app, 'HourTrackerApi');

app.synth();
