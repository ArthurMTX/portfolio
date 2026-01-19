
export interface GithubCommit {
  repo: string;
  message: string;
  url: string;
  date: string;
  additions?: number;
  deletions?: number;
}

export async function getRecentCommits(username: string): Promise<GithubCommit[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const events = await response.json();
    console.log(`Fetched ${events.length} events for ${username}`);
    
    const pushEvents = events.filter((event: { type: string }) => event.type === 'PushEvent');
    console.log(`Found ${pushEvents.length} PushEvents`);
    
    const commits: GithubCommit[] = [];

    for (const event of pushEvents) {
      if (commits.length >= 5) break;
      
      const repoName = event.repo.name.split('/')[1] || event.repo.name;
      
      if (event.payload && event.payload.commits && event.payload.commits.length > 0) {
        for (const commit of [...event.payload.commits].reverse()) {
          if (commits.length >= 5) break;
          
          commits.push({
            repo: repoName,
            message: commit.message,
            url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
            date: event.created_at,
          });
        }
      } else if (event.payload && event.payload.head) {
        // If commits are missing from payload (common in public events), fetch the head commit
        try {
          const commitResponse = await fetch(`https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`, {
            next: { revalidate: 86400 } // Cache commit details for 24h since they don't change
          });
          
          if (commitResponse.ok) {
            const commitData = await commitResponse.json();
            commits.push({
              repo: repoName,
              message: commitData.commit.message,
              url: commitData.html_url,
              date: commitData.commit.author.date,
            });
          } else {
            throw new Error('Failed to fetch commit details');
          }
        } catch {
          // Fallback if fetching commit fails
          const branch = event.payload.ref ? event.payload.ref.replace('refs/heads/', '') : 'main';
          commits.push({
            repo: repoName,
            message: `Pushed to ${branch}`,
            url: `https://github.com/${event.repo.name}/tree/${branch}`,
            date: event.created_at,
          });
        }
      } else {
        // Fallback for push events without detailed commits
        const branch = event.payload.ref ? event.payload.ref.replace('refs/heads/', '') : 'main';
        commits.push({
          repo: repoName,
          message: `Pushed to ${branch}`,
          url: `https://github.com/${event.repo.name}/tree/${branch}`,
          date: event.created_at,
        });
      }
    }

    return commits;
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    return [];
  }
}
