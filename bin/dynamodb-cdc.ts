#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DdbCdcStack } from '../lib/dynamodb-cdc-stack';

const app = new cdk.App();
const stackname = app.node.tryGetContext('stackName')

new DdbCdcStack(app, 'DdbCdcStack', {
    stackName: stackname,
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    }
});