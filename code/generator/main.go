package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"sync"
	"sync/atomic"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
)

type Record struct {
	UUID      string `dynamodbav:"uuid"`
	Timestamp string `dynamodbav:"timestamp"`
	RecordID  int    `dynamodbav:"recordid"`
}

func main() {

	tableName := flag.String("t", "DynamodbCdcStack-sourcetable70CF4744-1T9IBS4KQDN1W", "DynamoDB table name")
	totalRecords := flag.Int("n", 10000, "Total number of records to write")
	recordsPerMillisecond := flag.Int("r", 10, "Number of records to write per millisecond")
	flag.Parse()

	//	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("ap-southeast-1"))
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	svc := dynamodb.NewFromConfig(cfg)

	recordChan := make(chan int, *totalRecords)

	var wg sync.WaitGroup
	var recordsWritten int64

	startTime := time.Now()

	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			writeRecords(svc, tableName, recordChan, &recordsWritten)
		}()
	}

	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			elapsedSeconds := time.Since(startTime).Seconds()
			avgRecordsPerSecond := float64(atomic.LoadInt64(&recordsWritten)) / elapsedSeconds
			fmt.Printf("Average records written per second: %.2f\n", avgRecordsPerSecond)
		}
	}()

	for i := 0; i < *totalRecords; i++ {
		recordChan <- i + 1
		if (i+1)%*recordsPerMillisecond == 0 {
			time.Sleep(10 * time.Millisecond)
		}
	}

	close(recordChan)
	wg.Wait()

	elapsedSeconds := time.Since(startTime).Seconds()
	avgRecordsPerSecond := float64(*totalRecords) / elapsedSeconds
	fmt.Printf("Total records written: %d\n", *totalRecords)
	fmt.Printf("Total time: %.2f seconds\n", elapsedSeconds)
	fmt.Printf("Final average records written per second: %.2f\n", avgRecordsPerSecond)
}

func writeRecords(svc *dynamodb.Client, tableName *string, recordChan <-chan int, recordsWritten *int64) {
	for recordID := range recordChan {
		recorduuid := uuid.New().String()
		timestamp := time.Now().Format(time.RFC3339Nano)

		record := Record{
			UUID:      recorduuid,
			Timestamp: timestamp,
			RecordID:  recordID,
		}

		item, err := attributevalue.MarshalMap(record)
		if err != nil {
			log.Printf("failed to marshal record %d, %v", recordID, err)
			continue
		}

		_, err = svc.PutItem(context.TODO(), &dynamodb.PutItemInput{
			TableName: tableName,
			Item:      item,
		})
		if err != nil {
			log.Printf("failed to put item %d, %v", recordID, err)
			continue
		}

		atomic.AddInt64(recordsWritten, 1)
	}
}
