import { Pinecone } from "@pinecone-database/pinecone";

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = () => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey:
        "pcsk_TkTqt_Nmu7kqmotJGN6hbeZLmuZLy3qv35rXCaBVHo4yamtwfRoLpshXDMvLeJ3Kv3i1u",
    });
  }
  return pineconeClient;
};

export const getIndex = () => {
  const client = getPineconeClient();
  return client.index("knowledgebase");
};
