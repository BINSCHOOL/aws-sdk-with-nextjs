import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { connectAws } from "../../lib/connectAws";
import createTable from "../../lib/createTable";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new DynamoDBClient(connectAws());
const tableName = "UsersTable";

createTable();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST": 
        const { id, data } = req.body;

        if (!id || !data) {
          return res.status(400).json({ error: "Missing id or data" });
        }

        const putParams = {
          TableName: tableName,
          Item: {
            id: { S: id },
            data: { S: data },
          },
        };
        await client.send(new PutItemCommand(putParams));
        return res
          .status(200)
          .json({ message: "Item added/updated successfully" });

      case "GET":
        const getId = req.query.id as string;

        if (!getId) {
          return res.status(400).json({ error: "Missing id" });
        }

        const getParams = {
          TableName: tableName,
          Key: { id: { S: getId } },
        };
        const result = await client.send(new GetItemCommand(getParams));
        return result.Item
          ? res.status(200).json(result.Item)
          : res.status(404).json({ error: "Item not found" });

      case "DELETE": // Delete item
        const deleteId = req.query.id as string;

        if (!deleteId) {
          return res.status(400).json({ error: "Missing id" });
        }

        const deleteParams = {
          TableName: tableName,
          Key: { id: { S: deleteId } },
        };
        await client.send(new DeleteItemCommand(deleteParams));
        return res.status(200).json({ message: "Item deleted successfully" });

      case "PUT":
        const { updateId, updateData } = req.body;

        if (!updateId || !updateData) {
          return res
            .status(400)
            .json({ error: "Missing updateId or updateData" });
        }

        const updateParams = {
          TableName: tableName,
          Key: { id: { S: updateId } },
          UpdateExpression: "SET #data = :data",
          ExpressionAttributeNames: { "#data": "data" },
          ExpressionAttributeValues: { ":data": { S: updateData } },
        };
        await client.send(new UpdateItemCommand(updateParams));
        return res.status(200).json({ message: "Item updated successfully" });

      default:
        res.setHeader("Allow", ["POST", "GET", "DELETE", "PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
}
