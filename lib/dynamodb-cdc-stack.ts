import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';


export class DynamodbCdcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create cdcBucket
    const cdcBucket = new s3.Bucket(this, 'ddb-cdc-bucket',{
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    // Create cdcStream
    const cdcStream = new kinesis.Stream(this, 'cdcStream', {
      streamName: 'cdcstream',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    // Create DDB table
    const cdcTable = new dynamodb.Table(this, 'sourcetable', {
      partitionKey: {
        name: 'uuid', type: dynamodb.AttributeType.STRING
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      kinesisStream: cdcStream,
    })

    const ddbcdcDatabase = new glue.CfnDatabase(this, 'ddbcdcdatabase', {
      catalogId: this.account,
      databaseInput: {
        name: 'ddbcdcdatabase',
        description :'Glue database for DynamoDB CDC',
      }
    })

    const ddbcdcFirehoseStreamRole = new iam.Role(this, 'ddbcdcfirehosestreamrole',{
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com')
    });

    const ddbcdclogGroup = new logs.LogGroup(this, 'ddbcdcfirehoseloggroup', {
      retention: logs.RetentionDays.FIVE_DAYS,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    const ddbcdclogStream = new logs.LogStream(this, 'FirehoseLogStream',{
      logGroup: ddbcdclogGroup,
    })

    cdcStream.grantRead(ddbcdcFirehoseStreamRole);
    cdcBucket.grantWrite(ddbcdcFirehoseStreamRole);
    ddbcdclogGroup.grantWrite(ddbcdcFirehoseStreamRole);

    // const ddbcdcFirehoseStream = new firehose.CfnDeliveryStream(this, 'ddbcdcfirehosestream',{
    //   deliveryStreamName: 'ddb-cdc-stream',
    //   deliveryStreamType: 'KinesisStreamAsSource',
    //   kinesisStreamSourceConfiguration: {
    //     kinesisStreamArn: cdcStream.streamArn,
    //     roleArn: ddbcdcFirehoseStreamRole.roleArn,
    //   },
    //   s3DestinationConfiguration: {
    //     bucketArn: cdcBucket.bucketArn,
    //     bufferingHints: {
    //       intervalInSeconds: 30,
    //       sizeInMBs: 1,
    //     },
    //     roleArn: ddbcdcFirehoseStreamRole.roleArn,
    //     cloudWatchLoggingOptions: {
    //       enabled: true,
    //       logGroupName: ddbcdclogGroup.logGroupName,
    //       logStreamName: ddbcdclogStream.logStreamName,
    //     },
    //   }
    // })
  }
}
