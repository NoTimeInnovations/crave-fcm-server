export async function updateGitHubJson(newOffer) {

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = process.env.REPO_OWNER;
  const REPO_NAME = process.env.REPO_NAME;
  const FILE_PATH = process.env.FILE_PATH;

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    // Step 1: Fetch the current JSON file
    const getResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    let content;
    let sha;

    if (getResponse.ok) {
      const fileData = await getResponse.json();

      // Decode the content from Base64
      content = JSON.parse(
        Buffer.from(fileData.content, "base64").toString("utf-8")
      );
      sha = fileData.sha;
    } else if (getResponse.status === 404) {
      console.log("File not found, creating a new one.");
      content = { offers: [] };
    } else {
      throw new Error(
        `Failed to fetch JSON file: ${getResponse.status} ${getResponse.statusText}`
      );
    }

    // Step 2: Add the new offer
    if (!content.offers) {
      content.offers = [];
    }
    content.offers.push(newOffer);

    // Encode the updated JSON content back to Base64
    const updatedContent = Buffer.from(
      JSON.stringify(content, null, 2)
    ).toString("base64");

    // Step 3: Commit the updated file to GitHub
    const updateResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: sha
          ? "Update offers in JSON file"
          : "Create new offers JSON file",
        content: updatedContent,
        ...(sha && { sha }),
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(
        `Failed to update JSON file: ${updateResponse.status} ${updateResponse.statusText}`
      );
    }

    console.log("JSON file updated on GitHub!");
  } catch (error) {
    console.error("Error updating JSON file on GitHub:", error.message);
  }
}
