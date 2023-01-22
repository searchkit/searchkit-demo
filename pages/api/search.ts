import Client from "@searchkit/api";
import { NextApiRequest, NextApiResponse } from "next";
import { config } from "./config";

const client = Client(config);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const results = await client.handleRequest(req.body, {
    // getQuery: (query, search_attributes) => {
    //   return [
    //     {
    //       combined_fields: {
    //         query,
    //         fields: search_attributes,
    //       },
    //     },
    //   ];
    // },
    // getBaseFilters: () => {
    //   return [
    //     {
    //       bool: {
    //         must: {
    //           range: {
    //             imdbrating: {
    //               gte: 1,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   ];
    // },
  });
  res.send(results);
}
