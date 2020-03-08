import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamoDB from '@aws-cdk/aws-dynamodb';

export interface HitCounterProps {
	downstream: lambda.IFunction,
};

export class HitCounter extends cdk.Construct {

	public readonly handler: lambda.IFunction;

	constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
		super(scope, id);

		const table = new dynamoDB.Table(this, 'HitsCounter', {
			partitionKey: {
				name: 'path',
				type: dynamoDB.AttributeType.STRING,
			},
			readCapacity: 1,
			writeCapacity: 1,
		});

		this.handler = new lambda.Function(this, 'HitsCounterHandler', {
			runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'hitcounter.handler',
			code: lambda.Code.fromAsset('lambda'),
			environment: {
				DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
				HITS_TABLE_NAME: table.tableName,
			}
		});

		table.grantReadWriteData(this.handler);
		props.downstream.grantInvoke(this.handler);
	}
}