export async function triggerGithubRender({
  seriesId,
  videoIndex,
  videoId,
  inputProps,
}: {
  seriesId: string;
  videoIndex: number;
  videoId: string;
  inputProps: any;
}) {
  const owner = process.env.GITHUB_OWNER; // Your GitHub username
  const repo = process.env.GITHUB_REPO;   // Your repo name
  const token = process.env.GH_PAT;      // Personal Access Token

  if (!owner || !repo || !token) {
    console.error("Missing GitHub credentials for dispatch");
    throw new Error("GitHub rendering not configured");
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "render-video",
        client_payload: {
          seriesId,
          videoIndex: videoIndex.toString(),
          videoId,
          inputProps: JSON.stringify(inputProps),
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub Dispatch failed: ${response.status} ${errorBody}`);
  }

  return { success: true };
}
