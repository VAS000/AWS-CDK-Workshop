#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AwsCdkWorkshopStack } from '../lib/aws-cdk-workshop-stack';

const app = new cdk.App();
new AwsCdkWorkshopStack(app, 'AwsCdkWorkshopStack');
