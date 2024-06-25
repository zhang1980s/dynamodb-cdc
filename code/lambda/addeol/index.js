"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
/**
 *
 * @param event
 * @returns processed data from dynamo db table.
 */
const handler = async (event) => {
    console.log('request:', JSON.stringify(event, undefined, 2));
    // Process the list of records and transform them
    const output = event.records.map((record) => {
        const decodedRecord = JSON.parse((Buffer.from(record.data, 'base64').toString()));
        const payload = (0, util_dynamodb_1.unmarshall)(decodedRecord.dynamodb.NewImage);
        // console.log('output payload: ', payload);
        // Generating output result and encoding the payload
        return {
            recordId: record.recordId,
            result: 'Ok',
            data: (Buffer.from(JSON.stringify(payload))).toString('base64'),
        };
    });
    console.log(`Processing completed.  Successful record(s) ${output.length}.`);
    return { records: output };
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxRUFBcUU7QUFDckUsaUNBQWlDO0FBQ2pDLDBEQUFvRDtBQUVwRDs7OztHQUlHO0FBQ0ksTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUN4QixLQUFVLEVBQ0UsRUFBRTtJQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELGlEQUFpRDtJQUNqRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO1FBQzdDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLE1BQU0sT0FBTyxHQUFHLElBQUEsMEJBQVUsRUFBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekMsb0RBQW9EO1FBQ3BELE9BQU87WUFDSCxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7WUFDekIsTUFBTSxFQUFFLElBQUk7WUFDWixJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7U0FDbEUsQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDN0UsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUMvQixDQUFDLENBQUE7QUFsQlksUUFBQSxPQUFPLFdBa0JuQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVC0wXG5pbXBvcnQgeyB1bm1hcnNoYWxsIH0gZnJvbSBcIkBhd3Mtc2RrL3V0aWwtZHluYW1vZGJcIjtcblxuLyoqXG4gKlxuICogQHBhcmFtIGV2ZW50XG4gKiBAcmV0dXJucyBwcm9jZXNzZWQgZGF0YSBmcm9tIGR5bmFtbyBkYiB0YWJsZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoXG4gICAgZXZlbnQ6IGFueVxuKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgICBjb25zb2xlLmxvZygncmVxdWVzdDonLCBKU09OLnN0cmluZ2lmeShldmVudCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgLy8gUHJvY2VzcyB0aGUgbGlzdCBvZiByZWNvcmRzIGFuZCB0cmFuc2Zvcm0gdGhlbVxuICAgIGNvbnN0IG91dHB1dCA9IGV2ZW50LnJlY29yZHMubWFwKChyZWNvcmQ6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBkZWNvZGVkUmVjb3JkID0gSlNPTi5wYXJzZSgoQnVmZmVyLmZyb20ocmVjb3JkLmRhdGEsICdiYXNlNjQnKS50b1N0cmluZygpKSk7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB1bm1hcnNoYWxsKGRlY29kZWRSZWNvcmQuZHluYW1vZGIuTmV3SW1hZ2UpO1xuICAgICAgICBjb25zb2xlLmxvZygnb3V0cHV0IHBheWxvYWQ6ICcsIHBheWxvYWQpO1xuICAgICAgICAvLyBHZW5lcmF0aW5nIG91dHB1dCByZXN1bHQgYW5kIGVuY29kaW5nIHRoZSBwYXlsb2FkXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZWNvcmRJZDogcmVjb3JkLnJlY29yZElkLFxuICAgICAgICAgICAgcmVzdWx0OiAnT2snLFxuICAgICAgICAgICAgZGF0YTogKEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKSkudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuICAgICAgICB9O1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGBQcm9jZXNzaW5nIGNvbXBsZXRlZC4gIFN1Y2Nlc3NmdWwgcmVjb3JkKHMpICR7b3V0cHV0Lmxlbmd0aH0uYCk7XG4gICAgcmV0dXJuIHsgcmVjb3Jkczogb3V0cHV0IH07XG59XG4iXX0=