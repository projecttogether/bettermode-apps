import { TribeClient } from "@tribeplatform/gql-client";
import {
  MemberStatusInput,
  PostMappingTypeEnum,
} from "@tribeplatform/gql-client/types";
import * as dotenv from "dotenv";

dotenv.config();

// Randomly shuffle the members lis
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// Create pairs of members from the shuffled list
function assignPairs(members) {
  const shuffledMembers = shuffle(members);
  const pairs = [];

  // Create pairs of two members
  for (let i = 0; i < shuffledMembers.length; i += 2) {
    if (shuffledMembers[i + 1]) {
      pairs.push([shuffledMembers[i], shuffledMembers[i + 1]]);
    }
  }

  return pairs;
}

async function generateAccessToken() {
  const client = new TribeClient({
    graphqlUrl: "https://app.tribe.so/graphql",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  return client
    .generateToken({
      networkId: "3vCJvFnp3V",
    })
    .then(async (accessToken) => {
      return accessToken;
    });
}

// Description text for the post
const descriptionText =
  "Hier ist die Liste der Random Coffee Paare für diese Woche:";

// Main function to handle the process
// Is exported to be used by the serverless function (AWS Lambda)
export const handler = async () => {
  const accessToken = await generateAccessToken();

  // Initialize the Tribe client with access token
  const client = new TribeClient({
    graphqlUrl: "https://app.tribe.so/graphql",
    accessToken: accessToken,
  });

  // Get the list of verified members
  const members = await client.members
    .list({
      limit: 100,
      status: MemberStatusInput.VERIFIED,
    })
    .then((res) => {
      return res.edges.map((node) => node.node);
    });

  // Shuffle the members list and create pairs
  const pairs = assignPairs(members);

  const pairsHTML = pairs
    .map(
      ([person1, person2]) =>
        `<a class=\"text-actionAccent-600 hover:text-actionAccentHover-500\" data-id=\"${person1.id}\" data-type=\"mention\">${person1.name}</a>, und <a class=\"text-actionAccent-600 hover:text-actionAccentHover-500\" data-id=\"${person2.id}\" data-type=\"mention\">${person2.name}</a><br/>`
    )
    .join("");

  // Create the post with the list of pairs
  await client.posts
    .create({
      spaceId: "9oizLsjloepB",
      input: {
        postTypeId: "R78fANh7O7d1H2v",
        mappingFields: [
          {
            key: "title",
            type: PostMappingTypeEnum.text,
            value: '"Random Coffee dieser Woche ☕️"',
          },
          {
            key: "content",
            type: PostMappingTypeEnum.html,
            value: JSON.stringify(descriptionText + "<br>" + pairsHTML),
          },
        ],
        publish: true,
      },
    })
    .then(
      (res) => console.log("Post created"),
      (err) => console.log("Error during post creation:", err)
    );
};

// handler();
