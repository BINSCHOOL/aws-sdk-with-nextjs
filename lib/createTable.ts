import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb";
import { connectAws } from "./connectAws";

const client = new DynamoDBClient(connectAws());
const tableName = "UsersTable";

const createTable = async () => {
  const params: CreateTableCommandInput = {
    TableName: tableName,
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    const describeParams = { TableName: tableName };
    await client.send(new DescribeTableCommand(describeParams));
    console.log("Table already exists.");
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ResourceNotFoundException") {
      // Create the table if it doesn't exist
      await client.send(new CreateTableCommand(params));
      console.log(`Table ${tableName} created successfully.`);
    } else {
      console.error("Error checking table:", error); // Log the error
    }
  }
};

export default createTable;

createTable();
