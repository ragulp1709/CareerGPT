from httpx import AsyncClient
from config import settings
import logging

logger = logging.getLogger(__name__)


async def analyze_github_profile(username: str) -> dict:
    headers = {}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"

    async with AsyncClient() as client:
        # Get user info
        user_resp = await client.get(f"https://api.github.com/users/{username}", headers=headers)
        if user_resp.status_code != 200:
            raise ValueError(f"GitHub user '{username}' not found")
        user_data = user_resp.json()

        # Get repos
        repos_resp = await client.get(
            f"https://api.github.com/users/{username}/repos",
            params={"per_page": 100, "sort": "updated"},
            headers=headers,
        )
        repos = repos_resp.json() if repos_resp.status_code == 200 else []

    languages: dict[str, int] = {}
    top_repos = []

    for repo in repos:
        if repo.get("fork"):
            continue
        lang = repo.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1
        top_repos.append({
            "name": repo["name"],
            "description": repo.get("description", ""),
            "stars": repo.get("stargazers_count", 0),
            "language": lang,
            "url": repo.get("html_url", ""),
        })

    top_repos = sorted(top_repos, key=lambda r: r["stars"], reverse=True)[:5]
    lang_list = sorted(languages, key=languages.get, reverse=True)

    contribution_score = min(100, user_data.get("public_repos", 0) * 2 + user_data.get("followers", 0))
    overall_score = min(10, len(lang_list) * 0.5 + len(top_repos) * 0.5 + contribution_score / 20)

    missing_projects: list[str] = []
    common_projects = ["portfolio website", "REST API", "CLI tool", "machine learning model", "full-stack app"]
    for project in common_projects:
        found = any(project.lower() in r["name"].lower() or project.lower() in (r["description"] or "").lower()
                    for r in top_repos)
        if not found:
            missing_projects.append(project)

    return {
        "username": username,
        "total_repos": user_data.get("public_repos", 0),
        "languages_used": lang_list,
        "top_repos": top_repos,
        "contribution_score": contribution_score,
        "missing_portfolio_projects": missing_projects[:3],
        "overall_score": round(overall_score, 1),
        "recommendations": [
            f"Add more projects in {lang_list[0]}" if lang_list else "Start coding!",
            "Add descriptive READMEs to your repositories",
            "Pin your best projects on your profile",
            "Contribute to open source projects",
        ],
    }
